// import signupUser from "@/models/signupModel";
// import connectDB from '@/db/connection';
// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// const code = Math.floor(100000 + Math.random() * 900000);

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     }
// })

// async function sendVerificationEmail(email,verificationCode) {
//    const mailOptions = {
//      from: process.env.EMAIL_USER,
//      to: email,
//      subject: 'Verification Code for Reset Password',
//      html: `
//         <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Password Reset Email</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 0;
//             background-color: #f4f4f4;
//         }
//         .container {
//             width: 100%;
//             max-width: 600px;
//             margin: 0 auto;
//             background-color: #ffffff;
//             padding: 20px;
//             box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//         }
//         .header {
//             text-align: center;
//             padding: 20px 0;
//             background-color: #007bff;
//             color: #ffffff;
//         }
//         .header h1 {
//             margin: 0;
//         }
//         .content {
//             padding: 20px;
//         }
//         .content p {
//             font-size: 16px;
//             color: #333333;
//             line-height: 1.5;
//         }
//         .verification-code-container {
//             text-align: center;
//             margin: 20px 0;
//         }
//         .verification-code {
//             display: inline-block;
//             padding: 10px 20px;
//             font-size: 24px;
//             font-weight: bold;
//             color: #007bff;
//             border: 2px solid #007bff;
//             border-radius: 5px;
//             background-color: #f0f8ff;
//         }
//         .footer {
//             text-align: center;
//             padding: 20px;
//             font-size: 14px;
//             color: #999999;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="header">
//             <h1>Password Reset for Next-Blog</h1>
//         </div>
//         <div class="content">
//             <p>Hi,</p>
//             <p>You've requested to reset your password for Next-Blog. Please use the verification code below to proceed:</p>
//             <div class="verification-code-container">
//                 <span class="verification-code">${verificationCode}</span>
//             </div>
//             <p>Please note that this verification code should not be shared with anyone.</p>
//             <p>If you didn't request this password reset, you can safely ignore this email.</p>
//             <p>Best regards,<br>Ridoy Monol, Owner of Next-Blog</p>
//         </div>
//         <div class="footer">
//             <p>&copy; 2024 Next-Blog. All rights reserved.</p>
//         </div>
//     </div>
// </body>
// </html>
//      `
//    }

//    await transporter.sendMail(mailOptions);
// }

// async function generateVerificationCode() {
//     return code;
// }


// export async function POST(request) {
//     try {
//     const { email } = await request.json();
//     if (!email) {
//         throw new Error('Email not provided');
//     }
//     await connectDB();
//     const userExist = await signupUser.findOne({ email });
//     if (!userExist) {
//         return new NextResponse(JSON.stringify({
//             message: "User not exist",
//             success: false,
//         }), {
//             status: 404,
//         })
//     }
    
//     const verificationCode = await generateVerificationCode();
//     await sendVerificationEmail(email, verificationCode);

//     return new NextResponse(JSON.stringify({
//         message: "Reset code sent successfully",
//         success: true,
//         verificationCode,
//     }), {
//         status: 200,
//     })

//   } catch (error) {
//     console.error('Error:', error);
//     return new NextResponse(JSON.stringify({ message: " Error finding user", success: false }), { status: 500 });
//   }
// }








import signupUser from "@/models/signupModel";
import connectDB from '@/db/connection';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const code = Math.floor(100000 + Math.random() * 900000);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

async function sendVerificationEmail(email, verificationCode) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification Code for Reset Password',
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
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
            <h1>Password Reset for Next-Blog</h1>
        </div>
        <div class="content">
            <p>Hi,</p>
            <p>You've requested to reset your password for Next-Blog. Please use the verification code below to proceed:</p>
            <div class="verification-code-container">
                <span class="verification-code">${verificationCode}</span>
            </div>
            <p>Please note that this verification code should not be shared with anyone.</p>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            <p>Best regards,<br>Ridoy Monol, Owner of Next-Blog</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Next-Blog. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
     `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

async function generateVerificationCode() {
    return code;
}

export async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email) {
            throw new Error('Email not provided');
        }
        await connectDB();
        const userExist = await signupUser.findOne({ email });
        if (!userExist) {
            return new NextResponse(JSON.stringify({
                message: "User not exist",
                success: false,
            }), {
                status: 404,
            });
        }

        const verificationCode = await generateVerificationCode();

        // Send email asynchronously and handle errors
        sendVerificationEmail(email, verificationCode);

        return new NextResponse(JSON.stringify({
            message: "Reset code sent successfully",
            success: true,
            verificationCode,
        }), {
            status: 200,
        });

    } catch (error) {
        console.error('Error:', error);
        return new NextResponse(JSON.stringify({ message: "Error finding user", success: false }), { status: 500 });
    }
}
