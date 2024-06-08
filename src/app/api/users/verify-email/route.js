import connectDB from '@/db/connection';
import signupUser from "@/models/signupModel";
import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;

export async function POST(request) {
  try {
    const { ClientVerificationCode } = await request.json();

    if (!ClientVerificationCode) {
      throw new Error('Verification code not provided');
    }

    const Verifytoken = request.cookies.get('token')?.value;


    if (!Verifytoken) {
      throw new Error('Token not provided');
    }

    const { name, email, password, imageUrl, verificationCode } = jwt.verify(Verifytoken, secretKey);


    const storedVerificationCode = parseInt(ClientVerificationCode, 10);

    if (verificationCode !== storedVerificationCode) {
      cloudinary.uploader.destroy(imageUrl);
      return new NextResponse(JSON.stringify({
        message: "Verification code does not match",
        success: false,
      }), {
        status: 400,
      });
    }

    await connectDB();

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new signupUser({
      name,
      email,
      password: hashPassword,
      profileImage: imageUrl,
    });

    await newUser.save();

    const tokenPayload = { userId: newUser._id };
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '10d' });

    const response = new NextResponse(JSON.stringify({
      message: "Verification successful",
      success: true,
    }), {
      status: 200,
    });

    response.cookies.set('token2', token , { maxAge: 10 * 24 * 60 * 60});
    response.cookies.set('token', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Error verifying email:', error);
    return new NextResponse(JSON.stringify({ message: error.message || "Invalid or expired token", success: false }), { status: 400 });
  }
}


