// models/FavoriteCity.js
import mongoose from "mongoose";

const favoriteCitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cityName: { type: String, required: true },
  customName: { type: String },  
  isFavorite: { type: Boolean, default: false }, // 🔥 add this
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

favoriteCitySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const FavoriteCity = mongoose.model("FavoriteCity", favoriteCitySchema);
export default FavoriteCity;
