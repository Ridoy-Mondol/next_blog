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


  export async function PATCH(request, content) {
    let success = false; 
  
    try {
      const data = await request.formData();
      const updates = {};
      const token = request.headers.get('Authorization')?.split(' ')[1];
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
        const imagemimetype1 = image1File.type.split('/').at(-1);
        const fileName1 = image1File.name;
        const publicpath1 = `public/uploads/${fileName1}`;
        await fs.writeFile(publicpath1, image1);
        const cloudinaryResponse1 = await uploadFile(publicpath1, fileName1, imagemimetype1);
        const imageUrl1 = cloudinaryResponse1.secure_url; 
        updates.profileImage = imageUrl1;
        success = true; 
        await fs.unlink(publicpath1);
      }
  
      if (success) {
        await connectDB();
        const decodedToken = jwt.verify(token, secretKey);
        const userId = decodedToken.userId;
        await signupUser.updateOne({ _id: userId}, { $set: updates });
        return NextResponse.json({ success });
      }
    } catch (error) {
      console.error('Error updating user:', error);
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