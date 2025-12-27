import FavoriteCity from "../models/FavoriteCity.js";

export const saveCity = async (req, res) => {
  const { userId, cityName, customName } = req.body;

  // Validate required fields
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  if (!cityName) {
    return res.status(400).json({ error: "City name is required" });
  }

  try {
    const newCity = new FavoriteCity({
      userId,
      cityName,
      customName,
    });

    await newCity.save();

    res.status(201).json({
      message: "City saved successfully",
      city: newCity,
    });

  } catch (err) {
    console.error("Save City Error:", err);
    res.status(500).json({ error: "Failed to save city" });
  }
};
