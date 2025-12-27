// controllers/favoriteCityController.js
const FavoriteCity = require('../models/FavoriteCity');

// Function to save a city for logged-in user
const saveCity = async (req, res) => {
  const { cityName, customName } = req.body;
  const userId = req.user.id; // auth middleware should set req.user

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const newCity = new FavoriteCity({ userId, cityName, customName });
    await newCity.save();
    res.status(201).json({ message: 'City saved successfully', city: newCity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save city' });
  }
};

module.exports = { saveCity };
