import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
export const AI_API_KEY = process.env.AI_API_KEY || "";
