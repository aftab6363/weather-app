import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user";

export async function GET() {
    try {
        await dbConnect();
        const count = await User.countDocuments();
        return NextResponse.json({ success: true, count });
    } catch (err) {
        console.error("User Count Error:", err);
        return NextResponse.json(
            { success: false, message: "Error getting user count" },
            { status: 500 } // Or 200 per legacy? I'll use json response which implies 200 by default unless specified
        );
    }
}
