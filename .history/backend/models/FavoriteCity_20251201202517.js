// models/FavoriteCity.js
import mongoose from "mongoose";

const favoriteCitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cityName: { type: String, required: true },
  customName: { type: String },  
  isFavorite: { type: Boolean, default: false }, // indicates if city is marked favorite
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure a user cannot have duplicate city entries
favoriteCitySchema.index({ userId: 1, cityName: 1 }, { unique: true });

// Update updatedAt before save
favoriteCitySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const FavoriteCity = mongoose.model("FavoriteCity", favoriteCitySchema);
export default FavoriteCity;
