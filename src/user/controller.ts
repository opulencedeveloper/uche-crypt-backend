import { Request, Response } from "express";
import axios from "axios";

import { MessageResponse } from "../utils/enum";
import { userService } from "./service";
import { allCoursesService } from "../all_course/service";
import { CustomRequest } from "../utils/interface";

class UserController {
  public async verify_payment(req: Request, res: Response) {
    const secret = "sk_test_166f55da8659798259ecba885f1137cf3b13d0e7";
    const hash = require("crypto")
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash === req.headers["x-paystack-signature"]) {
      const event = req.body;

      console.log("payyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyysttttttttttttttttttttttack", event)

      if (event.event === "charge.success") {
       
      }
    }
  }
  public async pay(req: Request, res: Response) {
    const { user_id } = req as CustomRequest;
    const { email, amount } = req.body;

    const transactionDetails = {
      email: email,
      amount: amount,
      metadata: {
        custom_fields: [
          {
            user_id: user_id,
          },
        ],
      },
    };
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      transactionDetails,
      {
        headers: {
          Authorization: `Bearer sk_test_166f55da8659798259ecba885f1137cf3b13d0e7`,
        },
      }
    );
    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Sucess!",
      data: {
        authorization_url: response.data.data.authorization_url,
        reference: response.data.data.reference,
      },
    });
  }

  public async enroll_to_course(req: Request, res: Response) {
    const course_exist = await allCoursesService.find_course_by_id(req);

    if (!course_exist) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "Course not found!",
        data: null,
      });
    }

    const has_enrolled = await userService.find_user_by_id_and_course_id(req);

    if (has_enrolled) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "You have already enrolled for this course!",
        data: null,
      });
    }

    const user_data = await userService.enroll_to_course(req);

    if (!user_data) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description:
          "User does not exist, could not enroll you please contact support!",
        data: null,
      });
    }

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "You have successfully enrolled to this course!",
      data: null,
    });
  }

  public async fetched_enrolled_course_detail(req: Request, res: Response) {
    const course_exist = await allCoursesService.find_course_by_id(req);

    if (!course_exist) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "Course not found!",
        data: null,
      });
    }

    const course_details = await userService.fetch_enrolled_courses_detail(req);

    if (!course_details) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Sorry you have not enrolled for this course!",
        data: null,
      });
    }

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Courses fetched successfully!",
      data: course_details,
    });
  }

  public async fetched_all_enrolled_courses(req: Request, res: Response) {
    const userData = await userService.fetch_all_enrolled_courses(req);

    if (!userData) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Courses fetched successfully!",
      data: userData,
    });
  }

  // public async fetchUserData(req: Request, res: Response) {
  //   const { user_id } = req as CustomRequest;

  //   const userData = await userService.find_user_by_id(req);

  //   if (!userData) {
  //     return res.status(404).json({
  //       message: MessageResponse.Error,
  //       description: "User does not exist",
  //       data: null,
  //     });
  //   }

  //   return res.status(200).json({
  //     message: MessageResponse.Error,
  //     description: "User details retrived successfully!",
  //     data: userData,
  //   });
  // }

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
