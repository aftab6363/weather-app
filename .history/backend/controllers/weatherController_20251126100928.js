import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const city = req.query.city;   // get city from URL

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    res.json(response.data);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
};
