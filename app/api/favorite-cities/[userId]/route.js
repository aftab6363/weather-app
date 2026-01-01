import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FavoriteCity from "@/lib/models/FavoriteCity";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { userId } = await params;

        const cities = await FavoriteCity.find({ userId });
        return NextResponse.json(cities);
    } catch (error) {
        console.error("Get Cities Error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
