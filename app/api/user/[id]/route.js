import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user";

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params; // Next.js 15+ params are async

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Account deleted successfully",
        });

    } catch (err) {
        console.error("Delete Account Error:", err);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}
