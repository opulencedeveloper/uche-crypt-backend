import { Document } from "mongoose";

interface ICourseContent {
  video_url: string;
  module_number: number;
  title: string;
  description: string;
}

export interface IAllCourses extends Document {
  video_url: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  details: string[];
  introduction: string;
  course_content: ICourseContent[];
}
