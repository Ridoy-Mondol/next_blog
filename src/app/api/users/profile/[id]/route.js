import signupUser from "@/models/signupModel";
import connectDB from '@/db/connection';
import { NextResponse } from "next/server";
import cloudinary from '@/utils/cloudinary';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;
export async function GET(request, content) {
    let result = {};
    let success = true;
    try {
      await connectDB();
      const id = content.params.id;
      result = await signupUser.findOne({ _id: id });
      if (!result) {
        success = false;
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      success = false;
    }
    return NextResponse.json({ result, success });
  }

  export async function PATCH(request) {
    let success = false;
  
    try {
      const data = await request.formData();
      const updates = {};
      const token = request.headers.get('Authorization')?.split(' ')[1];
      const decodedToken = jwt.verify(token, secretKey);
      const userId = decodedToken.userId;
  
      if (data.has('name')) {
        updates.name = data.get('name');
        success = true;
      }
  
      if (data.has('password')) {
        const password = data.get('password');
        const saltRound = 10;
        const hashPassword = await bcrypt.hash(password, saltRound);
        updates.password = hashPassword;
        success = true;
      }
  
      if (data.has('profileImage')) {
        const image1File = data.get('profileImage');
        const buffer1 = await image1File.arrayBuffer();
        const image1 = Buffer.from(new Uint8Array(buffer1));
        const imageUrl1 = await uploadToCloudinary(image1, image1File.name, image1File.type);
        updates.profileImage = imageUrl1;
        success = true;
      }
  
      if (success) {
        await connectDB();
        await signupUser.updateOne({ _id: userId }, { $set: updates });
        return new NextResponse(JSON.stringify({ success }), { status: 200 });
      } else {
        return new NextResponse(JSON.stringify({ success: false, message: 'No valid fields to update' }), { status: 400 });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
  }
  
  function uploadToCloudinary(buffer, fileName, mimeType) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "blog",
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
  
      stream.end(buffer);
    });
  }