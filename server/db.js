import mongoose from "mongoose";
import { USER, PASSWORD, DBNAME } from "./config.js";

const connectDB = async () => {
  const URI = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.hto4nog.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    const db = await mongoose.connect(URI);
    console.log("Connect to", db.connection.name);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
