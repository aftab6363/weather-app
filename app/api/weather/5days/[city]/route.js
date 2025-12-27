import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req, { params }) {
    try {
        const { city } = await params;

        if (!city) {
            return NextResponse.json({ message: "City is required" }, { status: 400 });
        }

        const apiKey = process.env.OPENWEATHER_API_KEY || "3e40040b5295e90a19ae7ea070b7a7df";

        // Free 5-day / 3-hour forecast API
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            city
        )}&appid=${apiKey}&units=metric`;

        const forecastResp = await axios.get(forecastUrl);
        const list = forecastResp.data.list; // 3-hourly entries

        // Convert 3-hour data into daily summary map keyed by YYYY-MM-DD
        const dailyMap = {};
        list.forEach((item) => {
            const dateKey = new Date(item.dt * 1000).toISOString().split("T")[0]; // YYYY-MM-DD
            if (!dailyMap[dateKey]) {
                dailyMap[dateKey] = {
                    dt: item.dt, // keep seconds (first occurrence)
                    temp_min: item.main.temp_min,
                    temp_max: item.main.temp_max,
                    humiditySum: item.main.humidity,
                    count: 1,
                    wind: item.wind?.speed || 0,
                    weather: item.weather && item.weather[0] ? item.weather[0] : {},
                };
            } else {
                dailyMap[dateKey].temp_min = Math.min(dailyMap[dateKey].temp_min, item.main.temp_min);
                dailyMap[dateKey].temp_max = Math.max(dailyMap[dateKey].temp_max, item.main.temp_max);
                dailyMap[dateKey].humiditySum += item.main.humidity;
                dailyMap[dateKey].count += 1;
                // keep wind as last seen (or you could average)
                dailyMap[dateKey].wind = item.wind?.speed || dailyMap[dateKey].wind;
            }
        });

        // Convert dailyMap to array and shape each day to match "daily" structure used in frontend
        const dailyForecast = Object.keys(dailyMap)
            .map((dateKey) => {
                const v = dailyMap[dateKey];
                const avgHumidity = Math.round(v.humiditySum / v.count);
                const feelsLikeDay = Math.round((v.temp_min + v.temp_max) / 2); // simple estimate

                return {
                    // keep dt in seconds — frontend will multiply by 1000 when creating Date
                    dt: v.dt,
                    // match OpenWeather daily.temp structure
                    temp: {
                        min: Math.round(v.temp_min),
                        max: Math.round(v.temp_max),
                    },
                    // simple feels_like structure (day)
                    feels_like: {
                        day: feelsLikeDay,
                    },
                    humidity: avgHumidity,
                    // name matches frontend expectation: wind_speed
                    wind_speed: v.wind,
                    // weather object (first/representative)
                    weather: v.weather,
                    // forecast API does not provide sunrise/sunset per day — set null explicitly
                    sunrise: null,
                    sunset: null,
                };
            })
            .slice(0, 5); // return first 5 days (available from 5-day forecast)

        return NextResponse.json(dailyForecast);
    } catch (error) {
        console.error("Forecast fetch error:", error.message);

        if (error.response) {
            const status = error.response.status;
            const msg =
                status === 404
                    ? `City not found: ${city}`
                    : error.response.data?.message || "Failed to fetch forecast";

            return NextResponse.json({ message: msg }, { status });
        }

        return NextResponse.json(
            { message: "Failed to fetch forecast" },
            { status: 500 }
        );
    }
}
