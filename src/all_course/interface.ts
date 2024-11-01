import mongoose, { Document } from "mongoose";

interface IModule {
  _id: mongoose.Types.ObjectId;
  video_url: string;
  title: string;
}

interface ICourseContent {
  title: string;
  modules: IModule[];
}

export interface IAllCourses extends Document {
  video_url: string;
  title: string;
  description: string;
  price: number;
  naira_price: number;
  slashed_price: number;
  slug: string;
  details: string[];
  introduction: string;
  course_content: ICourseContent[];
}
