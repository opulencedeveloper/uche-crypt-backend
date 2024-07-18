import { Document } from "mongoose";

export interface IYoutubeCourses extends Document {
  video_url: string;
}
