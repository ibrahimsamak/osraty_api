const mongoose = require("mongoose");

const FavoriteSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  news_id: { type: mongoose.Schema.Types.ObjectId, ref: "news" },
  createAt: { type: Date },
});
const Favorites = mongoose.model("Favorite", FavoriteSchema);
exports.Favorite = Favorites;
