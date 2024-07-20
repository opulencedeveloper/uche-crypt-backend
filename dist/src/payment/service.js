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
exports.paymentService = void 0;
const entity_1 = __importDefault(require("../user/entity"));
const entity_2 = __importDefault(require("../all_course/entity"));
class PaymentService {
    start_enrollment_to_course(user_id, course_id, payment_reference_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findById(user_id);
            if (user) {
                const newEnrolledCourse = {
                    course_id: course_id,
                    paid: false,
                    payment_reference_id: payment_reference_id,
                };
                user.enrolled_courses.push(newEnrolledCourse);
            }
            return user;
        });
    }
    enroll_to_course(payment_reference_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield entity_1.default.findOne({
                "enrolled_courses.payment_reference_id": payment_reference_id,
            }).select("enrolled_courses");
            if (!user) {
                return;
            }
            // Find the enrolled course that matches the payment_reference_id
            const enrolledCourse = user.enrolled_courses.find((course) => course.payment_reference_id === payment_reference_id);
            if (!enrolledCourse) {
                return;
            }
            // Retrieve the course details from the AllCourse collection
            const course = yield entity_2.default.findById(enrolledCourse.course_id);
            if (!course) {
                return;
            }
            // Prepare the enrolled course content
            let enrolledCourseContent = course.course_content.flatMap((content) => content.modules.map((module) => ({
                module_id: module._id.toString(),
                watched: false,
            })));
            enrolledCourse.paid = true;
            enrolledCourse.enrolled_course_content = enrolledCourseContent;
            user = yield user.save();
            return user;
        });
    }
}
exports.paymentService = new PaymentService();
