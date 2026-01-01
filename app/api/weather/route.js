import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city")?.trim();

        if (!city) {
            return NextResponse.json({ message: "City is required" }, { status: 400 });
        }

        const apiKey = process.env.OPENWEATHER_API_KEY || "3e40040b5295e90a19ae7ea070b7a7df";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
        )}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        const normalized = {
            city: `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`,
            temp: data.main?.temp,
            feels_like: data.main?.feels_like,
            humidity: data.main?.humidity,
            wind: data.wind?.speed,
            description:
                data.weather && data.weather[0] ? data.weather[0].description : "",
            icon:
                data.weather && data.weather[0]
                    ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                    : null,
            raw: data,
        };

        return NextResponse.json(normalized);
    } catch (error) {
        console.error("Weather fetch error:", error.message);

        if (error.response) {
            const status = error.response.status;
            const msg =
                status === 404
                    ? `City not found: ${city}`
                    : error.response.data?.message || "Failed to fetch weather data";

            return NextResponse.json({ message: msg }, { status });
        }

        return NextResponse.json({ message: "Failed to fetch weather data" }, { status: 500 });
    }
}
