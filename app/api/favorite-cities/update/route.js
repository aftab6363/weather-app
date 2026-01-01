import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FavoriteCity from "@/lib/models/FavoriteCity";

export async function PUT(req) {
    try {
        await dbConnect();
        const { cityId, cityName, customName, isFavorite } = await req.json();

        if (!cityId) {
            return NextResponse.json({ message: "cityId is required" }, { status: 400 });
        }

        const city = await FavoriteCity.findById(cityId);
        if (!city) {
            return NextResponse.json({ success: false, message: "City not found" }, { status: 404 });
        }

        if (cityName) city.cityName = cityName;
        if (customName) city.customName = customName;
        if (typeof isFavorite === "boolean") city.isFavorite = isFavorite;

        city.updatedAt = new Date();
        await city.save();

        return NextResponse.json({
            success: true,
            message: "City updated successfully",
            city,
        });
    } catch (error) {
        console.error("Update City Error:", error);
        return NextResponse.json({ success: false, message: "Failed to update city" }, { status: 500 });
    }
}
