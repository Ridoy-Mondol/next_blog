import { NextResponse } from 'next/server';
import connectDB from '@/db/connection';
import BlogPost from '@/models/blogModel';
import user from "@/models/signupModel";
import cloudinary from '@/utils/cloudinary';
import fs from 'fs/promises';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;


export async function POST(request) {
  const data = await request.formData();
  const title = data.get('title');
  const blog = data.get('blog');
  const category = data.get('category');
  const image1File = data.get('image1');

  const buffer1 = await image1File.arrayBuffer();

  const image1 = Buffer.from(new Uint8Array(buffer1));


  const imagemimetype1 = image1File.type.split('/').at(-1);

  const fileName1 = image1File.name;

  const publicpath1 = `public/uploads/${fileName1}`;
  await fs.writeFile(publicpath1, image1);

  const cloudinaryResponse1 = await uploadFile(publicpath1, fileName1, imagemimetype1);
  const imageUrl1 = cloudinaryResponse1.secure_url;

  const token = request.headers.get('Authorization')?.split(' ')[1];
  try {
    await connectDB();
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    const author = await user.findOne({_id: userId});
    const newPost = new BlogPost({
      title: title,
      blog: blog,
      category: category,
      image1: imageUrl1,
      user: {
        name: author.name,
        profileImage: author.
        profileImage ? author.profileImage : null,
        author: author._id,
      },
      date : DateTime.now().toLocaleString({ month: '2-digit', day: '2-digit', year: '2-digit' }),
    }); 
    await newPost.save();
    return new NextResponse({
      status: 200,
      body: JSON.stringify({ success: true })
    });
  } catch (error) {
    console.error('Error saving document:', error);
    return new NextResponse({
      status: 500,
      body: JSON.stringify({ success: false, error: error.message })
    });
  } finally {
    await fs.unlink(publicpath1);
  }
}

async function uploadFile(filepath, fileName, imagemimetype) {
  try {
    const response = await cloudinary.uploader.upload(filepath, {
      folder: "blog",
      filename_override: fileName,
      format: imagemimetype,
    });
    return response;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
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




