import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { allCoursesService } from "./service";

class AllCoursesController {
  public async uploadCourse(req: Request, res: Response) {
    const slugExist = await allCoursesService.findCourseBySlug(req);

    if (slugExist) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Course title already exist add another!",
        data: null,
      });
    }

    const course = await allCoursesService.uploadCourse(req);

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Course created successfully!",
      data: course,
    });
  }

  public async fetchAllAdsCourse(req: Request, res: Response) {
    const ad_courses = await allCoursesService.fetchAllAdsCourse();

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Courses fetched successfully!",
      data: ad_courses,
    });
  }

  public async fetchAllAdsCourseDetail(req: Request, res: Response) {
    const ad_courses_detail = await allCoursesService.fetchAllAdsCourseDetail(
      req
    );

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Courses fetched successfully!",
      data: ad_courses_detail,
    });
  }
}

export const allCoursesController = new AllCoursesController();
