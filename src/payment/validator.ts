import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { MessageResponse } from "../utils/enum";

class PaymentValidator {
  public async payment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      course_id: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message({
            custom: "Course ID must be a valid ObjectId",
          });
        }
        return value;
      }).required().messages({
        'string.base': 'Course ID must be a string',
        'any.required': 'Course ID is required',
      }),
    });
    const { error } = schema.validate(req.params);

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

export const paymentValidator = new PaymentValidator();
