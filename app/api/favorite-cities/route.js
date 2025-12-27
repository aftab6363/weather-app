import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FavoriteCity from "@/lib/models/FavoriteCity";

export async function POST(req) {
    try {
        await dbConnect();
        const { userId, cityName, customName, isFavorite } = await req.json();

        if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });
        if (!cityName) return NextResponse.json({ error: "City name is required" }, { status: 400 });

        // Check if city already exists for this user
        const existingCity = await FavoriteCity.findOne({ userId, cityName });
        if (existingCity) {
            return NextResponse.json(
                { success: false, error: "City already saved" },
                { status: 400 }
            );
        }

        const newCity = new FavoriteCity({
            userId,
            cityName,
            customName,
            isFavorite: !!isFavorite,
        });
        await newCity.save();

        return NextResponse.json(
            {
                success: true,
                message: "City saved successfully",
                city: newCity,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Save City Error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to save city" },
            { status: 500 }
        );
    }
}
