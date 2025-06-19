import signupUser from "@/models/signupModel";
import connectDB from "@/db/connection";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;
export async function POST(request) {
  try {
    const { email } = await request.json();
    await connectDB();
    const userExist = await signupUser.findOne({ email });
    if (!userExist) {
      return new NextResponse(
        JSON.stringify({
          message: "User not exist",
          success: false,
        }),
        { status: 404 }
      );
    }
    if (userExist.password !== null) {
      return new NextResponse(
        JSON.stringify({
          message: "Can't login. This account is not created with google.",
          success: false,
        })
      );
    }

    const tokenPayload = { userId: userExist._id };
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: "10d" });

    const response = new NextResponse(
      JSON.stringify({
        message: "Login successful",
        success: true,
        token,
      }),
      {
        status: 200,
      }
    );
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong. Please try again",
        success: false,
      }),
      { status: 500 }
    );
  }
}
