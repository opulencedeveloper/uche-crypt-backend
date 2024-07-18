import Joi from "joi";
import { Request, Response, NextFunction } from "express";

import { MessageResponse } from "../utils/enum";

class YouTubeCoursesValidator {
  public async postYoutubeCourse(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      video_url: Joi.string()
        .required()
        .custom((value, helpers) => {
          const isValidYoutubeUrl =
            /^https?:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)/.test(
              value
            );

          if (isValidYoutubeUrl) {
            return value;
          }

          return helpers.message({
            custom:
              "Please enter a valid youTube link.",
          });
        })
        .messages({
          "any.required": "Video URL is required",
        })
    });

    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    } else {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }
  }
}

export const youTubeCoursesValidator = new YouTubeCoursesValidator();
