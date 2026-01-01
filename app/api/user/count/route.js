import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user";

export async function GET() {
    try {
        await dbConnect();
        const count = await User.countDocuments();
        return NextResponse.json({ success: true, count });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: "Error getting user count" },
            { status: 500 }
        );
    }
}
