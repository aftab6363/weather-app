import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req, { params }) {
    try {
        const { city } = await params;
        const trimmedCity = city?.trim();

        if (!trimmedCity) {
            return NextResponse.json({ message: "City is required" }, { status: 400 });
        }

        const apiKey = process.env.OPENWEATHER_API_KEY || "3e40040b5295e90a19ae7ea070b7a7df";
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            trimmedCity
        )}&appid=${apiKey}&units=metric`;

        const forecastResp = await axios.get(forecastUrl);
        const list = forecastResp.data.list;

        const dailyMap = {};
        list.forEach((item) => {
            const dateKey = new Date(item.dt * 1000).toISOString().split("T")[0];
            if (!dailyMap[dateKey]) {
                dailyMap[dateKey] = {
                    dt: item.dt,
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
                dailyMap[dateKey].wind = item.wind?.speed || dailyMap[dateKey].wind;
            }
        });

        const dailyForecast = Object.keys(dailyMap)
            .map((dateKey) => {
                const v = dailyMap[dateKey];
                const avgHumidity = Math.round(v.humiditySum / v.count);
                const feelsLikeDay = Math.round((v.temp_min + v.temp_max) / 2);

                return {
                    dt: v.dt,
                    temp: {
                        min: Math.round(v.temp_min),
                        max: Math.round(v.temp_max),
                    },
                    feels_like: {
                        day: feelsLikeDay,
                    },
                    humidity: avgHumidity,
                    wind_speed: v.wind,
                    weather: v.weather,
                    sunrise: null,
                    sunset: null,
                };
            })
            .slice(0, 5);

        return NextResponse.json(dailyForecast);
    } catch (error) {
        console.error("Forecast fetch error:", error.message);

        if (error.response) {
            const status = error.response.status;
            const msg =
                status === 404
                    ? `City not found: ${req.params.city}`
                    : error.response.data?.message || "Failed to fetch forecast";

            return NextResponse.json({ message: msg }, { status });
        }

        return NextResponse.json({ message: "Failed to fetch forecast" }, { status: 500 });
    }
}
