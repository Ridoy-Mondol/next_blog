import signupUser from "@/models/signupModel";
import connectDB from '@/db/connection';
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const secretkey = process.env.JWT_SECRET_KEY;
export async function PATCH (request) {
   const { email, password } = await request.json();
   try {
     await connectDB();
     const userExist = await signupUser.findOne({ email });

    //  if (!userExist) {
    //     return new NextResponse(JSON.stringify({
    //         message: "User not exist",
    //         success: false,
    //     }), {
    //         status: 404,
    //     })
    //  }
    const saltRound = 10;
     const hashesdPassword = await bcrypt.hash(password, saltRound);
    await signupUser.updateOne(
       { email },
       { $set: { password: hashesdPassword }}
     );

     const tokenPayload = {
        userId: userExist._id,
     };
     const token = jwt.sign(tokenPayload, secretkey, {
        expiresIn: '10d',
     })

     const response = new NextResponse(JSON.stringify({
        message: "Password reset successfully",
        success: true
     }), {
        status: 200,
     });

     response.cookies.set('token2', token, {
        maxAge: 10 * 24 * 60 * 60,
     });
     return response;
   } catch (error) {
      console.error ('Error:', error);
      return new NextResponse(JSON.stringify ({
         message: "Something went wrong. Please try again.",
         success: false,
      }), {
        status: 500,
      })
   }
}