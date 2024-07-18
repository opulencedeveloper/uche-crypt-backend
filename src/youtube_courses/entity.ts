import mongoose from "mongoose";

import { IYoutubeCourses } from "./interface";

const Schema = mongoose.Schema;

const youtubeCoursesSchema = new Schema({
  video_url: {
    type: String,
    required: true,
  }
});

const YoutubeCourse = mongoose.model<IYoutubeCourses>("YoutubeCourse", youtubeCoursesSchema);

export default YoutubeCourse;
