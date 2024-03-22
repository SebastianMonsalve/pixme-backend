import mongoose from "mongoose";
import { Schema } from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, trim: true },
    image: { url: String, public_id: String },
    isFavorite: { type: Boolean, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Image", imageSchema);
