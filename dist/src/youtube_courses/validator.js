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
exports.youTubeCoursesValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
class YouTubeCoursesValidator {
    postYoutubeCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                video_url: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    const isValidYoutubeUrl = /^https?:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)/.test(value);
                    if (isValidYoutubeUrl) {
                        return value;
                    }
                    return helpers.message({
                        custom: "Please enter a valid youTube link.",
                    });
                })
                    .messages({
                    "any.required": "Video URL is required",
                })
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
exports.youTubeCoursesValidator = new YouTubeCoursesValidator();
