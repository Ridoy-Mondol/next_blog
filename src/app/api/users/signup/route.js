import signupUser from "@/models/signupModel";
import connectDB from '@/db/connection';
import cloudinary from '@/utils/cloudinary';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;


export async function POST (request) {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');
    const imagefile = data.get("image");

    let imageUrl = null;
    let publicpath = null;
    if (imagefile) {
      const buffer = await imagefile.arrayBuffer();
      const image = Buffer.from(new Uint8Array(buffer));
      const imagemimetype = imagefile.type.split('/').at(-1);
      const fileName = imagefile.name;
      publicpath = `public/uploads/${fileName}`;
      await fs.writeFile(publicpath, image);
      const cloudinaryResponse = await uploadFile(publicpath, fileName, imagemimetype);
      imageUrl = cloudinaryResponse.secure_url;
  }
    try {
        await connectDB();
        const userExist = await signupUser.findOne ({ email : email});
        if (userExist) {
            return NextResponse.json({
              message: "User already exist",
              status: 409,
              body: JSON.stringify({ success: false })
          });
        }
        else {
          const saltRound = 10;
          const hashPassword = await bcrypt.hash(password, saltRound);

          const newuser = new signupUser ({
            name,
            email,
            password: hashPassword,
            profileImage: imageUrl,
        })
        await newuser.save();
        const tokenPayload = {
          userId: newuser._id,
        };
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '10d'});

        return NextResponse.json({
            message: "Signup successful",
            status: 200,
            token: token,
            body: JSON.stringify({ success: true })
        });
      }
    } catch (error) {
        console.error('Error saving document:', error);
        return NextResponse.json({
          message: "Signup failed",
          status: 500,
          body: JSON.stringify({ success: false })
      });
    } finally {
      if (publicpath) {
        await fs.unlink(publicpath);
      }
    }
}

async function uploadFile(filepath, fileName, imagemimetype) {
    try {
      const response = await cloudinary.uploader.upload(filepath, {
        folder: "blogprofile",
        filename_override: fileName,
        format: imagemimetype,
      });
      return response;
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      throw error;
    }
  }
  




