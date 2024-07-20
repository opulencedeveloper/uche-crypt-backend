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
exports.userService = void 0;
const entity_1 = __importDefault(require("./entity"));
const entity_2 = __importDefault(require("../all_course/entity"));
class UserService {
    findUserByEmail(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield entity_1.default.findOne({
                email: email,
            });
            return user;
        });
    }
    find_user_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findById(id);
            return user;
        });
    }
    // public async enroll_to_course(
    //   user_id: string,
    //   course_id: string,
    //   payment_reference_id: string
    // ) {
    //   // const { user_id } = req as CustomRequest;
    //   // const { course_id } = req.params;
    //   let user = await User.findOne({
    //     _id: user_id,
    //     "enrolled_courses.payment_reference_id": payment_reference_id,
    //   }).select("enrolled_courses");
    //   await User.findById(user_id).select("enrolled_courses");
    //   const course = await AllCourse.findById(course_id);
    //   if (!user || !course) return;
    //   let enrolledCourse = course.course_content.flatMap((content) =>
    //     content.modules.map((module) => ({
    //       module_id: module._id.toString(),
    //       watched: false,
    //     }))
    //   );
    //   const newEnrolledCourse: IEnrolledCourses = {
    //     course_id: course_id,
    //     paid: true,
    //     payment_reference_id: payment_reference_id,
    //     enrolled_course_content: enrolledCourse,
    //   };
    //   user.enrolled_courses.push(newEnrolledCourse);
    //   user = await user.save();
    //   return user;
    // }
    mark_video_as_watched(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { course_id, module_id } = req.query;
            const { user_id } = req;
            const user = yield entity_1.default.findOneAndUpdate({
                _id: user_id,
                "enrolled_courses.course_id": course_id,
                "enrolled_courses.enrolled_course_content.module_id": module_id,
            }, {
                // enrolled_courses: This is the array of courses that the user is enrolled in.
                // $[course]: This is a positional operator that refers to the specific element in the enrolled_courses array that matches the filter criteria provided in the arrayFilters option. In this case, it represents the course object within the enrolled_courses array.
                // enrolled_course_content: This is the nested array within each enrolled_course object, containing the modules of the course.
                // $[module]: This is another positional operator that refers to the specific element in the enrolled_course_content array that matches the filter criteria provided in the arrayFilters option. It represents the module object within the enrolled_course_content array.
                // watched:This is the field within each module that we want to update.
                $set: {
                    "enrolled_courses.$[course].enrolled_course_content.$[module].watched": true,
                },
            }, {
                arrayFilters: [
                    { "course.course_id": course_id },
                    { "module.module_id": module_id },
                ],
                new: true, // Return the modified document
            });
            return user;
        });
    }
    fetch_enrolled_courses_detail(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { course_id } = req.params;
            const { user_id } = req;
            console.log(user_id, course_id);
            const course = yield entity_2.default.findById(course_id);
            const user = yield entity_1.default.findOne({
                _id: user_id,
                "enrolled_courses.course_id": course_id,
                "enrolled_courses.paid": true,
            });
            if (!user || !course)
                return;
            const enrolledCourse = user.enrolled_courses.find((ec) => ec.course_id === course_id);
            if (!enrolledCourse || enrolledCourse.enrolled_course_content === undefined)
                return;
            const existingContentMap = new Map();
            for (const content of enrolledCourse.enrolled_course_content) {
                existingContentMap.set(content.module_id, content);
            }
            const enrolled_course_content = course.course_content.map((content) => ({
                title: content.title,
                modules: content.modules.map((module) => {
                    const existingContent = existingContentMap.get(module._id.toString());
                    return {
                        module_id: module._id.toString(),
                        video_url: module.video_url,
                        title: module.title,
                        watched: existingContent ? existingContent.watched : false,
                    };
                }),
            }));
            return enrolled_course_content;
        });
    }
    fetch_all_enrolled_courses(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req;
            // Find d user by user_id
            const user = yield entity_1.default.findById(user_id);
            if (!user)
                return;
            // Extract d course_ids from the user's enrolled courses
            const enrolled_courses_id = user.enrolled_courses.map((content) => content.course_id);
            // Retrieve d courses by course_id
            const retrieved_enrolled_courses = yield entity_2.default.find({
                _id: { $in: enrolled_courses_id },
            }).select("title description video_url");
            return retrieved_enrolled_courses;
        });
    }
    check_enrollement_status(user_id, course_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOne({
                _id: user_id,
                "enrolled_courses.paid": true,
                "enrolled_courses.course_id": course_id,
            });
            return user;
        });
    }
}
exports.userService = new UserService();
