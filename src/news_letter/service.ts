import { Request } from "express";

import NewsLetter from "./entity";

class NewsLetterService {
  public async postNewsLetter(req: Request) {
    const { email } = req.body;

    const newsLetter = new NewsLetter({
      email,
    });

    await newsLetter.save();

    return newsLetter;
  }

  public async findNewsLetterByEmail(req: Request) {
    const { email } = req.body;

    const newsLetter = NewsLetter.findOne({ email });

    return newsLetter;
  }
}

export const newsLetterService = new NewsLetterService();
