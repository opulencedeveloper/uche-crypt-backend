import { Request } from "express";
import mongoose from "mongoose";

import User from "./entity";
import AllCourse from "../all_course/entity";
import { IEnrolledCourses } from "./interface";
import { CustomRequest } from "../utils/interface";

class UserService {
  public async findUserByEmail(req: Request) {
    const { email } = req.body;

    const user = await User.findOne({
      email: email,
    });

    return user;
  }

  public async find_user_by_id(req: Request) {
    const { id } = req.body;

    const user = await User.findById(id);

    return user;
  }

  public async enroll_to_course(req: Request) {
    const { user_id } = req as CustomRequest;

    const { course_id } = req.params;
  
    let user = await User.findById(user_id).select("enrolled_courses");

    const course = await AllCourse.findById(course_id);
  
    if (!user || !course) return;
  
    let enrolledCourse = course.course_content.flatMap((content) =>
      content.modules.map((module) => ({
        module_id: module._id.toString(),
        watched: false,
      }))
    );
  
    const newEnrolledCourse: IEnrolledCourses = {
      course_id: course_id,
      enrolled_course_content: enrolledCourse,
    };
  
    user.enrolled_courses.push(newEnrolledCourse);

    user = await user.save();
  
    return user;
  }

  public async fetch_enrolled_courses_detail(req: Request) {
    const { course_id } = req.params;

    const { user_id } = req as CustomRequest;
  
    console.log(user_id, course_id);
  
    const course = await AllCourse.findById(course_id);

    const user = await User.findOne({
      _id: user_id,
      "enrolled_courses.course_id": course_id,
    });
  
    if (!user || !course) return;
  
    const enrolledCourse = user.enrolled_courses.find(
      (ec) => ec.course_id === course_id
    );
  
    if (!enrolledCourse) return;
  
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
  }
  

  public async fetch_all_enrolled_courses(req: Request) {
    const { user_id } = req as CustomRequest;
  
    // Find d user by user_id
    const user = await User.findById(user_id);
  
    if (!user) return;
  
    // Extract d course_ids from the user's enrolled courses
    const enrolled_courses_id = user.enrolled_courses.map(
      (content) => content.course_id
    );
  
    // Retrieve d courses by course_id
    const retrieved_enrolled_courses = await AllCourse.find({
      _id: { $in: enrolled_courses_id },
    }).select("title description video_url");
  
    return retrieved_enrolled_courses;
  }


  public async find_user_by_id_and_course_id(req: Request) {
    const { user_id } = req as CustomRequest;

    const { course_id } = req.params;

  const user = await User.findOne({
    _id: user_id,
    "enrolled_courses.course_id": course_id,
  });
  
    return user;
  }
  

 
  // public async enroll_to_course(req: Request) {
  //   const { user_id } = req as CustomRequest;

  //   const { course_id } = req.params;

  //   let user = await User.findById(user_id).select("enrolled_courses");

  //   const course = await AllCourse.findById(course_id);

  //   if (!user || !course) return;

  //   let enrolledCourse = course.course_content.map((content) => ({
  //     module_id: content._id.toString(),
  //     watch: false,
  //   }));

  //   const newEnrolledCourse: IEnrolledCourses = {
  //     course_id: course_id,
  //     enrolled_course_content: enrolledCourse,
  //   };

  //   user.enrolled_courses.push(newEnrolledCourse);

  //   user = await user.save();

  //   return user;
  // }

  // public async fetch_enrolled_courses(req: Request) {
  //   const { course_id } = req.params;
  //   const { user_id } = req as CustomRequest;
  
  //   console.log(user_id, course_id);
  
  //   const course = await AllCourse.findById(course_id);
  //   const user = await User.findOne({
  //     _id: user_id,
  //     enrolled_courses: {
  //       $elemMatch: { course_id: course_id },
  //     },
  //   });
  
  //   if (!user || !course) return [];
  
  //   let enrolled_course_content;
  
  //   const enrolledCourse = user.enrolled_courses.find(
  //     (ec) => ec.course_id === course_id
  //   );
  
  //   if (enrolledCourse) {
  //     const existingContentMap = new Map();
  //     for (const content of enrolledCourse.enrolled_course_content) {
  //       existingContentMap.set(content.module_id, content);
  //     }
  
  //     enrolled_course_content = course.course_content.map((content) => {
  //       const existingContent = existingContentMap.get(content._id.toString());
  //       return {
  //         module_id: existingContent.module_id,
  //         video_url: content.video_url,
  //         module_number: content.module_number,
  //         title: content.title,
  //         description: content.description,
  //         watched: existingContent !== undefined ? existingContent.watched : false,
  //       };
  //     });
  //   }
  
  //   return enrolled_course_content;
  // }

  // public async fetch_all_enrolled_courses(req: Request) {
  //   const { user_id } = req as CustomRequest;
  
  //   // Find d user by user_id
  //   const user = await User.findById(user_id);
  
  //   if (!user) return;
  
  //   // Extract d course_ids from d user's enrolled courses
  //   const enrolled_courses_id = user.enrolled_courses.map(
  //     (content) => content.course_id
  //   );
  
  //   // Retrieve d courses by course_id
  //   const retrived_enrolled_courses = await AllCourse.find({
  //     _id: { $in: enrolled_courses_id },
  //   }).select('title description video_url');
  
  //   return retrived_enrolled_courses;
  // }
  
}

export const userService = new UserService();
