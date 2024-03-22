import mongoose from "mongoose";
import { ObjectId } from "mongoose";
import { SchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, require: true, trim: true },
  email: { type: String, require: true, trim: true, unique: true },
  password: { type: String, require: true, trim: true },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
});

export default mongoose.model("User", userSchema);
