import Joi from "joi";
import { Request, Response, NextFunction } from "express";

import { MessageResponse } from "../utils/enum";

class AllCoursesValidator {
  public async uploadCourse(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      video_url: Joi.string()
        .required()
        .custom((value, helpers) => {
          const isValidUri = Joi.string().uri().validate(value);
          const isValidVideoFile = /\.(mp4|avi|mov|wmv|flv|mkv)$/i.test(value);
          const isValidYoutubeUrl =
            /^https?:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)/.test(
              value
            );

          if (!isValidUri.error && (isValidVideoFile || isValidYoutubeUrl)) {
            return value;
          }

          return helpers.message({
            custom:
              "Video URL must be a valid URI pointing to a video file or a YouTube link.",
          });
        })
        .messages({
          "any.required": "Video URL is required",
        }),
      title: Joi.string().required().messages({
        "string.base": "Title must be text",
        "any.required": "Title is required.",
      }),
      description: Joi.string().required().messages({
        "string.base": "Description must be text",
        "any.required": "Description is required.",
      }),
      price: Joi.number().required().messages({
        "number.base": "Price must be a number",
        "any.required": "Price is required.",
      }),
      slashed_price: Joi.number().required().messages({
        "number.base": "Slashed price must be a number",
        "any.required": "Slashed price is required.",
      }),
      details: Joi.array()
        .min(1)
        .required()
        .items(
          Joi.string().trim().message("Details must be an array of strings")
        )
        .messages({
          "array.base": "Details must be an array",
          "array.empty": "Details cannot be empty",
          "any.required": "Details is required.",
        }),
      introduction: Joi.string().required().messages({
        "string.base": "Introduction must be text",
        "any.required": "Introduction is required.",
      }),
      course_content: Joi.array()
        .items(
          Joi.object({
            video_url: Joi.string()
              .required()
              .custom((value, helpers) => {
                const isValidUri = Joi.string().uri().validate(value);
                const isValidVideoFile = /\.(mp4|avi|mov|wmv|flv|mkv)$/i.test(
                  value
                );
                const isValidYoutubeUrl =
                  /^https?:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)/.test(
                    value
                  );

                if (
                  !isValidUri.error &&
                  (isValidVideoFile || isValidYoutubeUrl)
                ) {
                  return value;
                }

                return helpers.message({
                  custom:
                    "Course content video URL must be a valid URI pointing to a video file.",
                });
              })
              .messages({
                "any.required": "Course content video URL is required",
              }),
            module_number: Joi.number().required().messages({
              "number.base": "Couse content module number must be a number",
              "any.required": "Couse content module number is required.",
            }),
            title: Joi.string().required().messages({
              "string.base": "Couse content title must be text",
              "any.required": "Couse content title is required.",
            }),
            description: Joi.string().required().messages({
              "string.base": "Couse content description must be text",
              "any.required": "Couse content description is required.",
            }),
          }).required()
        )
        .required()
        .messages({
          "array.base": "Course Content must be an array",
          "any.required": "Course Content is required.",
        }),
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

export const allCoursesValidator = new AllCoursesValidator();