import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { userService } from "./service";
import { CustomRequest } from "../utils/interface";
import { comparePassword } from "../utils/auth";

class UserController {
  public async fetchUserData(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    const userData = await userService.find_user_by_id(req);

    if (!userData) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User does not exist",
        data: null,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Error,
      description: "User details retrived successfully!",
      data: userData,
    });
  }

  // public async updateUserData(req: Request, res: Response) {
  //   const { userId } = req as CustomRequest;

  //   const userExist = await userService.findUserById(userId);

  //   if (!userExist) {
  //     return res.status(404).json({
  //       message: MessageResponse.Error,
  //       description: "User does not exist",
  //       data: null,
  //     });
  //   }

  //   const updatedUserData = await userService.updateUserDataById(userId, req);

  //   return res.status(201).json({
  //     message: MessageResponse.Success,
  //     description: "Your details is updated successfully!",
  //     data: updatedUserData,
  //   });
  // }

  // public async changeUserPassword(req: Request, res: Response) {
  //   const { userId } = req as CustomRequest;
  //   const { newPassword, oldPassword } = req.body;

  //   const userExist = await userService.findUserByIdWithPassword(userId);

  //   if (!userExist) {
  //     return res.status(404).json({
  //       message: MessageResponse.Error,
  //       description: "User does not exist",
  //       data: null,
  //     });
  //   }

  //   const match = await comparePassword(oldPassword, userExist.password);

  //   if (!match) {
  //     return res.status(400).json({
  //       message: MessageResponse.Error,
  //       description: "Invalid Password!",
  //       data: null,
  //     });
  //   }

  //   await userService.updateUserPasswordById(userId, newPassword);

  //   return res.status(201).json({
  //     message: MessageResponse.Success,
  //     description: "Your password is changed successfully!",
  //     data: null,
  //   });
  // }
}

export const userController = new UserController();
