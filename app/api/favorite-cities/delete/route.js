import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FavoriteCity from "@/lib/models/FavoriteCity";

export async function DELETE(req) {
    try {
        await dbConnect();
        const { cityId } = await req.json();

        if (!cityId) return NextResponse.json({ error: "cityId is required" }, { status: 400 });

        const deletedCity = await FavoriteCity.findByIdAndDelete(cityId);

        if (!deletedCity) {
            return NextResponse.json({ success: false, error: "City not found" }, { status: 404 });
        }

        return NextResponse.json(
            {
                success: true,
                message: "City deleted successfully",
                city: deletedCity,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Delete City Error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to delete city" },
            { status: 500 }
        );
    }
}
