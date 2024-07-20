import { Request } from "express";

import User from "./entity";
import AllCourse from "../all_course/entity";
import { CustomRequest } from "../utils/interface";

class UserService {
  public async findUserByEmail(req: Request) {
    const { email } = req.body;

    const user = await User.findOne({
      email: email,
    });

    return user;
  }

  public async find_user_by_id(id: string) {
    const user = await User.findById(id);

    return user;
  }

  public async mark_video_as_watched(req: Request) {
    const { course_id, module_id } = req.query;

    const { user_id } = req as CustomRequest;

    const user = await User.findOneAndUpdate(
      {
        _id: user_id,
        "enrolled_courses.course_id": course_id,
        "enrolled_courses.enrolled_course_content.module_id": module_id
      },
      {
        // enrolled_courses: This is the array of courses that the user is enrolled in.
        // $[course]: This is a positional operator that refers to the specific element in the enrolled_courses array that matches the filter criteria provided in the arrayFilters option. In this case, it represents the course object within the enrolled_courses array.
        // enrolled_course_content: This is the nested array within each enrolled_course object, containing the modules of the course.
        // $[module]: This is another positional operator that refers to the specific element in the enrolled_course_content array that matches the filter criteria provided in the arrayFilters option. It represents the module object within the enrolled_course_content array.
        // watched:This is the field within each module that we want to update.
        $set: {
          "enrolled_courses.$[course].enrolled_course_content.$[module].watched":
            true,
        },
      },
      {
        arrayFilters: [
          { "course.course_id": course_id },
          { "module.module_id": module_id },
        ],
        new: true, // Return the modified document
      }
    );

    return user;
  }

  public async fetch_enrolled_courses_detail(req: Request) {
    const { course_id } = req.params;

    const { user_id } = req as CustomRequest;

    const course = await AllCourse.findById(course_id);

    const user = await User.findOne({
      _id: user_id,
      "enrolled_courses.course_id": course_id,
      "enrolled_courses.paid": true,
    });

    if (!user || !course) return;

    const enrolledCourse = user.enrolled_courses.find(
      (ec) => ec.course_id === course_id
    );

    if (!enrolledCourse || !enrolledCourse.enrolled_course_content)
      return;

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

  public async check_enrollement_status(user_id: string, course_id: string) {
    const user = await User.findOne({
      _id: user_id,
      "enrolled_courses.paid": true,
      "enrolled_courses.course_id": course_id,
    });

    return user;
  }

  
  // public async enroll_to_course(
  //   user_id: string,
  //   course_id: string,
  //   payment_reference_id: string
  // ) {
  //   // const { user_id } = req as CustomRequest;

  //   // const { course_id } = req.params;

  //   let user = await User.findOne({
  //     _id: user_id,
  //     "enrolled_courses.payment_reference_id": payment_reference_id,
  //   }).select("enrolled_courses");

  //   await User.findById(user_id).select("enrolled_courses");

  //   const course = await AllCourse.findById(course_id);

  //   if (!user || !course) return;

  //   let enrolledCourse = course.course_content.flatMap((content) =>
  //     content.modules.map((module) => ({
  //       module_id: module._id.toString(),
  //       watched: false,
  //     }))
  //   );

  //   const newEnrolledCourse: IEnrolledCourses = {
  //     course_id: course_id,
  //     paid: true,
  //     payment_reference_id: payment_reference_id,
  //     enrolled_course_content: enrolledCourse,
  //   };

  //   user.enrolled_courses.push(newEnrolledCourse);

  //   user = await user.save();

  //   return user;
  // }

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
