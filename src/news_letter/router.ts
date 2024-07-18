import { Router } from "express";

import { newsLetterController } from "./controller";
import { wrapAsync } from "../utils";
import { newsLetterValidator } from "./validator";

export const NewsLetterRouter = Router();

NewsLetterRouter.post(
  "/newsletter",
  [newsLetterValidator.postNewsLetter],
  wrapAsync(newsLetterController.postNewsLetter)
);
