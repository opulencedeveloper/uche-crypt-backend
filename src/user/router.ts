import { Router } from "express";

import { userController } from "./controller";
import { wrapAsync } from "../utils";
import { isAuth } from "../middleware/is_auth";
import { userValidator } from "./validator";

export const UserRouter = Router();

// UserRouter.post(
//   "/user/course/enroll/:course_id",
//   [isAuth, userValidator.enroll_to_course],
//   wrapAsync(userController.enroll_to_course)
// );

UserRouter.get(
  "/user/course/enrolled",
  [isAuth],
  wrapAsync(userController.fetched_all_enrolled_courses)
);

UserRouter.get(
  "/user/course/enrolled/:course_id",
  [isAuth, userValidator.enrolled_to_course],
  wrapAsync(userController.fetched_enrolled_course_detail)
);

UserRouter.patch(
  "/mark/watched",
  [isAuth, userValidator.mark_video_as_watched],
  wrapAsync(userController.mark_video_as_watched)
);
