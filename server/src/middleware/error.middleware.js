
import mongoose from "mongoose";

import ApiResponse from "../shared/response/api-response.js";

const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  /*
   * =========================================================
   * ERROR LOGGING
   * =========================================================
   */

  console.error(
    `[ERROR] ${req.method} ${req.originalUrl}`
  );

  console.error(err);

  /*
   * =========================================================
   * DEFAULT ERROR VALUES
   * =========================================================
   */

  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal Server Error";

  /*
   * =========================================================
   * MONGOOSE VALIDATION ERROR
   * =========================================================
   */

  if (
    err instanceof
    mongoose.Error.ValidationError
  ) {
    const validationErrors =
      Object.values(
        err.errors
      ).map(
        (validationError) => ({
          field:
            validationError.path,
          message:
            validationError.message,
        })
      );

    return ApiResponse.error(
      res,
      "Validation failed.",
      400,
      validationErrors
    );
  }

  /*
   * =========================================================
   * MONGOOSE CAST ERROR
   *
   * Example:
   * Cast to ObjectId failed for value "abc"
   * =========================================================
   */

  if (
    err instanceof
    mongoose.Error.CastError
  ) {
    return ApiResponse.error(
      res,
      `Invalid ${err.path || "value"}.`,
      400,
      null
    );
  }

  /*
   * =========================================================
   * MONGODB DUPLICATE KEY ERROR
   *
   * Error code: 11000
   * =========================================================
   */

  if (err.code === 11000) {
    const duplicateFields =
      Object.keys(
        err.keyValue || {}
      );

    const field =
      duplicateFields[0] ||
      "field";

    return ApiResponse.error(
      res,
      `${field} already exists.`,
      409,
      err.keyValue || null
    );
  }

  /*
   * =========================================================
   * JWT INVALID TOKEN
   * =========================================================
   */

  if (
    err.name ===
    "JsonWebTokenError"
  ) {
    return ApiResponse.error(
      res,
      "Invalid access token.",
      401,
      null
    );
  }

  /*
   * =========================================================
   * JWT EXPIRED TOKEN
   * =========================================================
   */

  if (
    err.name ===
    "TokenExpiredError"
  ) {
    return ApiResponse.error(
      res,
      "Access token has expired.",
      401,
      null
    );
  }

  /*
   * =========================================================
   * INVALID JSON BODY
   * =========================================================
   */

  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return ApiResponse.error(
      res,
      "Invalid JSON request body.",
      400,
      null
    );
  }

  /*
   * =========================================================
   * PAYLOAD TOO LARGE
   * =========================================================
   */

  if (
    err.type ===
    "entity.too.large"
  ) {
    return ApiResponse.error(
      res,
      "Request payload is too large.",
      413,
      null
    );
  }

  /*
   * =========================================================
   * KNOWN APPLICATION ERROR
   *
   * Examples:
   *
   * 400 Bad Request
   * 401 Unauthorized
   * 403 Forbidden
   * 404 Not Found
   * 409 Conflict
   * =========================================================
   */

  if (
    err.statusCode &&
    err.statusCode >= 400 &&
    err.statusCode < 500
  ) {
    return ApiResponse.error(
      res,
      message,
      err.statusCode,
      err.errors || null
    );
  }

  /*
   * =========================================================
   * INTERNAL SERVER ERROR
   *
   * Do not expose internal implementation
   * details in production.
   * =========================================================
   */

  const isProduction =
    process.env.NODE_ENV ===
    "production";

  return ApiResponse.error(
    res,
    isProduction
      ? "Internal Server Error."
      : message,
    500,
    null
  );
};

export default errorMiddleware;

