import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

import { comparePassword } from "../utils/auth";
import { generate_otp } from "../utils";
import { MessageResponse } from "../utils/enum";
import {
  send_verification_email,
  send_reset_password_email,
} from "../utils/auth";
import { userService } from "../user/service";
import { authService } from "./service";
import { IVerifiedEmail } from "./interface";

dotenv.config();

const GOOGLE_AUTH_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;
const GOOGLE_AUTH_CLIENT_SECRET = process.env.GOOGLE_AUTH_CLIENT_SECRET;
const GOOGLE_AUTH_REDIRECT_URL = process.env.GOOGLE_AUTH_REDIRECT_URL;
const redirectUrl = GOOGLE_AUTH_REDIRECT_URL;

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string; // The Google user's unique ID
  // Add more fields if needed from Google's response
}

class AuthController {
  public async generate_google_auth_url(req: Request, res: Response) {
    const client = new OAuth2Client(
      GOOGLE_AUTH_CLIENT_ID,
      GOOGLE_AUTH_CLIENT_SECRET,
      redirectUrl
    );

    const authorizeUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      prompt: "consent",
    });

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Auth Url generated successfully",
      data: { authorizeUrl },
    });
  }

  public async google_sign_in(req: Request, res: Response) {
    const { code } = req.query;
    const retrived_code = code as string;

    const client = new OAuth2Client(
      GOOGLE_AUTH_CLIENT_ID,
      GOOGLE_AUTH_CLIENT_SECRET,
      redirectUrl
    );

    // Exchange authorization code for tokens
    const responseInfo = await client.getToken(retrived_code);
    await client.setCredentials(responseInfo.tokens);

    const access_token = responseInfo.tokens.access_token;

    if (!access_token) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "Access token not found",
        data: null,
      });
    }

    // Fetch the user info using the access token
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    const data: GoogleUserInfo = await response.json();

    const email = data.email;

    if (!email) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User email not found!",
        data: null,
      });
    }

    const user_exists = await userService.findUserByEmail(email);

    if (!user_exists) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "Email does not exist!",
        data: null,
      });
    }

    const is_email_verified = await authService.check_email_verification_status(
      user_exists.email
    );

    if (!is_email_verified) {
      const verifyEmail: IVerifiedEmail = {
        email: user_exists.email,
      };

      const email_verified = await authService.verify_email(verifyEmail);

      if (!email_verified) {
        return res.status(404).json({
          message: MessageResponse.Error,
          description: "User not found!",
          data: null,
        });
      }
    }

    const token = jwt.sign(
      { userId: user_exists._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.TOKEN_EXPIRY,
      }
    );

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Logged in successfully",
      data: {
        token,
      },
    });
  }

  public async sign_up(req: Request, res: Response) {
    const { email: retrivedEmail } = req.body;

    const userExists = await userService.findUserByEmail(retrivedEmail);

    if (userExists) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Email already exist!",
        data: null,
      });
    }

    const user = await authService.createUser(req);

    const otp = generate_otp();

    const email = user.email;

    await authService.save_otp({ email, otp });

    await send_verification_email({ email, otp });

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "User creation completed, verify email!",
      data: null,
    });
  }

  public async email_verify_otp(req: Request, res: Response) {
    const { email, otp } = req.body;

    const is_email_verified = await authService.check_email_verification_status(
      email
    );

    if (is_email_verified) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Email Already Verified",
        data: null,
      });
    }

    const user_otp_validity = await authService.validate_otp(email, otp);

    if (!user_otp_validity) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Invalid otp",
        data: null,
      });
    }

    if (user_otp_validity.email_verify_otp_expiration !== undefined) {
      const currentDate = new Date();

      const expirationDate = new Date(
        user_otp_validity.email_verify_otp_expiration
      );

      if (expirationDate < currentDate) {
        return res.status(400).json({
          message: MessageResponse.Error,
          description: "Email verification OTP expired",
          data: null,
        });
      }

      const verifyEmail: IVerifiedEmail = {
        email: email,
      };

      const email_verified = await authService.verify_email(verifyEmail);

      if (!email_verified) {
        return res.status(404).json({
          message: MessageResponse.Error,
          description: "User not found!",
          data: null,
        });
      }

      await authService.delete_otp(email);

      return res.status(201).json({
        message: MessageResponse.Success,
        description: "Verification successful",
        data: null,
      });
    } else {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Email verification OTP expired",
        data: null,
      });
    }
  }

  public async resend_email_vertfication_otp(req: Request, res: Response) {
    const { email: retrivedEmail } = req.body;

    const user = await userService.findUserByEmail(retrivedEmail);

    if (!user) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    const email = user.email;

    const otp = generate_otp();

    await authService.save_otp({ email, otp });

    await send_verification_email({ email, otp });

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Verification token resent!",
      data: null,
    });
  }

  public async sign_in(req: Request, res: Response) {
    const { password, email } = req.body;

    const user_exists = await userService.findUserByEmail(email);

    if (!user_exists) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    const is_email_verified = await authService.check_email_verification_status(
      email
    );

    if (!is_email_verified) {
      const otp = generate_otp();

      const email = user_exists.email;

      await authService.save_otp({ email, otp });

      await send_verification_email({ email, otp });

      return res.status(201).json({
        message: MessageResponse.Success,
        description: `A  verication link  has been sent to ${email}!`,
        data: null,
      });
    }

    const match = await comparePassword(password, user_exists.password);

    if (!match) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    const token = jwt.sign(
      { userId: user_exists._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.TOKEN_EXPIRY,
      }
    );

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Logged in successfully",
      data: {
        token,
      },
    });
  }

  public async forgot_password_otp(req: Request, res: Response) {
    const { email } = req.body;

    const user_exists = await userService.findUserByEmail(email);

    if (user_exists) {
      const otp = generate_otp();

      const emailVerify = await authService.save_otp({ email, otp });

      if (!emailVerify) {
        return res.status(404).json({
          message: MessageResponse.Error,
          description: "User not found",
          data: null,
        });
      }

      await send_reset_password_email({
        email,
        otp,
      });

      return res.status(201).json({
        message: MessageResponse.Success,
        description: "An OTP has been sent to your email address",
        data: null,
      });
    }

    return res.status(404).json({
      message: MessageResponse.Error,
      description: "Email does not exists",
      data: null,
    });
  }

  public async forgot_password_change(req: Request, res: Response) {
    const { email, otp, password } = req.body;

    const user = await authService.validate_otp(email, otp);

    if (!user) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Invalid otp",
        data: null,
      });
    }

    if (user.email_verify_otp_expiration !== undefined) {
      const currentDate = new Date();

      const expirationDate = new Date(user.email_verify_otp_expiration);

      if (expirationDate < currentDate) {
        return res.status(400).json({
          message: MessageResponse.Error,
          description: "Verification OTP expired",
          data: null,
        });
      }

      await authService.delete_otp(email);

      await authService.change_password(email, password);

      return res.status(201).json({
        message: MessageResponse.Success,
        description: "Password Changed Successfully!",
        data: null,
      });
    }

    return res.status(400).json({
      message: MessageResponse.Error,
      description: "Verification OTP expired",
      data: null,
    });
  }

  // public async checkEmailExistence(req: Request, res: Response) {
  //   const { email } = req.body;

  //   const userExists = await userService.findUserByEmail(email);

  //   if (!userExists || !userExists?.completedRegistration) {
  //     const otp = Crypto.randomBytes(4).toString("hex");

  //     if (!userExists) {
  //       await authService.createUserEmail(email);
  //     }
  //     const emailVerify = await authService.saveOTP({ email, otp });

  //     if (!emailVerify) {
  //       return res.status(404).json({
  //         message: MessageResponse.Error,
  //         description: "User not found",
  //         data: null,
  //       });
  //     }

  //     await send_verification_email({
  //       email,
  //       otp,
  //     });

  //     return res.status(201).json({
  //       message: MessageResponse.Success,
  //       description: "An OTP has been sent to your email address",
  //       data: null,
  //     });
  //   }

  //   return res.status(409).json({
  //     message: MessageResponse.Error,
  //     description: "Email already exists",
  //     data: null,
  //   });
  // }

  // public async resendOtp(req: Request, res: Response) {
  //   const { email } = req.body;

  //   const userExists = await userService.findUserByEmail(email);

  //   if (userExists) {
  //     const otp = Crypto.randomBytes(4).toString("hex");

  //     const emailVerify = await authService.saveOTP({ email, otp });

  //     if (!emailVerify) {
  //       return res.status(404).json({
  //         message: MessageResponse.Error,
  //         description: "User not found",
  //         data: null,
  //       });
  //     }

  //     await send_verification_email({
  //       email,
  //       otp,
  //     });

  //     return res.status(201).json({
  //       message: MessageResponse.Success,
  //       description: "An OTP has been resent to your email address",
  //       data: null,
  //     });
  //   }

  //   return res.status(404).json({
  //     message: MessageResponse.Error,
  //     description: "Email not found",
  //     data: null,
  //   });
  // }
}

export const authController = new AuthController();
