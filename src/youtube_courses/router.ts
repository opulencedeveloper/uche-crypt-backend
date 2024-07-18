import { Router } from "express";

import { youtubeCoursesController } from "./controller";
import { wrapAsync } from "../utils";
import { isAuth } from "../middleware/is_auth";
import { youTubeCoursesValidator } from "./validator";

export const YoutubeCoursesRouter = Router();

YoutubeCoursesRouter.post(
  "/courses/youtube",
  [isAuth, youTubeCoursesValidator.postYoutubeCourse],
  wrapAsync(youtubeCoursesController.postYoutubeCourse)
);

YoutubeCoursesRouter.get(
  "/courses/youtube",
  wrapAsync(youtubeCoursesController.getYoutubeCourses)
);
