import { Request } from "express";

import User from "../user/entity";
import { IOTP, IVerifiedEmail } from "./interface";
import { hashPassword } from "../utils/auth";

class AuthService {
  public async createUser(req: Request) {
    const { email, password } = req.body;

    const hashedPassword = (await hashPassword(password)) as string;

    const user = new User({
      email,
      password: hashedPassword,
    });

    const userData = await user.save();

    return userData;
  }

  public async save_otp(input: IOTP) {
    const { otp, email } = input;

    const user = await User.findOne({
      email: email,
    });

    if (user) {
      user!.email_verify_otp = otp;
      //3600000 is in milisecs and this is 1hr, so the token is valid for 1 hour
      user!.email_verify_otp_expiration = new Date(Date.now() + 3600000);
      await user!.save();
    }

    return user;
  }

  public async check_email_verification_status(email: string) {
    const user = await User.findOne({ email, email_verified: true });
    return user;
  }

  public async validate_otp(email: string, otp: string) {
    const otp_validity = await User.findOne({
      email: email,
      email_verify_otp: otp,
    });

    return otp_validity;
  }

  public async delete_otp(email: string) {
    const user = await User.findOne({ email });

    if (user) {
      user.email_verify_otp = undefined;
      user.email_verify_otp_expiration = undefined;
      await user.save();
    }
    return user;
  }

  public async verify_email(input: IVerifiedEmail) {
    const { email } = input;

    const user = await User.findOne({ email });

    if (user) {
      user.email_verified = true;
      user.save();
    }

    return user;
  }

  public async change_password(email: string, password: string) {
    const user = await User.findOne({ email });

    const hashedPassword = (await hashPassword(password)) as string;

    if (user) {
      user.password = hashedPassword;
      await user.save();
    }
    return user;
  }

  // public async completeUserRegistration(req: Request) {
  //   const {
  //     email,
  //     firstName,
  //     lastName,
  //     gender,
  //     password,
  //     phoneNumber,
  //     region,
  //     city,
  //   } = req.body;

  //   const user = await User.findOne({
  //     email: email,
  //   });

  //   if (user) {
  //     const hashedPassword = (await hashPassword(password)) as string;
  //     user.firstName = firstName;
  //     user.lastName = lastName;
  //     user.gender = gender;
  //     user.password = hashedPassword;
  //     user.phoneNumber = phoneNumber;
  //     user.region = region;
  //     user.city = city;
  //     user.completedRegistration = true;

  //     await user.save();
  //   }
  //   return user;
  // }
}

export const authService = new AuthService();
