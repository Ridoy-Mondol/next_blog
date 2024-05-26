import { NextResponse } from 'next/server';
import connectDB from '@/db/connection';
import BlogPost from '@/models/blogModel';
import user from "@/models/signupModel";
import cloudinary from '@/utils/cloudinary';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;

export async function POST(request) {
  try {
    const data = await request.formData();
    const title = data.get('title');
    const blog = data.get('blog');
    const category = data.get('category');
    const image1File = data.get('image1');

    const buffer1 = await image1File.arrayBuffer();
    const image1 = Buffer.from(new Uint8Array(buffer1));

    const imageUrl1 = await uploadToCloudinary(image1, image1File.name, image1File.type);

    const token = request.headers.get('Authorization')?.split(' ')[1];
    await connectDB();

    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    const author = await user.findOne({_id: userId});

    const newPost = new BlogPost({
      title,
      blog,
      category,
      image1: imageUrl1,
      user: {
        name: author.name,
        profileImage: author.profileImage ? author.profileImage : null,
        author: author._id,
      },
      date: DateTime.now().toLocaleString({ month: '2-digit', day: '2-digit', year: '2-digit' }),
    });

    await newPost.save();
    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving document:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: error.message }),
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





export async function GET(request) {
  let result = [];
  let success = true;
  const token = request.headers.get('Authorization')?.split(' ')[1];
  let userId;
  try {
    await connectDB();
    const decodedToken = jwt.verify(token, secretKey);
    userId = decodedToken.userId;
    result = await BlogPost.find();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
  return NextResponse.json({result, success, userId});
}




