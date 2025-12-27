import FavoriteCity from "../models/FavoriteCity.js";

export const saveCity = async (req, res) => {
  const { cityName, customName } = req.body;
  const userId = req.user.id;

  if (!cityName) return res.status(400).json({ error: "City name is required" });

  try {
    const newCity = new FavoriteCity({ userId, cityName, customName });
    await newCity.save();
    res.status(201).json({ message: "City saved successfully", city: newCity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save city" });
  }
};
