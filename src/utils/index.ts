import { NextFunction, Request, Response } from "express";
import Crypto from "crypto";

// Middleware function to wrap controllers with try-catch
export const wrapAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

//Convert all uppercase letters to lowercase and replace all spaces with dashed "-"
export const slugify = (input: string): string => {
  return input.toLowerCase().replace(/\s+/g, '-');
};

export const generate_otp = (): string  => {
  return Array.from({ length: 4 }, () => Crypto.randomInt(0, 10)).join('');
}

export function generateForeignId() {
  return Crypto.randomBytes(16).toString('hex'); // Generates a 32-character hexadecimal string
}

