import dotenv from "dotenv";

dotenv.config();
export const USER = process.env.USER;
export const PASSWORD = process.env.PASSWORD;
export const DBNAME = process.env.DBNAME;
export const PORT = process.env.PORT || 3000;

export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
