import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FavoriteCity from "@/lib/models/FavoriteCity";

export async function PATCH(req) {
    try {
        await dbConnect();
        const { cityId, isFavorite } = await req.json();

        if (!cityId) {
            return NextResponse.json({ message: "cityId is required" }, { status: 400 });
        }

        const city = await FavoriteCity.findById(cityId);
        if (!city) {
            return NextResponse.json({ message: "City not found" }, { status: 404 });
        }

        city.isFavorite = !!isFavorite;
        city.updatedAt = new Date();
        await city.save();

        return NextResponse.json({ success: true, city });
    } catch (error) {
        console.error("Toggle Favorite Error:", error);
        return NextResponse.json({ success: false, message: "Failed to update favorite status" }, { status: 500 });
    }
}
