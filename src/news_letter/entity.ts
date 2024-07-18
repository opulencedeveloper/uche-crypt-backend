import mongoose from "mongoose";

import { INewsletter } from "./interface";

const Schema = mongoose.Schema;

const newsLetterSchema = new Schema({
  email: {
    type: String,
    require,
  },
});

const NewsLetter = mongoose.model<INewsletter>("NewsLetter", newsLetterSchema);

export default NewsLetter;
