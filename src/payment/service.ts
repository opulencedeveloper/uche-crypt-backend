import mongoose from "mongoose";

import User from "../user/entity";
import { IEnrolledCourses } from "../user/interface";
import AllCourse from "../all_course/entity";

class PaymentService {
  public async start_enrollment_to_course(
    user_id: string,
    course_id: string,
    payment_reference_id: string
  ) {
    const user = await User.findById(user_id);

    if (user) {
      const newEnrolledCourse: IEnrolledCourses = {
        course_id: course_id,
        paid: false,
        payment_reference_id: payment_reference_id,
      };

      user.enrolled_courses.push(newEnrolledCourse);
    }
    return user;
  }

  public async enroll_to_course(payment_reference_id: string) {
    
    let user = await User.findOne({
      "enrolled_courses.payment_reference_id": payment_reference_id,
    }).select("enrolled_courses");

    if (!user) {
      return;
    }

    // Find the enrolled course that matches the payment_reference_id
    const enrolledCourse = user.enrolled_courses.find(
      (course) => course.payment_reference_id === payment_reference_id
    );

    if (!enrolledCourse) {
      return;
    }

    // Retrieve the course details from the AllCourse collection
    const course = await AllCourse.findById(enrolledCourse.course_id);

    if (!course) {
      return;
    }

    // Prepare the enrolled course content
    let enrolledCourseContent = course.course_content.flatMap((content) =>
      content.modules.map((module) => ({
        module_id: module._id.toString(),
        watched: false,
      }))
    );

    enrolledCourse.paid = true;
    enrolledCourse.enrolled_course_content = enrolledCourseContent;

    user = await user.save();

    return user;
  
}
}

export const paymentService = new PaymentService();
