"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const utils_1 = require("../utils");
const validator_1 = require("./validator");
exports.AuthRouter = (0, express_1.Router)();
exports.AuthRouter.post("/signup", [validator_1.authValidator.sign_up], (0, utils_1.wrapAsync)(controller_1.authController.sign_up));
exports.AuthRouter.post("/verify/email", [validator_1.authValidator.email_verify_otp], (0, utils_1.wrapAsync)(controller_1.authController.email_verify_otp));
exports.AuthRouter.post("/resend/email/verification/otp", [validator_1.authValidator.validate_email], (0, utils_1.wrapAsync)(controller_1.authController.resend_email_vertfication_otp));
exports.AuthRouter.post("/signin", [validator_1.authValidator.sign_in], (0, utils_1.wrapAsync)(controller_1.authController.sign_in));
exports.AuthRouter.post("/forgot/password", [validator_1.authValidator.validate_email], (0, utils_1.wrapAsync)(controller_1.authController.forgot_password_otp));
exports.AuthRouter.post("/forgot/password/change", [validator_1.authValidator.forgot_password_change], (0, utils_1.wrapAsync)(controller_1.authController.forgot_password_change));
// AuthRouter.post(
//   "/check-email-existence",
//   [authValidator.checkEmail],
//   wrapAsync(authController.checkEmailExistence)
// );
// AuthRouter.post(
//   "/resend-otp",
//   [authValidator.checkEmail],
//   wrapAsync(authController.resendOtp)
// );
