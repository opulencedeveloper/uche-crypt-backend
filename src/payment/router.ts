import { Router } from "express";

import { paymentController } from "./controller";
import { wrapAsync } from "../utils";
import { isAuth } from "../middleware/is_auth";
import { paymentValidator } from "./validator";

export const PaymentRouter = Router();

PaymentRouter.post(
  "/pay/:course_id",
  [isAuth, paymentValidator.payment],
  wrapAsync(paymentController.pay)
);

PaymentRouter.post(
  "/pay/with/crypto",
  [isAuth, paymentValidator.payment],
  wrapAsync(paymentController.generate_link_for_crypto_payment)
);

PaymentRouter.post(
  "/uchecrypt/webhook",
  wrapAsync(paymentController.verify_payment)
);

PaymentRouter.post(
  "/uchecrypt/crypto/webhook",
  wrapAsync(paymentController.verify_crypto_payment)
);
