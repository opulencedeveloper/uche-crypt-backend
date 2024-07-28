"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_reset_password_email = exports.send_verification_email = exports.sendEmail = exports.comparePassword = exports.hashPassword = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrypt_1.default.hash(password, salt, (error, hashed) => {
                if (error) {
                    reject(error);
                }
                resolve(hashed);
            });
        });
    });
};
exports.hashPassword = hashPassword;
const comparePassword = (password, hashed) => {
    return bcrypt_1.default.compare(password, hashed);
};
exports.comparePassword = comparePassword;
const sendEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverEmail, subject, emailTemplate } = input;
    const transporter = nodemailer_1.default.createTransport({
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
    yield TransportMailService(transporter, mailOptions);
});
exports.sendEmail = sendEmail;
const TransportMailService = (transporter, mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(false);
            }
            else {
                resolve(info.response);
            }
        });
    });
});
const send_verification_email = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.sendEmail)({
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
});
exports.send_verification_email = send_verification_email;
const send_reset_password_email = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const clientUrl = process.env.CLIENT_URL;
    return (0, exports.sendEmail)({
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
                  <p>Your reset password url</p>
                  <p></p>
                  <a href="${clientUrl}/reset-password?email=${input.email}&token=${input.otp}">Click here</a>
                 
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
});
exports.send_reset_password_email = send_reset_password_email;
