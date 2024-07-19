"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allCoursesValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
class AllCoursesValidator {
    uploadCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoUrlValidation = joi_1.default.string()
                .required()
                .custom((value, helpers) => {
                const isValidUri = joi_1.default.string().uri().validate(value);
                const isValidVideoFile = /\.(mp4|avi|mov|wmv|flv|mkv)$/i.test(value);
                const isValidYoutubeUrl = /^https?:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)/.test(value);
                if (!isValidUri.error && (isValidVideoFile || isValidYoutubeUrl)) {
                    return value;
                }
                return helpers.message({
                    custom: "Video URL must be a valid URI pointing to a video file or a YouTube link.",
                });
            })
                .messages({
                "any.required": "Video URL is required",
            });
            const schema = joi_1.default.object({
                video_url: videoUrlValidation,
                title: joi_1.default.string().required().messages({
                    "string.base": "Title must be text",
                    "any.required": "Title is required.",
                }),
                description: joi_1.default.string().required().messages({
                    "string.base": "Description must be text",
                    "any.required": "Description is required.",
                }),
                price: joi_1.default.number().required().messages({
                    "number.base": "Price must be a number",
                    "any.required": "Price is required.",
                }),
                slashed_price: joi_1.default.number().required().messages({
                    "number.base": "Slashed price must be a number",
                    "any.required": "Slashed price is required.",
                }),
                details: joi_1.default.array()
                    .min(1)
                    .required()
                    .items(joi_1.default.string().trim().message("Details must be an array of strings"))
                    .messages({
                    "array.base": "Details must be an array",
                    "array.empty": "Details cannot be empty",
                    "any.required": "Details is required.",
                }),
                introduction: joi_1.default.string().required().messages({
                    "string.base": "Introduction must be text",
                    "any.required": "Introduction is required.",
                }),
                course_content: joi_1.default.array()
                    .items(joi_1.default.object({
                    title: joi_1.default.string().required().messages({
                        "string.base": "Course content title must be text",
                        "any.required": "Course content title is required.",
                    }),
                    modules: joi_1.default.array()
                        .items(joi_1.default.object({
                        video_url: videoUrlValidation,
                        title: joi_1.default.string().required().messages({
                            "string.base": "Module title must be text",
                            "any.required": "Module title is required.",
                        }),
                    }).required())
                        .required()
                        .messages({
                        "array.base": "Modules must be an array",
                        "any.required": "Modules are required.",
                    }),
                }).required())
                    .required()
                    .messages({
                    "array.base": "Course Content must be an array",
                    "any.required": "Course Content is required.",
                }),
            });
            const { error } = schema.validate(req.body);
            if (!error) {
                return next();
            }
            else {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: error.details[0].message,
                    data: null,
                });
            }
        });
    }
}
exports.allCoursesValidator = new AllCoursesValidator();
// import Joi from "joi";
// import { Request, Response, NextFunction } from "express";
// import { MessageResponse } from "../utils/enum";
// class AllCoursesValidator {
//   public async uploadCourse(req: Request, res: Response, next: NextFunction) {
//     const schema = Joi.object({
//       video_url: Joi.string()
//         .required()
//         .custom((value, helpers) => {
//           const isValidUri = Joi.string().uri().validate(value);
//           const isValidVideoFile = /\.(mp4|avi|mov|wmv|flv|mkv)$/i.test(value);
//           const isValidYoutubeUrl =
//             /^https?:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)/.test(
//               value
//             );
//           if (!isValidUri.error && (isValidVideoFile || isValidYoutubeUrl)) {
//             return value;
//           }
//           return helpers.message({
//             custom:
//               "Video URL must be a valid URI pointing to a video file or a YouTube link.",
//           });
//         })
//         .messages({
//           "any.required": "Video URL is required",
//         }),
//       title: Joi.string().required().messages({
//         "string.base": "Title must be text",
//         "any.required": "Title is required.",
//       }),
//       description: Joi.string().required().messages({
//         "string.base": "Description must be text",
//         "any.required": "Description is required.",
//       }),
//       price: Joi.number().required().messages({
//         "number.base": "Price must be a number",
//         "any.required": "Price is required.",
//       }),
//       slashed_price: Joi.number().required().messages({
//         "number.base": "Slashed price must be a number",
//         "any.required": "Slashed price is required.",
//       }),
//       details: Joi.array()
//         .min(1)
//         .required()
//         .items(
//           Joi.string().trim().message("Details must be an array of strings")
//         )
//         .messages({
//           "array.base": "Details must be an array",
//           "array.empty": "Details cannot be empty",
//           "any.required": "Details is required.",
//         }),
//       introduction: Joi.string().required().messages({
//         "string.base": "Introduction must be text",
//         "any.required": "Introduction is required.",
//       }),
//       course_content: Joi.array()
//         .items(
//           Joi.object({
//             title: Joi.string().required().messages({
//               "string.base": "Course content title must be text",
//               "any.required": "Course content title is required.",
//             }),
//             modules: Joi.array()
//               .items(
//                 Joi.object({
//                   video_url: videoUrlValidation,
//                   title: Joi.string().required().messages({
//                     "string.base": "Module title must be text",
//                     "any.required": "Module title is required.",
//                   }),
//                 }).required()
//               )
//               .required()
//               .messages({
//                 "array.base": "Modules must be an array",
//                 "any.required": "Modules are required.",
//               }),
//           }).required()
//         )
//         .required()
//         .messages({
//           "array.base": "Course Content must be an array",
//           "any.required": "Course Content is required.",
//         }),
//     });
//     const { error } = schema.validate(req.body);
//     if (!error) {
//       return next();
//     } else {
//       return res.status(400).json({
//         message: MessageResponse.Error,
//         description: error.details[0].message,
//         data: null,
//       });
//     }
//   }
// }
// export const allCoursesValidator = new AllCoursesValidator();
