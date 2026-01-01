import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user";

export async function POST(req) {
    try {
        await dbConnect();
        const { fullName, email, password } = await req.json();

        if (!fullName || !email || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 409 }
            );
        }

        const newUser = new User({
            name: fullName,
            email,
            password,
        });

        await newUser.save();

        return NextResponse.json(
            { success: true, message: "Registration successful" },
            { status: 201 }
        );
    } catch (err) {
        console.error("Register Error:", err);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}
