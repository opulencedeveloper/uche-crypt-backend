import { Request, Response } from "express";
import Crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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

class AuthController {
  public async sign_up(req: Request, res: Response) {
    const userExists = await userService.findUserByEmail(req);

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
    const user = await userService.findUserByEmail(req);

    if(!user) {
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

    const user_exists = await userService.findUserByEmail(req);

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

    const user_exists = await userService.findUserByEmail(req);

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
