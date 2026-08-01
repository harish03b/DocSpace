import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";

import ApiResponse from "./shared/response/api-response.js";

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

app.get("/health", (req, res) => {
  return ApiResponse.success(
    res,
    "Server is running successfully",
    {
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    }
  );
});

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;