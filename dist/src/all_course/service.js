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
exports.allCoursesService = void 0;
const entity_1 = __importDefault(require("./entity"));
const utils_1 = require("../utils");
class AllCoursesService {
    uploadCourse(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { video_url, title, description, price, details, slashed_price, introduction, course_content, } = req.body;
            const slugified = (0, utils_1.slugify)(title);
            const course = new entity_1.default({
                video_url,
                title,
                description,
                price,
                slashed_price,
                slug: slugified,
                details,
                introduction,
                course_content,
            });
            yield course.save();
            return course;
        });
    }
    fetchAllAdsCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            const ad_courses = yield entity_1.default.find().select("video_url title description price slug");
            return ad_courses;
        });
    }
    findCourseBySlug(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title } = req.body;
            const slugified = (0, utils_1.slugify)(title);
            const course = yield entity_1.default.findOne({ slug: slugified });
            return course;
        });
    }
    //fetches courses by slug excluding course content video urls and slug
    fetchAllAdsCourseDetail(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            const [ads_courses_detail] = yield entity_1.default.aggregate([
                {
                    $match: { slug: slug },
                },
                {
                    $project: {
                        video_url: 1,
                        title: 1,
                        description: 1,
                        price: 1,
                        details: 1,
                        introduction: 1,
                        course_content: {
                            module_number: 1,
                            title: 1,
                            description: 1,
                        },
                    },
                },
            ]).exec();
            //exec() ensures that an object is returned instead of an array with 1 item
            return ads_courses_detail;
        });
    }
    find_course_by_id(course_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield entity_1.default.findById(course_id);
            return course;
        });
    }
}
exports.allCoursesService = new AllCoursesService();
