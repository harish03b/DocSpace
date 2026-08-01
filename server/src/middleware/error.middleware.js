import ApiResponse from "../shared/response/api-response.js";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  return ApiResponse.error(
    res,
    err.message || "Internal Server Error",
    err.statusCode || 500
  );
};

export default errorMiddleware;