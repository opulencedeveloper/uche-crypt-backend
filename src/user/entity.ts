import mongoose, { Schema, Document } from "mongoose";

import { IUser } from "./interface";


const enrolledCourseContentSchema: Schema = new Schema({
  video_url: {
    type: String,
    required: true,
  },
  module_number: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
  enrolled_course_content: [enrolledCourseContentSchema],
});

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
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
