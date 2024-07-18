import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

import { CustomRequest } from "../utils/interface";
import { MessageResponse } from "../utils/enum";

dotenv.config();

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({
      message: MessageResponse.Error,
      description: "Not authenticated",
      data: null,
    });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (err) {
    return res.status(401).json({
      message: MessageResponse.Error,
      description: "Not authenticated",
      data: null,
    });
  }
  if (!decodedToken) {
    return res.status(401).json({
      message: MessageResponse.Error,
      description: "Not authenticated",
      data: null,
    });
  }
  (req as CustomRequest).userId = decodedToken.userId;
  next();
};
