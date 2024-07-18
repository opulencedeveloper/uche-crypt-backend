import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

import { ISendEmail } from "./interface";
import { IOTP } from "../auth/interface";

dotenv.config();

export const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (error, hashed: string) => {
        if (error) {
          reject(error);
        }
        resolve(hashed);
      });
    });
  });
};

export const comparePassword = (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};

export const sendEmail = async (input: ISendEmail) => {
  const { receiverEmail, subject, emailTemplate } = input;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAILSENDER,
      pass: process.env.EMAILSENDERPASSWORD,
    },
  });

  const mailOptions = {
    from: `UcheCrypt <${process.env.EMAILSENDER}>`,
    to: receiverEmail,
    subject,
    html: emailTemplate,
  };

  await TransportMailService(transporter, mailOptions);
};

const TransportMailService = async (transporter: any, mailOptions: any) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        reject(false);
      } else {
        resolve(info.response);
      }
    });
  });
};

export const send_verification_email = async (input: IOTP) => {
  return sendEmail({
    receiverEmail: input.email,
    subject: "Email Verification",
    emailTemplate: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            
              <div style="text-align: left; color: #555555; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                  <p>Your code</p>
                  <p>${input.otp}</p>
                 
                  <p>If you have any questions or concerns, feel free to contact us.</p>
                  <p>Thank you for choosing us!</p>
              </div>
              <div style="text-align: center; color: #888888; font-size: 14px; margin-top: 20px;">
                  <p>&copy; ${new Date().getFullYear()} UcheCrypt. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>`,
  });
};

export const send_reset_password_email = async (input: IOTP) => {
  return sendEmail({
    receiverEmail: input.email,
    subject: "RESET PASSWORD OTP",
    emailTemplate: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            
              <div style="text-align: left; color: #555555; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                  <p>Your reset password otp code is</p>
                  <p>${input.otp}</p>
                 
                  <p>If you have any questions or concerns, feel free to contact us.</p>
                  <p>Thank you for choosing us!</p>
              </div>
              <div style="text-align: center; color: #888888; font-size: 14px; margin-top: 20px;">
                  <p>&copy; ${new Date().getFullYear()} UcheCrypt Up. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>`,
  });
};
