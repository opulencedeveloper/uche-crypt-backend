import { Router } from "express";

import { authController } from "./controller";
import { wrapAsync } from "../utils";
import { authValidator } from "./validator";

export const AuthRouter = Router();

AuthRouter.get(
  "/auth/google",
  wrapAsync(authController.generate_google_auth_url)
);

AuthRouter.post(
  "/google/signin",
  [authValidator.google_auth],
  wrapAsync(authController.google_sign_in)
);

AuthRouter.post(
  "/google/signup",
  [authValidator.google_auth],
  wrapAsync(authController.google_sign_up)
);


AuthRouter.post(
  "/signup",
  [authValidator.sign_up],
  wrapAsync(authController.sign_up)
);

AuthRouter.post(
  "/verify/email",
  [authValidator.email_verify_otp],
  wrapAsync(authController.email_verify_otp)
);

AuthRouter.post(
  "/resend/email/verification/otp",
  [authValidator.validate_email],
  wrapAsync(authController.resend_email_vertfication_otp)
);

AuthRouter.post(
  "/signin",
  [authValidator.sign_in],
  wrapAsync(authController.sign_in)
);

AuthRouter.post(
  "/forgot/password",
  [authValidator.validate_email],
  wrapAsync(authController.forgot_password_otp)
);

AuthRouter.post(
  "/forgot/password/change",
  [authValidator.forgot_password_change],
  wrapAsync(authController.forgot_password_change)
);

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
