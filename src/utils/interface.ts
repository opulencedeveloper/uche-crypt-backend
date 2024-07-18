import { Request } from "express";

export interface ISendEmail {
  receiverEmail: string;
  subject: string;
  emailTemplate: string;
}

export interface CustomRequest extends Request {
  userId: string;
}
