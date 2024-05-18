import { NextResponse } from 'next/server';
import connectDB from '@/db/connection';
import BlogPost from '@/models/blogModel';
import user from "@/models/signupModel";
import cloudinary from '@/utils/cloudinary';
import fs from 'fs/promises';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';


const secretKey = process.env.JWT_SECRET_KEY;

export async function GET(request, content) {
  let result = {};
  let success = true;
  try {
    await connectDB();
    const id = content.params.id;
    result = await BlogPost.findOne({ _id: id });
    if (!result) {
      success = false;
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    success = false;
  }
  return NextResponse.json({ result, success });
}


export async function DELETE(request, content) {
  // let success = false;
  const id = content.params.id;
  const token = request.headers.get('Authorization')?.split(' ')[1];
  try {
     await connectDB();
     const decodedToken = jwt.verify(token, secretKey);
     const userId = decodedToken.userId;
     await BlogPost.deleteOne({ _id: id, 'user.author': userId });
     return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.log('Error deleting post:', error);
    success = false;
    return NextResponse.json({ success: false });
  }
}





export async function PATCH(request, content) {
  let success = false;
  const id = content.params.id; 
  const ids = id.split(',').map(id => id);


  try {
    const data = await request.formData();
    const updates = {};
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    const author = await user.findOne({_id: userId});
    if (data.has('title')) {
      updates.title = data.get('title');
      success = true;
    }
    if (data.has('blog')) {
      updates.blog = data.get('blog');
      success = true; 
    }
    if (data.has('category')) {
      updates.category = data.get('category');
      success = true;
    }
    if (data.has('image1')) {
      const image1File = data.get('image1');
      const buffer1 = await image1File.arrayBuffer();
      const image1 = Buffer.from(new Uint8Array(buffer1));
      const imagemimetype1 = image1File.type.split('/').at(-1);
      const fileName1 = image1File.name;
      const publicpath1 = `public/uploads/${fileName1}`;
      await fs.writeFile(publicpath1, image1);
      const cloudinaryResponse1 = await uploadFile(publicpath1, fileName1, imagemimetype1);
      const imageUrl1 = cloudinaryResponse1.secure_url; 
      updates.image1 = imageUrl1;
      success = true; 
      await fs.unlink(publicpath1);
    }

    if (author) {
      updates.user = {
        name: author.name,
        profileImage: author.profileImage ? author.profileImage : null,
        author: author._id
      };
      success = true;
    }

    updates.date = DateTime.now().toLocaleString({ month: '2-digit', day: '2-digit', year: '2-digit' });

    if (success) {
      await connectDB();
      const decodedToken = jwt.verify(token, secretKey);
      const userId = decodedToken.userId;
      await BlogPost.updateMany({ _id: { $in: ids }, 'user.author': userId }, { $set: updates });
      return NextResponse.json({ success });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ success: false });
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

