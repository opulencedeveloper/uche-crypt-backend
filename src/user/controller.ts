import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { userService } from "./service";
import { allCoursesService } from "../all_course/service";
import { CustomRequest } from "../utils/interface";

class UserController {
  public async fetch_user_details(req: Request, res: Response) {
    const { user_id } = req as CustomRequest;

    const user_exist = await userService.find_user_by_id(user_id);

    if (!user_exist) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "User details fetched successfully!",
      data: {
        email: user_exist.email,
      },
    });
  }

  public async fetched_enrolled_course_detail(req: Request, res: Response) {
    const { course_id } = req.params;

    const course_exist = await allCoursesService.find_course_by_id(course_id);

    if (!course_exist) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "Course not found!",
        data: null,
      });
    }

    const course_details = await userService.fetch_enrolled_courses_detail(req);

    if (!course_details) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Sorry you have not enrolled for this course!",
        data: null,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Courses fetched successfully!",
      data: {
        course_title: course_exist.title,
        course_details,
      },
    });
  }

  public async fetched_all_enrolled_courses(req: Request, res: Response) {
    const userData = await userService.fetch_all_enrolled_courses(req);

    if (!userData) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Courses fetched successfully!",
      data: userData,
    });
  }

  public async mark_video_as_watched(req: Request, res: Response) {
    const { course_id } = req.query;

    const query_course_id = course_id as string;

    const course_exist = await allCoursesService.find_course_by_id(
      query_course_id
    );

    if (!course_exist) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "Course not found!",
        data: null,
      });
    }

    const has_marked = await userService.mark_video_as_watched(req);

    if (!has_marked) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "This video does not exist!",
        data: null,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Video has been marked as watched!",
      data: null,
    });
  }

  // public async enroll_to_course(req: Request, res: Response) {
  //   const course_exist = await allCoursesService.find_course_by_id(req);

  //   if (!course_exist) {
  //     return res.status(404).json({
  //       message: MessageResponse.Error,
  //       description: "Course not found!",
  //       data: null,
  //     });
  //   }

  //   const has_enrolled = await userService.find_user_by_id_and_course_id(req);

  //   if (has_enrolled) {
  //     return res.status(400).json({
  //       message: MessageResponse.Error,
  //       description: "You have already enrolled for this course!",
  //       data: null,
  //     });
  //   }

  //   const user_data = await userService.enroll_to_course(req);

  //   if (!user_data) {
  //     return res.status(404).json({
  //       message: MessageResponse.Error,
  //       description:
  //         "User does not exist, could not enroll you please contact support!",
  //       data: null,
  //     });
  //   }

  //   return res.status(201).json({
  //     message: MessageResponse.Success,
  //     description: "You have successfully enrolled to this course!",
  //     data: null,
  //   });
  // }
}

export const userController = new UserController();

// public async fetch_user_details(req: Request, res: Response) {

//   return res.status(200).json({
//     message: MessageResponse.success,
//     description: "User details fetched successfully".
//     data: {
//       email: user_exist.email
//     }
//   })
// }
