import http from "http";
import mongoose from "mongoose";

import app from "./app.js";
import { env } from "./config/env.js";
import connectDatabase from "./config/database.js";

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Server startup failed.");
    console.error(error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");

  await mongoose.connection.close();

  console.log("✅ MongoDB connection closed.");

  server.close(() => {
    console.log("✅ HTTP server stopped.");
    process.exit(0);
  });
});

startServer();