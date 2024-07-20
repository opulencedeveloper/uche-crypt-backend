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
exports.userController = void 0;
const enum_1 = require("../utils/enum");
const service_1 = require("./service");
const service_2 = require("../all_course/service");
class UserController {
    fetched_enrolled_course_detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { course_id } = req.params;
            const course_exist = yield service_2.allCoursesService.find_course_by_id(course_id);
            if (!course_exist) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Course not found!",
                    data: null,
                });
            }
            const course_details = yield service_1.userService.fetch_enrolled_courses_detail(req);
            if (!course_details) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Sorry you have not enrolled for this course!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Courses fetched successfully!",
                data: course_details,
            });
        });
    }
    fetched_all_enrolled_courses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield service_1.userService.fetch_all_enrolled_courses(req);
            if (!userData) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "User does not exist!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Courses fetched successfully!",
                data: userData,
            });
        });
    }
    mark_video_as_watched(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { course_id } = req.query;
            const query_course_id = course_id;
            const course_exist = yield service_2.allCoursesService.find_course_by_id(query_course_id);
            if (!course_exist) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Course not found!",
                    data: null,
                });
            }
            const has_marked = yield service_1.userService.mark_video_as_watched(req);
            if (!has_marked) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "This video does not exist!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Video has been marked as watched!",
                data: null,
            });
        });
    }
}
exports.userController = new UserController();
