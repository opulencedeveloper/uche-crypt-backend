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
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../utils/auth");
const utils_1 = require("../utils");
const enum_1 = require("../utils/enum");
const auth_2 = require("../utils/auth");
const service_1 = require("../user/service");
const service_2 = require("./service");
dotenv_1.default.config();
class AuthController {
    sign_up(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield service_1.userService.findUserByEmail(req);
            if (userExists) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Email already exist!",
                    data: null,
                });
            }
            const user = yield service_2.authService.createUser(req);
            const otp = (0, utils_1.generate_otp)();
            const email = user.email;
            yield service_2.authService.save_otp({ email, otp });
            yield (0, auth_2.send_verification_email)({ email, otp });
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "User creation completed, verify email!",
                data: null,
            });
        });
    }
    email_verify_otp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            const is_email_verified = yield service_2.authService.check_email_verification_status(email);
            if (is_email_verified) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Email Already Verified",
                    data: null,
                });
            }
            const user_otp_validity = yield service_2.authService.validate_otp(email, otp);
            if (!user_otp_validity) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Invalid otp",
                    data: null,
                });
            }
            if (user_otp_validity.email_verify_otp_expiration !== undefined) {
                const currentDate = new Date();
                const expirationDate = new Date(user_otp_validity.email_verify_otp_expiration);
                if (expirationDate < currentDate) {
                    return res.status(400).json({
                        message: enum_1.MessageResponse.Error,
                        description: "Email verification OTP expired",
                        data: null,
                    });
                }
                const verifyEmail = {
                    email: email,
                };
                const email_verified = yield service_2.authService.verify_email(verifyEmail);
                if (!email_verified) {
                    return res.status(404).json({
                        message: enum_1.MessageResponse.Error,
                        description: "User not found!",
                        data: null,
                    });
                }
                yield service_2.authService.delete_otp(email);
                return res.status(201).json({
                    message: enum_1.MessageResponse.Success,
                    description: "Verification successful",
                    data: null,
                });
            }
            else {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Email verification OTP expired",
                    data: null,
                });
            }
        });
    }
    resend_email_vertfication_otp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield service_1.userService.findUserByEmail(req);
            if (!user) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "User does not exist!",
                    data: null,
                });
            }
            const email = user.email;
            const otp = (0, utils_1.generate_otp)();
            yield service_2.authService.save_otp({ email, otp });
            yield (0, auth_2.send_verification_email)({ email, otp });
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Verification token resent!",
                data: null,
            });
        });
    }
    sign_in(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email } = req.body;
            const user_exists = yield service_1.userService.findUserByEmail(req);
            if (!user_exists) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Wrong user credentials!",
                    data: null,
                });
            }
            const is_email_verified = yield service_2.authService.check_email_verification_status(email);
            if (!is_email_verified) {
                const otp = (0, utils_1.generate_otp)();
                const email = user_exists.email;
                yield service_2.authService.save_otp({ email, otp });
                yield (0, auth_2.send_verification_email)({ email, otp });
                return res.status(201).json({
                    message: enum_1.MessageResponse.Success,
                    description: `A  verication link  has been sent to ${email}!`,
                    data: null,
                });
            }
            const match = yield (0, auth_1.comparePassword)(password, user_exists.password);
            if (!match) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Wrong user credentials!",
                    data: null,
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user_exists._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRY,
            });
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Logged in successfully",
                data: {
                    token,
                },
            });
        });
    }
    forgot_password_otp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user_exists = yield service_1.userService.findUserByEmail(req);
            if (user_exists) {
                const otp = (0, utils_1.generate_otp)();
                const emailVerify = yield service_2.authService.save_otp({ email, otp });
                if (!emailVerify) {
                    return res.status(404).json({
                        message: enum_1.MessageResponse.Error,
                        description: "User not found",
                        data: null,
                    });
                }
                yield (0, auth_2.send_reset_password_email)({
                    email,
                    otp,
                });
                return res.status(201).json({
                    message: enum_1.MessageResponse.Success,
                    description: "An OTP has been sent to your email address",
                    data: null,
                });
            }
            return res.status(404).json({
                message: enum_1.MessageResponse.Error,
                description: "Email does not exists",
                data: null,
            });
        });
    }
    forgot_password_change(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp, password } = req.body;
            const user = yield service_2.authService.validate_otp(email, otp);
            if (!user) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Invalid otp",
                    data: null,
                });
            }
            if (user.email_verify_otp_expiration !== undefined) {
                const currentDate = new Date();
                const expirationDate = new Date(user.email_verify_otp_expiration);
                if (expirationDate < currentDate) {
                    return res.status(400).json({
                        message: enum_1.MessageResponse.Error,
                        description: "Verification OTP expired",
                        data: null,
                    });
                }
                yield service_2.authService.delete_otp(email);
                yield service_2.authService.change_password(email, password);
                return res.status(201).json({
                    message: enum_1.MessageResponse.Success,
                    description: "Password Changed Successfully!",
                    data: null,
                });
            }
            return res.status(400).json({
                message: enum_1.MessageResponse.Error,
                description: "Verification OTP expired",
                data: null,
            });
        });
    }
}
exports.authController = new AuthController();
