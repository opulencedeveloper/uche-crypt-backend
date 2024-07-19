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
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeCoursesController = void 0;
const enum_1 = require("../utils/enum");
const service_1 = require("./service");
class YoutubeCoursesController {
    postYoutubeCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield service_1.youtubeCoursesService.postYoutubeCourse(req);
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Youtube Course created successfully!",
                data: course,
            });
        });
    }
    getYoutubeCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield service_1.youtubeCoursesService.getYoutubeCourses();
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Youtube Courses fetched successfully!",
                data: courses,
            });
        });
    }
}
exports.youtubeCoursesController = new YoutubeCoursesController();
