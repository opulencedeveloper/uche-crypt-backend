import User from "../user/entity";
import { IEnrolledCourses } from "../user/interface";

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
}

export const paymentService = new PaymentService();
