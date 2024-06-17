import { NextResponse } from 'next/server';
import connectDB from '@/db/connection';
import BlogPost from '@/models/blogModel';
import user from "@/models/signupModel";
import cloudinary from '@/utils/cloudinary';
import {redisClient, connectRedis} from "@/utils/redis"
import jwt from 'jsonwebtoken';


const secretKey = process.env.JWT_SECRET_KEY;


export async function GET(request, content) {
  let result = {};
  let success = true;
  try {
    await connectDB();
    await connectRedis();
    const id = content.params.id;
    const cacheKey = `single_blog_posts${id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      result = JSON.parse(cachedData);
      console.log('Single data fetched from Redis cache');
    } else {
      result = await BlogPost.findOne({ _id: id });
      if (!result) {
        success = false;
      }
      await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600);
      console.log('Data fetched from MongoDB and stored in Redis cache');
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    success = false;
  }
  return NextResponse.json({ result, success });
}

export async function DELETE(request, content) {
  const id = content.params.id;
  const token = request.headers.get('Authorization')?.split(' ')[1];
  try {
     await connectDB();
     const decodedToken = jwt.verify(token, secretKey);
     const userId = decodedToken.userId;

     const blogPost = await BlogPost.findOne({ _id: id, 'user.author': userId });
    if (blogPost && blogPost.image1) {
      await cloudinary.uploader.destroy(blogPost.image1);
    }

     await BlogPost.deleteOne({ _id: id, 'user.author': userId });
     await redisClient.del('blog_posts');
     await redisClient.del(`single_blog_posts${id}`);
     return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.log('Error deleting post:', error);
    success = false;
    return NextResponse.json({ success: false });
  }
}


export async function PATCH(request, content) {
  const id = content.params.id; 
  const ids = id.split(',').map(id => id);

  try {
    const data = await request.formData();
    const updates = {};
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    
    if (!userId) {
      return;
    }

    const author = await user.findOne({_id: userId});

    if (data.has('title')) {
      updates.title = data.get('title');
    }
    if (data.has('blog')) {
      updates.blog = data.get('blog');
    }
    if (data.has('category')) {
      updates.category = data.get('category');
    }
    if (data.has('image1')) {
      const blogPosts = await BlogPost.find({ _id: { $in: ids }, 'user.author': userId });
      if (blogPosts.image1) {
        const publicId = blogPosts.image1.split('/').pop().split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      const image1File = data.get('image1');
      const buffer1 = await image1File.arrayBuffer();
      const image1 = Buffer.from(new Uint8Array(buffer1));
      const imageUrl1 = await uploadToCloudinary(image1, image1File.name, image1File.type);
      updates.image1 = imageUrl1;
    }

    if (author) {
      updates.user = {
        name: author.name,
        profileImage: author.profileImage ? author.profileImage : null,
        author: author._id
      };
    }

      await connectDB();
      const updatedPost = await BlogPost.updateMany({ _id: { $in: ids }, 'user.author': userId }, { $set: updates });
      await redisClient.del('blog_posts');
      await redisClient.del(`single_blog_posts${id}`);

      if (!updatedPost) {
        return new NextResponse(JSON.stringify({
          success: false,
          message: "Something went wrong. Please try again",
        }), {
          status: 500,
        })
      }
      return new NextResponse(JSON.stringify({
        success: true,
        message: 'Updated successfully',
      }), {
        status: 200,
      })
  } catch (error) {
    console.error('Error updating post:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: "Something went wrong. Please try again",
    }), {
      status: 500,
    })   
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

