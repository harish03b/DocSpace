
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";

import { authRoutes } from "./modules/auth/index.js";
import { userRoutes } from "./modules/user/index.js";
import { documentRoutes } from "./modules/document/index.js";

import { env } from "./config/env.js";

import ApiResponse from "./shared/response/api-response.js";

import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

/*
 * =========================================================
 * SECURITY
 * =========================================================
 */

app.use(helmet());

/*
 * =========================================================
 * CORS
 * =========================================================
 */

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

/*
 * =========================================================
 * BODY PARSING
 * =========================================================
 */

app.use(
  express.json({
    limit: "1mb",
  })
);

/*
 * =========================================================
 * LOGGING
 * =========================================================
 */

app.use(morgan("dev"));

/*
 * =========================================================
 * ROOT
 * =========================================================
 */

app.get("/", (req, res) => {
  return ApiResponse.success(
    res,
    "Welcome to DocSpace API",
    {
      version: "v1",
      status: "Running",
    }
  );
});

/*
 * =========================================================
 * AUTH ROUTES
 * =========================================================
 */

app.use(
  "/api/v1/auth",
  authRoutes
);

/*
 * =========================================================
 * USER ROUTES
 * =========================================================
 */

app.use(
  "/api/v1/users",
  userRoutes
);

/*
 * =========================================================
 * DOCUMENT ROUTES
 * =========================================================
 */

app.use(
  "/api/v1/documents",
  documentRoutes
);

/*
 * =========================================================
 * HEALTH CHECK
 * =========================================================
 */

app.get("/health", (req, res) => {
  return ApiResponse.success(
    res,
    "Server is healthy",
    {
      environment:
        env.nodeEnv,

      database:
        mongoose.connection.readyState ===
        1
          ? "connected"
          : "disconnected",

      uptime:
        Math.floor(
          process.uptime()
        ),

      timestamp:
        new Date().toISOString(),
    }
  );
});

/*
 * =========================================================
 * 404
 * =========================================================
 */

app.use(
  notFoundMiddleware
);

/*
 * =========================================================
 * GLOBAL ERROR HANDLER
 * =========================================================
 */

app.use(
  errorMiddleware
);

export default app;

