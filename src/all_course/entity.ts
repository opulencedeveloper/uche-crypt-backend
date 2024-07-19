import mongoose from "mongoose";

import { IAllCourses } from "./interface";

const Schema = mongoose.Schema;

const allCoursesSchema = new Schema({
  video_url: {
    type: String,
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
  price: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  details: {
    type: [String],
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  course_content: [
    {
      title: {
        type: String,
        required: true,
      },
      modules: [
        {
          video_url: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

const AllCourse = mongoose.model<IAllCourses>("AllCourse", allCoursesSchema);

export default AllCourse;
