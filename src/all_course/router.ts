import { Router } from "express";

import { allCoursesController } from "./controller";
import { wrapAsync } from "../utils";
import { isAuth } from "../middleware/is_auth";
import { allCoursesValidator } from "./validator";

export const AllCoursesRouter = Router();

AllCoursesRouter.post(
  "/admin/courses",
  [ isAuth,
     allCoursesValidator.uploadCourse],
  wrapAsync(allCoursesController.uploadCourse)
);

AllCoursesRouter.get(
  "/courses",
  wrapAsync(allCoursesController.fetchAllAdsCourse)
);

AllCoursesRouter.get(
  "/course/:slug",
  wrapAsync(allCoursesController.fetchAllAdsCourseDetail)
);
