import signupUser from "@/models/signupModel";
import connectDB from '@/db/connection';
import { NextResponse } from "next/server";
import cloudinary from '@/utils/cloudinary';
import { redisClient, connectRedis } from "@/utils/redis";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const secretKey = process.env.JWT_SECRET_KEY;

export async function GET(request, content) {
  try {
    await connectDB();
    await connectRedis();
    
    const id = content.params.id;

    if (!id) {
      throw new Error('User ID is missing');
    }

    const cacheKey = `profile_data_${id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('User fetched from Redis cache');
      return NextResponse.json({ result: JSON.parse(cachedData), success: true });
    } else {
      const result = await signupUser.findOne({ _id: id });

      if (!result) {
        return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
      }

      await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600);
      console.log('User fetched from MongoDB and stored in Redis cache');
      return NextResponse.json({ result, success: true });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: "Error fetching user data", success: false }, { status: 500 });
  }
}

export async function PATCH(request, content) {
  try {
    const id = content.params.id;

    if (!id) {
      throw new Error('User ID is missing');
    }

    await connectDB();
    await connectRedis();

    const data = await request.formData();
    const updates = {};
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;

    if (data.has('name')) {
      updates.name = data.get('name');
    }

    if (data.has('password')) {
      const password = data.get('password');
      const saltRound = 10;
      const hashPassword = await bcrypt.hash(password, saltRound);
      updates.password = hashPassword;
    }

    if (data.has('profileImage')) {
      const user = await signupUser.findOne({ _id: userId });
      if (user.profileImage) {
        const publicId = user.profileImage.split('/').pop().split('.')[0];
        if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        }
      }
      const imageFile = data.get('profileImage');
      const buffer = await imageFile.arrayBuffer();
      const image = Buffer.from(new Uint8Array(buffer));
      const imageUrl = await uploadToCloudinary(image, imageFile.name, imageFile.type);
      updates.profileImage = imageUrl;
    }

    const updatedUser = await signupUser.findOneAndUpdate({ _id: userId }, { $set: updates }, { new: true });

    if (!updatedUser) {
       return new NextResponse(JSON.stringify({
         message: "Something went wrong. Please try again",
         success: false
       }),
       { status: 500 }
      )
    }
    await redisClient.del(`profile_data_${id}`);
    return new NextResponse(JSON.stringify({
      result: updatedUser,
      message: "Updated successfully",
      success: true
    }),
    { status: 200 }
  )
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse(JSON.stringify({
      message: "Something went wrong. Please try again",
      success: false 
    }),
    { status: 500 }
  )
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
