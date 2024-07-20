import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import { allCoursesService } from "../all_course/service";
import { userService } from "../user/service";
import { paymentService } from "./service";

dotenv.config();

const secret_key = process.env.PAYSTACK_SECRET_KEY || "";


class PaymentController {
  public async pay(req: Request, res: Response) {
    const { user_id } = req as CustomRequest;
    
    const { course_id } = req.params;

    const course_exist = await allCoursesService.find_course_by_id(course_id);
    
    const userData = await userService.find_user_by_id(user_id);

    if (!course_exist || !userData) {

      return res.status(404).json({
        message: MessageResponse.Error,
        description: !course_exist ? "Course not found!": "User does not exist!",
        data: null,
      });
    }

    const retrived_course_id = course_exist._id as string;

    const has_enrolled = await userService.check_enrollement_status(user_id, retrived_course_id);

    if (has_enrolled) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "You have already enrolled for this course!",
        data: null,
      });
    }

    const converted_to_kobo = course_exist.price * 100;

    const transactionDetails = {
      amount: converted_to_kobo,
      email: userData.email,
      metadata: {
        custom_fields: [
          {
            course_id: course_exist._id,
          },
        ],
      },
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      transactionDetails,
      {
        headers: {
          Authorization: `Bearer ${secret_key}`,
        },
      }
    );

    const payment_reference_id = response.data.data.reference;

    const user = await paymentService.start_enrollment_to_course(
      user_id,
      retrived_course_id,
      payment_reference_id
    );

    if (!user) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "Payment is being processed but user was not found!",
        data: null,
      });
    }


    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Sucess!",
      data: {
       // price: converted_to_kobo,
        authorization_url: response.data.data.authorization_url,
      //  reference: response.data.data.reference,
      },
    });
  }

  public async verify_payment(req: Request, res: Response) {

    const hash = crypto.createHmac('sha512', secret_key).update(JSON.stringify(req.body)).digest('hex');

    if (hash == req.headers['x-paystack-signature']) {
    const event = req.body;
      if (event.event === "charge.success") {
        await paymentService.enroll_to_course(event.data.reference);
        
      }
    
  }
} 
}

export const paymentController = new PaymentController();
