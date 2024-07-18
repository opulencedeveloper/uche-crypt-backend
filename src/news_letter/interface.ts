import { Document } from "mongoose";

export interface INewsletter extends Document {
  email: string;
}
