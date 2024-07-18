import { Request } from "express";

import User from "./entity";
import AllCourse from "../all_course/entity";

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

  public async enroll_course(req: Request) {

      const { id, user_id } = req.body;
  
      // Fetch the course by ID
      const course = await AllCourse.findById(id);

  
      const user = await User.findOne({
        _id: user_id,
        enrolled_courses: {
          $elemMatch: { course_id: id },
        },
      });
      if(!user || !course) return [];
  
      // Find the enrolled course in the user's enrolled courses
      const enrolledCourse = user.enrolled_courses.find(ec => ec.course_id === id);
      if(enrolledCourse) {
        // Create a map of existing content by module_number to preserve 'watched' state
        const existingContentMap = new Map();
        for (const content of enrolledCourse.enrolled_course_content) {
          existingContentMap.set(content.module_number, content);
        }
  
        // Populate enrolled_course_content while preserving 'watched' state
        enrolledCourse.enrolled_course_content = course.course_content.map(content => {
          const existingContent = existingContentMap.get(content.module_number);
          return {
            video_url: content.video_url,
            module_number: content.module_number,
            title: content.title,
            description: content.description,
            watched: existingContent.watched,
          };
        });  
      return enrolledCourse;
      }  

  
  }
}

export const userService = new UserService();
