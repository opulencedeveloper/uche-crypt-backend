import { Router } from "express";

import { userController } from "./controller";
import { wrapAsync } from "../utils";
import { isAuth } from "../middleware/is_auth";
import { userValidator } from "./validator";

export const UserRouter = Router();

UserRouter.get(
  "/user-profile",
  [isAuth],
  wrapAsync(userController.fetchUserData)
);

// UserRouter.patch(
//   "/update-user-profile",
//   [isAuth, userValidator.updateUserData],
//   wrapAsync(userController.updateUserData)
// );

// UserRouter.patch(
//   "/change-user-password",
//   [isAuth, userValidator.changeUserPassword],
//   wrapAsync(userController.changeUserPassword)
// );