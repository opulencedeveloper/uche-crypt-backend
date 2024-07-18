import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { newsLetterService } from "./service";

class NewsLetterController {
  public async postNewsLetter(req: Request, res: Response) {
    const newsLetterExist = await newsLetterService.findNewsLetterByEmail(req);

    if (newsLetterExist) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Email already exist on our newsletter!",
        data: null,
      });
    }
    await newsLetterService.postNewsLetter(req);

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Email added to newsletter successfully!",
      data: null,
    });
  }
}

export const newsLetterController = new NewsLetterController();
