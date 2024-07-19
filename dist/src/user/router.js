"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const utils_1 = require("../utils");
const is_auth_1 = require("../middleware/is_auth");
const validator_1 = require("./validator");
exports.UserRouter = (0, express_1.Router)();
exports.UserRouter.post("/user/course/enroll/:course_id", [is_auth_1.isAuth, validator_1.userValidator.enroll_to_course], (0, utils_1.wrapAsync)(controller_1.userController.enroll_to_course));
exports.UserRouter.get("/user/course/enrolled", [is_auth_1.isAuth], (0, utils_1.wrapAsync)(controller_1.userController.fetched_all_enrolled_courses));
exports.UserRouter.get("/user/course/enrolled/:course_id", [is_auth_1.isAuth, validator_1.userValidator.enroll_to_course], (0, utils_1.wrapAsync)(controller_1.userController.fetched_enrolled_course_detail));
// UserRouter.get(
//   "/user-profile",
//   [isAuth],
//   wrapAsync(userController.fetchUserData)
// );
// UserRouter.patch(
//   "/update-user-profile",
//   [isAuth, userValidator.updateUserData],
//   wrapAsync(userController.updateUserData)
// );
// UserRouter.patch(
//   "/change-user-password",
//   [isAuth, userValidator.changeUserPassword],
//   wrapAsync(userController.changeUserPassword)
// );
