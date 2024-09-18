import mongoose, { Schema} from "mongoose";

import { IUser } from "./interface";


const enrolledCourseContentSchema: Schema = new Schema({
  module_id: {
    type: String
  },
  watched: {
    type: Boolean,
    default: false,
  },
});

const enrolledCoursesSchema: Schema = new Schema({
  course_id: {
    type: String,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  payment_reference_id: {
    type: String
  },
  enrolled_course_content: [enrolledCourseContentSchema],
});

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: null,
  },
  enrolled_courses: [enrolledCoursesSchema],
  email_verified: {
    type: Boolean,
    default: false,
  },
  email_verify_otp: String,
  email_verify_otp_expiration: Date,
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
