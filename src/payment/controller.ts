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
const ivenpay_key = process.env.IVENDPAY_KEY || "";
const clientUrl = process.env.CLIENT_URL;


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

    const converted_to_kobo = course_exist.naira_price * 100;
    

    const transactionDetails = {
      amount: converted_to_kobo,
      email: userData.email,
      callback_url: `${clientUrl}/my-learning`,
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
  
  public async generate_link_for_crypto_payment(req: Request, res: Response) {
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


    const price = course_exist.price;
    
    const transactionDetails = {
      amount_fiat: price,
      currency_fiat: "USD",
      foreign_id: "2000",
      url_success: `${clientUrl}/my-learning`,
      url_failed: `${clientUrl}/my-learning`,
    };

    try {
      const response = await axios.post(
        'https://api.ivpay.io/api/v4/payment/create',
        transactionDetails,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": ivenpay_key,
          },
        }
      );

      console.log(response.data.data.payment_url);


      const payment_reference_id = response.data.data.payment_id;

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
        message: "Success",
        description: "Payment link generated successfully!",
        data: {
          authorization_url: response.data.data.payment_url,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error",
        description: "Failed to generate payment link.",
        error: "error.message",
      });
    }
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


public async verify_crypto_payment(req: Request, res: Response) {
  const retrived_api_key = req.headers['x-api-key'];
  
  if(retrived_api_key === ivenpay_key) {
    const event = req.body;

  // Extract relevant data from the event payload
  const paymentId = event.payment_id;
  const status = event.status;
  const processedAt = event.processed_at;
  const foreignId = event.foreign_id;
  const network = event.network;
  const txUrl = event.tx_url;

  // Log or process the payment status and other information
  console.log(`Payment ID: ${paymentId}`);
  console.log(`Status: ${status}`);  // This should display "PAID" or other statuses as per iVend Pay
  console.log(`Processed At: ${processedAt}`);
  console.log(`Foreign ID: ${foreignId}`);
  console.log(`Network: ${network}`);
  console.log(`Transaction URL: ${txUrl}`);

  if (status === "PAID") {
    await paymentService.enroll_to_course(paymentId);
  }
  

} 
}


  // public async generate_link_for_crypto_payment(req: Request, res: Response) {
  //   // const { user_id } = req as CustomRequest;
    
  //   // const { course_id } = req.params;

  //   // const course_exist = await allCoursesService.find_course_by_id(course_id);
    
  //   // const userData = await userService.find_user_by_id(user_id);

  //   // if (!course_exist || !userData) {

  //   //   return res.status(404).json({
  //   //     message: MessageResponse.Error,
  //   //     description: !course_exist ? "Course not found!": "User does not exist!",
  //   //     data: null,
  //   //   });
  //   // }

  //   // const retrived_course_id = course_exist._id as string;

  //   // const has_enrolled = await userService.check_enrollement_status(user_id, retrived_course_id);

  //   // if (has_enrolled) {
  //   //   return res.status(400).json({
  //   //     message: MessageResponse.Error,
  //   //     description: "You have already enrolled for this course!",
  //   //     data: null,
  //   //   });
  //   // }

  //   // const converted_to_kobo = course_exist.price * 100;
  //   // const clientUrl = process.env.CLIENT_URL;

  //   const transactionDetails = {
  //     amount_fiat: "50",
  //     currency_fiat: "USD",
  //     foreign_id: "2000",
  //     url_success: "https://uche-crypt.vercel.app/",
  //     url_failed: "https://uche-crypt.vercel.app/"
  //   };

  //   const response = await axios.post(
  //    'https://api.ivpay.io/payments',
  //     transactionDetails,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${ivenpay_key}`,
  //       },
  //     }
  //   );

  //   // const payment_reference_id = response.data.data.reference;

  //   // const user = await paymentService.start_enrollment_to_course(
  //   //   user_id,
  //   //   retrived_course_id,
  //   //   payment_reference_id
  //   // );

  //   // if (!user) {
  //   //   return res.status(404).json({
  //   //     message: MessageResponse.Error,
  //   //     description: "Payment is being processed but user was not found!",
  //   //     data: null,
  //   //   });
  //   // }


  //   return res.status(201).json({
  //     message: MessageResponse.Success,
  //     description: "Sucess!",
  //     data: {
  //      // price: converted_to_kobo,
  //       authorization_url: response,
  //     //  reference: response.data.data.reference,
  //     },
  //   });
  // }

}

export const paymentController = new PaymentController();
