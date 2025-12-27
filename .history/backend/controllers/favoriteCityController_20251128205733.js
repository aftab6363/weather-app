// controllers/favoriteCityController.js
import FavoriteCity from "../models/FavoriteCity.js";

// ==================
// SAVE CITY
// ==================
export const saveCity = async (req, res) => {
  const { userId, cityName, customName } = req.body;

  if (!userId) return res.status(400).json({ error: "userId is required" });
  if (!cityName) return res.status(400).json({ error: "City name is required" });

  try {
    const newCity = new FavoriteCity({ userId, cityName, customName });
    await newCity.save();

    res.status(201).json({
      success: true,
      message: "City saved successfully",
      city: newCity,
    });
  } catch (err) {
    console.error("Save City Error:", err);
    res.status(500).json({ success: false, error: "Failed to save city" });
  }
};

// ==================
// GET ALL CITIES FOR A USER
// ==================
export const getCities = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const cities = await FavoriteCity.find({ userId });
    res.status(200).json({ success: true, cities });
  } catch (err) {
    console.error("Get Cities Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch cities" });
  }
};

// ==================
// DELETE A CITY BY ID
// ==================
export const deleteCity = async (req, res) => {
  const { cityId } = req.body;

  if (!cityId) return res.status(400).json({ error: "cityId is required" });

  try {
    const deletedCity = await FavoriteCity.findByIdAndDelete(cityId);

    if (!deletedCity) {
      return res.status(404).json({ success: false, error: "City not found" });
    }

    res.status(200).json({
      success: true,
      message: "City deleted successfully",
      city: deletedCity,
    });
  } catch (err) {
    console.error("Delete City Error:", err);
    res.status(500).json({ success: false, error: "Failed to delete city" });
  }
};

// ==================
// UPDATE CITY
// ==================
export const updateCity = async (req, res) => {
  const { cityId, cityName, customName } = req.body;

  if (!cityId) return res.status(400).json({ error: "cityId is required" });

  try {
    const city = await FavoriteCity.findById(cityId);

    if (!city) return res.status(404).json({ success: false, error: "City not found" });

    if (cityName) city.cityName = cityName;
    if (customName) city.customName = customName;

    city.updatedAt = new Date();

    await city.save();

    res.status(200).json({
      success: true,
      message: "City updated successfully",
      city,
    });
  } catch (err) {
    console.error("Update City Error:", err);
    res.status(500).json({ success: false, error: "Failed to update city" });
  }
};
