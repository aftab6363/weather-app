import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user";

export async function PUT(req) {
    try {
        await dbConnect();
        const { userId, oldPassword, newPassword } = await req.json();

        if (!userId || !oldPassword || !newPassword) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Direct string comparison
        if (user.password !== oldPassword) {
            return NextResponse.json(
                { success: false, message: "Incorrect old password" },
                { status: 400 }
            );
        }

        user.password = newPassword;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (err) {
        console.error("Change Password Error:", err);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}
