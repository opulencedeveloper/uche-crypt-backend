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
exports.userController = void 0;
const axios_1 = __importDefault(require("axios"));
const enum_1 = require("../utils/enum");
const service_1 = require("./service");
const service_2 = require("../all_course/service");
class UserController {
    verify_payment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = "sk_test_166f55da8659798259ecba885f1137cf3b13d0e7";
            const hash = require("crypto")
                .createHmac("sha512", secret)
                .update(JSON.stringify(req.body))
                .digest("hex");
            if (hash === req.headers["x-paystack-signature"]) {
                const event = req.body;
                console.log("payyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyysttttttttttttttttttttttack", event);
                if (event.event === "charge.success") {
                }
            }
        });
    }
    pay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req;
            const { email, amount } = req.body;
            const transactionDetails = {
                email: email,
                amount: amount,
                metadata: {
                    custom_fields: [
                        {
                            user_id: user_id,
                        },
                    ],
                },
            };
            const response = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", transactionDetails, {
                headers: {
                    Authorization: `Bearer sk_test_166f55da8659798259ecba885f1137cf3b13d0e7`,
                },
            });
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Sucess!",
                data: {
                    authorization_url: response.data.data.authorization_url,
                    reference: response.data.data.reference,
                },
            });
        });
    }
    enroll_to_course(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const course_exist = yield service_2.allCoursesService.find_course_by_id(req);
            if (!course_exist) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Course not found!",
                    data: null,
                });
            }
            const has_enrolled = yield service_1.userService.find_user_by_id_and_course_id(req);
            if (has_enrolled) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "You have already enrolled for this course!",
                    data: null,
                });
            }
            const user_data = yield service_1.userService.enroll_to_course(req);
            if (!user_data) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "User does not exist, could not enroll you please contact support!",
                    data: null,
                });
            }
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "You have successfully enrolled to this course!",
                data: null,
            });
        });
    }
    fetched_enrolled_course_detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const course_exist = yield service_2.allCoursesService.find_course_by_id(req);
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
            return res.status(201).json({
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
}
exports.userController = new UserController();
