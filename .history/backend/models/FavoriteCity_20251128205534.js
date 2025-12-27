// models/FavoriteCity.js
import mongoose from "mongoose";

const favoriteCitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cityName: { type: String, required: true },
  customName: { type: String },  // optional nickname
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // 🔥 added for future updates
});

// 🔥 Auto-update `updatedAt` before saving changes
favoriteCitySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const FavoriteCity = mongoose.model("FavoriteCity", favoriteCitySchema);

export default FavoriteCity;
