import signupUser from "@/models/signupModel";
import connectDB from "@/db/connection";
import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";
// import { redisClient, connectRedis } from "@/utils/redis"; // Commented out Redis import
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const secretKey = process.env.JWT_SECRET_KEY;

export async function GET(request, content) {
  try {
    await connectDB();
    // await connectRedis(); // Commented out Redis connection

    const id = content.params.id;

    if (!id) {
      throw new Error("User ID is missing");
    }

    // const cacheKey = `profile_data_${id}`; // Commented out cache key logic
    // const cachedData = await redisClient.get(cacheKey); // Commented out Redis cache get

    // if (cachedData) { // Commented out Redis cache logic
    //   console.log('User fetched from Redis cache');
    //   return NextResponse.json({ result: JSON.parse(cachedData), success: true });
    // } else {
    const result = await signupUser.findOne({ _id: id });

    if (!result) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600); // Commented out Redis cache set
    console.log("User fetched from MongoDB");
    return NextResponse.json({ result, success: true });
    // }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Error fetching user data", success: false },
      { status: 500 }
    );
  }
}

export async function PATCH(request, content) {
  try {
    const id = content.params.id;

    if (!id) {
      throw new Error("User ID is missing");
    }

    await connectDB();
    // await connectRedis(); // Commented out Redis connection

    const data = await request.formData();
    const updates = {};
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;

    if (data.has("name")) {
      updates.name = data.get("name");
    }

    if (data.has("password")) {
      const password = data.get("password");
      const saltRound = 10;
      const hashPassword = await bcrypt.hash(password, saltRound);
      updates.password = hashPassword;
    }

    if (data.has("profileImage")) {
      const user = await signupUser.findOne({ _id: userId });
      if (user.profileImage) {
        await cloudinary.uploader.destroy(user.profileImage);
      }
      const imageFile = data.get("profileImage");
      const buffer = await imageFile.arrayBuffer();
      const image = Buffer.from(new Uint8Array(buffer));
      const imageUrl = await uploadToCloudinary(
        image,
        imageFile.name,
        imageFile.type
      );
      updates.profileImage = imageUrl;
    }

    const updatedUser = await signupUser.findOneAndUpdate(
      { _id: userId },
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // await redisClient.del(`profile_data_${id}`); // Commented out Redis cache delete
    return NextResponse.json({ result: updatedUser, success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user", success: false },
      { status: 500 }
    );
  }
}

function uploadToCloudinary(buffer, fileName, mimeType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blog",
        filename_override: fileName,
        format: mimeType.split("/").pop(),
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading file to Cloudinary:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}
