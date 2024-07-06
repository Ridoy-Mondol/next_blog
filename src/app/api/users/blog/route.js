// import { NextResponse } from 'next/server';
// import connectDB from '@/db/connection';
// import BlogPost from '@/models/blogModel';
// import user from "@/models/signupModel";
// import cloudinary from '@/utils/cloudinary';
// import {redisClient, connectRedis} from "@/utils/redis"
// import { DateTime } from 'luxon';
// import jwt from 'jsonwebtoken';

// const secretKey = process.env.JWT_SECRET_KEY;

// export async function POST(request) {
//   try {
//     const data = await request.formData();
//     const title = data.get('title');
//     const blog = data.get('blog');
//     const category = data.get('category');
//     const image1File = data.get('image1');


//     // if (new Blob([blog]).size > 500000) {
//     //   return new NextResponse(
//     //     JSON.stringify({ success: false, error: 'Blog content is too large.' }),
//     //     { status: 413 }
//     //   );
//     // }

//     const buffer1 = await image1File.arrayBuffer();
//     const image1 = Buffer.from(new Uint8Array(buffer1));

//     // if (image1.length > 2000000) {
//     //   return new NextResponse(
//     //     JSON.stringify({ success: false, error: 'Image is too large.' }),
//     //     { status: 413 }
//     //   );
//     // }


//     const imageUrl1 = await uploadToCloudinary(image1, image1File.name, image1File.type);

//     const token = request.headers.get('Authorization')?.split(' ')[1];
//     await connectDB();

//     const decodedToken = jwt.verify(token, secretKey);
//     const userId = decodedToken.userId;
//     const author = await user.findOne({_id: userId});

//     const newPost = new BlogPost({
//       title,
//       blog,
//       category,
//       image1: imageUrl1,
//       user: {
//         name: author.name,
//         profileImage: author.profileImage ? author.profileImage : null,
//         author: author._id,
//       },
//       date: DateTime.now().toLocaleString({ month: '2-digit', day: '2-digit', year: '2-digit' }),
//     });

//     await newPost.save();

//     await redisClient.del('blog_posts');

//     return new NextResponse(
//       JSON.stringify({ success: true }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error saving document:', error);
//     return new NextResponse(
//       JSON.stringify({ success: false, error: error.message }),
//       { status: 500 }
//     );
//   }
// }

// function uploadToCloudinary(buffer, fileName, mimeType) {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: "blog",
//         filename_override: fileName,
//         format: mimeType.split('/').pop(),
//       },
//       (error, result) => {
//         if (error) {
//           console.error('Error uploading file to Cloudinary:', error);
//           return reject(error);
//         }
//         resolve(result.secure_url);
//       }
//     );

//     stream.end(buffer);
//   });
// }



import connectDB from '@/db/connection';
import BlogPost from '@/models/blogModel';
import user from "@/models/signupModel";
import cloudinary from '@/utils/cloudinary';
import { redisClient, connectRedis } from "@/utils/redis";
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

const secretKey = process.env.JWT_SECRET_KEY;

export async function POST(request) {
  try {
    const data = await request.formData();
    const title = data.get('title');
    const category = data.get('category');
    const image1File = data.get('image1');

    const blogStream = data.get('blog').stream(); // Get the readable stream for blog content

    const token = request.headers.get('Authorization')?.split(' ')[1];
    await connectDB();

    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    const author = await user.findOne({ _id: userId });

    // Upload image to Cloudinary
    const imageUrl1 = await uploadToCloudinary(image1File);

    // Save blog post
    const newPost = new BlogPost({
      title,
      blog: '', // Initialize blog field (will be populated later)
      category,
      image1: imageUrl1,
      user: {
        name: author.name,
        profileImage: author.profileImage ? author.profileImage : null,
        author: author._id,
      },
      date: DateTime.now().toLocaleString({ month: '2-digit', day: '2-digit', year: '2-digit' }),
    });

    // Save blog content to MongoDB
    await saveBlogContent(newPost, blogStream);

    await redisClient.del('blog_posts');

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

async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blog",
        filename_override: file.name,
        format: file.type.split('/').pop(),
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    file.stream.pipe(stream);
  });
}

async function saveBlogContent(blogPost, blogStream) {
  // Readable stream to capture blog content
  const readableStream = Readable.from(blogStream);

  // Buffer to accumulate blog content
  let blogContent = '';

  // Read chunks of data from the readable stream
  for await (const chunk of readableStream) {
    blogContent += chunk.toString();
  }

  // Set the blog content in the blogPost object
  blogPost.blog = blogContent;

  // Save the blog post to MongoDB
  await blogPost.save();
}




export async function GET(request) {
  let result = [];
  let success = true;
  const token = request.headers.get('Authorization')?.split(' ')[1];
  let userId;
  const cacheKey = 'blog_posts';

  try {
    await connectDB();
    await connectRedis();
    const decodedToken = jwt.verify(token, secretKey);
    userId = decodedToken.userId;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      result = JSON.parse(cachedData);
      console.log('Data fetched from Redis cache');
    } else {
      result = await BlogPost.find();
      await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 100);
      console.log('Data fetched from MongoDB and stored in Redis cache');
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    success = false;
  }

  return NextResponse.json({ result, success, userId });
}



