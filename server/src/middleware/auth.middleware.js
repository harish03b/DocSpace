import jwt from "jsonwebtoken";

import { ApiResponse } from "../shared/index.js";
import { env } from "../config/env.js";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return ApiResponse.error(
        res,
        "Access token is required.",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return ApiResponse.error(
        res,
        "Invalid authorization header.",
        401
      );
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = decoded;

    next();
  } catch (error) {
    return ApiResponse.error(
      res,
      "Invalid or expired token.",
      401
    );
  }
};

export default authenticate; 