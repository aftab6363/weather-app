import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user";

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid Email" },
                { status: 200 } // Original backend returned 200 for failures with success: false
            );
        }

        // Direct string comparison (legacy behavior)
        if (user.password !== password) {
            return NextResponse.json(
                { success: false, message: "Invalid Password" },
                { status: 200 }
            );
        }

        // Update Last Login
        user.lastLogin = new Date();
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                lastLogin: user.lastLogin.toLocaleString(),
            },
        });
    } catch (err) {
        console.error("Login Error:", err);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 } // Original backend returned 200 mostly, but 500 here is safer for server errors
        );
    }
}
