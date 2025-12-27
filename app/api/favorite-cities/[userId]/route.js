import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FavoriteCity from "@/lib/models/FavoriteCity";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { userId } = await params;

        if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

        const cities = await FavoriteCity.find({ userId }).sort({ cityName: 1 });
        return NextResponse.json({ success: true, cities });
    } catch (err) {
        console.error("Get Cities Error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to fetch cities" },
            { status: 500 }
        );
    }
}
