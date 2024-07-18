import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { MessageResponse } from "../utils/enum";

class UserValidator {
  public async fetchUserData(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      userId: Joi.string().required().messages({
        "any.required": "User id is required",
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

  public async updateUserData(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      firstName: Joi.string().required().messages({
        "string.base": "Firstname must be text",
        "any.required": "Firstname is required.",
      }),
      lastName: Joi.string().required().messages({
        "string.base": "Lastname must be text",
        "any.required": "Lastname is required.",
      }),
      profileImageUrl: Joi.string()
        .trim()
        .allow("")
        .custom((value, helpers) => {
          if (value) {
            const regex = /^https?:\/\/(?:www\.)?.+\.(?:jpe?g|png|gif|bmp)$/i;
            if (!regex.test(value)) {
              return helpers.message({ custom: "Invalid image URL format" });
            }
          }
          return value;
        })
        .messages({
          "string.base": "Image URL must be text",
          "string.empty": "Image URL cannot be empty",
        }),
      phoneNumber: Joi.string().length(11).required().messages({
        "string.base": "Phone Number must be text",
        "any.required": "Phone Number is required.",
        "string.length": "Phone must be exactly 11 characters long",
      }),
      region: Joi.string().required().messages({
        "string.base": "Region must be text",
        "any.required": "Region is required.",
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

  public async changeUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      oldPassword: Joi.string().required().messages({
        "any.required": "Old password is required.",
      }),
      newPassword: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
          "any.required": "New password is required.",
          "string.min": "New password must be at least 8 characters long",
          "string.pattern.base":
            "New password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
      confirmNewPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
          "any.required": "Confirm new password is required.",
          "any.only": "Passwords do not match",
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

export const userValidator = new UserValidator();
