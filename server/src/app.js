import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authRoutes } from "./modules/auth/index.js";
import { env } from "./config/env.js";
import mongoose from "mongoose";
import ApiResponse from "./shared/response/api-response.js";
import { userRoutes } from "./modules/user/index.js";
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  return ApiResponse.success(res, "Welcome to DocSpace API", {
    version: "v1",
    status: "Running",
  });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.get("/health", (req, res) => {
  return ApiResponse.success(
    res,
    {
      environment: env.nodeEnv,
      database:
        mongoose.connection.readyState === 1
          ? "connected"
          : "disconnected",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    "Server is healthy"
  );
});

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;