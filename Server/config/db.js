import mongoose from "mongoose";
import { ENV } from "../config/env.js";

export const connectionDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("MongoDB connected: ", conn.connection.host);
  } catch (error) {
    console.error("Error db connection", error);
    process.exit(1);
  }
};
