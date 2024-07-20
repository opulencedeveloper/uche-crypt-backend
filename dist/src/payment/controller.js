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
exports.paymentController = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const enum_1 = require("../utils/enum");
const service_1 = require("../all_course/service");
const service_2 = require("../user/service");
const service_3 = require("./service");
class PaymentController {
    pay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req;
            const course_exist = yield service_1.allCoursesService.find_course_by_id(req);
            const userData = yield service_2.userService.find_user_by_id(user_id);
            if (!course_exist || !userData) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: !course_exist
                        ? "Course not found!"
                        : "User does not exist!",
                    data: null,
                });
            }
            const course_id = course_exist._id;
            const has_enrolled = yield service_2.userService.check_enrollement_status(user_id, course_id);
            if (has_enrolled) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "You have already enrolled for this course!",
                    data: null,
                });
            }
            const converted_to_kobo = course_exist.price * 100;
            const transactionDetails = {
                amount: converted_to_kobo,
                email: userData.email,
                metadata: {
                    custom_fields: [
                        {
                            course_id: course_exist._id,
                        },
                    ],
                },
            };
            const response = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", transactionDetails, {
                headers: {
                    Authorization: `Bearer sk_test_166f55da8659798259ecba885f1137cf3b13d0e7`,
                },
            });
            const payment_reference_id = response.data.data.reference;
            const user = yield service_3.paymentService.start_enrollment_to_course(user_id, course_id, payment_reference_id);
            if (!user) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Payment is being processed but user was not found!",
                    data: null,
                });
            }
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Sucess!",
                data: {
                    price: converted_to_kobo,
                    authorization_url: response.data.data.authorization_url,
                    reference: response.data.data.reference,
                },
            });
        });
    }
    verify_payment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = "sk_test_166f55da8659798259ecba885f1137cf3b13d0e7";
            const hash = crypto_1.default
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
}
exports.paymentController = new PaymentController();
