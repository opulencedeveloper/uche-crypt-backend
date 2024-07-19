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
exports.allCoursesController = void 0;
const enum_1 = require("../utils/enum");
const service_1 = require("./service");
class AllCoursesController {
    uploadCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const slugExist = yield service_1.allCoursesService.findCourseBySlug(req);
            if (slugExist) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Course title already exist add another!",
                    data: null,
                });
            }
            const course = yield service_1.allCoursesService.uploadCourse(req);
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Course created successfully!",
                data: course,
            });
        });
    }
    fetchAllAdsCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ad_courses = yield service_1.allCoursesService.fetchAllAdsCourse();
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Courses fetched successfully!",
                data: ad_courses,
            });
        });
    }
    fetchAllAdsCourseDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ad_courses_detail = yield service_1.allCoursesService.fetchAllAdsCourseDetail(req);
            if (!ad_courses_detail) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Course slug does not exist!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Course fetched successfully!",
                data: ad_courses_detail,
            });
        });
    }
}
exports.allCoursesController = new AllCoursesController();
