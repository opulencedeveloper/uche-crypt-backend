"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllCoursesRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const utils_1 = require("../utils");
exports.AllCoursesRouter = (0, express_1.Router)();
// AllCoursesRouter.post(
//   "/admin/courses",
//   [ isAuth,
//      allCoursesValidator.uploadCourse],
//   wrapAsync(allCoursesController.uploadCourse)
// );
exports.AllCoursesRouter.get("/courses", (0, utils_1.wrapAsync)(controller_1.allCoursesController.fetchAllAdsCourse));
exports.AllCoursesRouter.get("/course/:slug", (0, utils_1.wrapAsync)(controller_1.allCoursesController.fetchAllAdsCourseDetail));
