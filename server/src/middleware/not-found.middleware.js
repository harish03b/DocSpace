import ApiResponse from "../shared/response/api-response.js";

const notFoundMiddleware = (req, res) => {
  return ApiResponse.error(
    res,
    `Route ${req.originalUrl} not found`,
    404
  );
};

export default notFoundMiddleware;