"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const utils_1 = require("../utils");
const is_auth_1 = require("../middleware/is_auth");
const validator_1 = require("./validator");
exports.UserRouter = (0, express_1.Router)();
// UserRouter.post(
//   "/user/course/enroll/:course_id",
//   [isAuth, userValidator.enroll_to_course],
//   wrapAsync(userController.enroll_to_course)
// );
exports.UserRouter.get("/user", [is_auth_1.isAuth], (0, utils_1.wrapAsync)(controller_1.userController.fetch_user_details));
exports.UserRouter.get("/user/course/enrolled", [is_auth_1.isAuth], (0, utils_1.wrapAsync)(controller_1.userController.fetched_all_enrolled_courses));
exports.UserRouter.get("/user/course/enrolled/:course_id", [is_auth_1.isAuth, validator_1.userValidator.enrolled_to_course], (0, utils_1.wrapAsync)(controller_1.userController.fetched_enrolled_course_detail));
exports.UserRouter.patch("/mark/watched", [is_auth_1.isAuth, validator_1.userValidator.mark_video_as_watched], (0, utils_1.wrapAsync)(controller_1.userController.mark_video_as_watched));
