import signupUser from "@/models/signupModel";
import connectDB from '@/db/connection';
import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const secretKey = process.env.JWT_SECRET_KEY;
const code = Math.floor(100000 + Math.random() * 900000);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendVerificationEmail(email) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verification Code',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Email</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  overflow-x: hidden;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding: 20px 0;
                  background-color: #007bff;
                  color: #ffffff;
              }
              .header h1 {
                  margin: 0;
              }
              .content {
                  padding: 20px;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .verification-code-container {
                  text-align: center;
                  margin: 20px 0;
              }
              .verification-code {
                  display: inline-block;
                  padding: 10px 20px;
                  font-size: 24px;
                  font-weight: bold;
                  color: #007bff;
                  border: 2px solid #007bff;
                  border-radius: 5px;
                  background-color: #f0f8ff;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #999999;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Welcome to Next-Blog</h1>
              </div>
              <div class="content">
                  <p>Hi,</p>
                  <p>Thank you for signing up with Next-Blog. Please use the verification code below to complete your registration:</p>
                  <div class="verification-code-container">
                      <span class="verification-code">${code}</span>
                  </div>
                  <p>Please note that this verification code is valid for 10 minutes and should not be shared with anyone.</p>
                  <p>If you did not request this code, please ignore this email.</p>
                  <p>Best regards,<br>Ridoy Monol, Owner of Next-Blog</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Next-Blog. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions);
}

// async function generateVerificationCode() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

async function uploadToCloudinary(buffer, fileName, mimeType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blogprofile",
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

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      reject(err);
    });

    stream.end(buffer);
  });
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');
    const imagefile = data.get('image');

    let imageUrl = null;

    if (imagefile) {
      const buffer = await imagefile.arrayBuffer();
      const image = Buffer.from(new Uint8Array(buffer));
      imageUrl = await uploadToCloudinary(image, imagefile.name, imagefile.type);
    }

    await connectDB();
    const userExist = await signupUser.findOne({ email });

    if (userExist) {
      return new NextResponse(JSON.stringify({ 
        message: "User already exists", 
        success: false 
      }), { status: 409 });
    }

    // const verificationCode = await generateVerificationCode();

    const tokenPayload = { name, email, password, imageUrl, code };
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '10m' });

    sendVerificationEmail(email);

    const response = new NextResponse(JSON.stringify({
      message: "Signup successful, please check your email for the token containing the verification code",
      status: 200,
      success: true,
    }));

    response.cookies.set('token', token, { maxAge: 600 });
    return response;

  } catch (error) {
    console.error('Error during signup:', error);
    return new NextResponse(JSON.stringify({ message: "Signup failed", success: false }), { status: 500 });
  }
}
