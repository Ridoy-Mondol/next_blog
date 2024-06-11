import signupUser from "@/models/signupModel";
import connectDB from '@/db/connection';
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;

export async function POST(request) {
    const { email, password } = await request.json();
    try {
        await connectDB();
        const userInfo = await signupUser.findOne({ email: email });

        if (userInfo.password === null) {
            return new NextResponse(JSON.stringify({
                message: "Can't login. This account is created with google.",
                success: false,
            }));
        }

        if (userInfo) {
            const isPasswordMatch = await bcrypt.compare(password, userInfo.password);

            if (isPasswordMatch) {
                const tokenPayload = {
                    userId: userInfo._id,
                  };
                const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '10d'});
                const response = NextResponse.json({
                    message: "Login successful",
                    status: 200,
                    token: token,
                    body: JSON.stringify({ success: true })
                });
                return response;
            } else {
                return NextResponse.json({
                    message: "Invalid Credentials",
                    status: 401,
                    body: JSON.stringify({ success: false })
                });
            }
        } else {
            return NextResponse.json({
                message: "Invalid Credentials",
                status: 404,
                body: JSON.stringify({ success: false })
            });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({
            message: "Error during login",
            status: 500,
            body: JSON.stringify({ success: false })
        });
    }
}
