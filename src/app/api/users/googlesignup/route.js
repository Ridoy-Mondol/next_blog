import signupUser from "@/models/signupModel";
import connectDB from "@/db/connection";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;
export async function POST(request) {
  try {
    const { name, email, image } = await request.json();
    await connectDB();
    const userExist = await signupUser.findOne({ email });
    if (userExist) {
      return new NextResponse(
        JSON.stringify({
          message: "User already exist",
          success: false,
        }),
        { status: 409 }
      );
    }

    const newUser = new signupUser({
      name,
      email,
      password: null,
      profileImage: image,
    });

    await newUser.save();

    const tokenPayload = { userId: newUser._id };
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: "10d" });

    const response = new NextResponse(
      JSON.stringify({
        message: "Signup successful",
        success: true,
        token,
      }),
      {
        status: 200,
      }
    );

    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong. Please try again",
        success: false,
      }),
      { status: 500 }
    );
  }
}
