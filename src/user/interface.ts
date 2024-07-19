import { Document, StringExpressionOperatorReturningNumber } from "mongoose";

interface IEnrolledCourseContent {
  module_id: string;
  // video_url: string;
  // module_number: number | undefined;
  // title: string | undefined;
  // description: string | undefined;
  // watched: boolean | undefined;
}

export interface IEnrolledCourses {
  course_id: string;
  enrolled_course_content: IEnrolledCourseContent[];
}

export interface IUser extends Document {
  email: string;
  password: string;
  enrolled_courses: IEnrolledCourses[];
  email_verified: boolean;
  email_verify_otp: string | undefined;
  email_verify_otp_expiration: Date | undefined;
}