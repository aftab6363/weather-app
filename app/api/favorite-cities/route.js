import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FavoriteCity from "@/lib/models/FavoriteCity";

export async function POST(req) {
    try {
        await dbConnect();
        const { userId, cityName, customName } = await req.json();

        if (!userId || !cityName) {
            return NextResponse.json({ message: "User ID and City Name are required" }, { status: 400 });
        }

        const existingCity = await FavoriteCity.findOne({ userId, cityName });
        if (existingCity) {
            return NextResponse.json({ message: "City already in favorites" }, { status: 400 });
        }

        const newCity = new FavoriteCity({
            userId,
            cityName,
            customName: customName || cityName,
        });

        await newCity.save();
        return NextResponse.json({ message: "City saved to favorites!", city: newCity }, { status: 201 });
    } catch (error) {
        console.error("Save City Error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
