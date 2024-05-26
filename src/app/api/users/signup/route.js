import signupUser from "@/models/signupModel";
import connectDB from '@/db/connection';
import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;

export async function POST(request) {
  try {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');
    const imagefile = data.get('image');

    let imageUrl = null;

    if (imagefile) {
      const buffer = await imagefile.arrayBuffer();
      const image = Buffer.from(new Uint8Array(buffer));
      imageUrl = await uploadToCloudinary(image, imagefile.name, imagefile.type);
    }

    await connectDB();
    const userExist = await signupUser.findOne({ email });

    if (userExist) {
      return new NextResponse(JSON.stringify({ message: "User already exists", success: false }), { status: 409 });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newuser = new signupUser({
      name,
      email,
      password: hashPassword,
      profileImage: imageUrl,
    });

    await newuser.save();

    const tokenPayload = { userId: newuser._id };
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '10d' });

    return new NextResponse(JSON.stringify({
      message: "Signup successful",
      status: 200,
      success: true,
      token,
    }));

  } catch (error) {
    console.error('Error saving document:', error);
    return new NextResponse(JSON.stringify({ message: "Signup failed", success: false }), { status: 500 });
  }
}

function uploadToCloudinary(buffer, fileName, mimeType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blogprofile",
        filename_override: fileName,
        format: mimeType.split('/').pop(),
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      reject(err);
    });

    stream.on('finish', () => {
      console.log('Stream finished');
    });

    stream.end(buffer);
  });
}
  




