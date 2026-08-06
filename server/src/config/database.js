import mongoose from "mongoose";
import { env } from "./env.js";

const connectDatabase = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  try {
    const connection = await mongoose.connect(env.mongoUri);

    console.log("\n==============================");
    console.log("✅ MongoDB Connected");
    console.log(`📂 Database : ${connection.connection.name}`);
    console.log(`🌐 Host     : ${connection.connection.host}`);
    console.log("==============================\n");
  } catch (error) {
    console.error("\n❌ MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDatabase;