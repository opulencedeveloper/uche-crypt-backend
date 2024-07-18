import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { youtubeCoursesService } from "./service";

class YoutubeCoursesController {
  public async postYoutubeCourse(req: Request, res: Response) {
    const course = await youtubeCoursesService.postYoutubeCourse(req);

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Youtube Course created successfully!",
      data: course,
    });
  }

  public async getYoutubeCourses(req: Request, res: Response) {
    const courses = await youtubeCoursesService.getYoutubeCourses();

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Youtube Courses fetched successfully!",
      data: courses,
    });
  }
}

export const youtubeCoursesController = new YoutubeCoursesController();
