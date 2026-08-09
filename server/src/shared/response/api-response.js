
class ApiResponse {
  static success(
    res,
    message = "Success",
    data = null,
    statusCode = 200,
    meta = null
  ) {
    return res
      .status(statusCode)
      .json({
        success: true,
        message,
        data,
        meta,
      });
  }

  static error(
    res,
    message = "Something went wrong",
    statusCode = 500,
    errors = null
  ) {
    return res
      .status(statusCode)
      .json({
        success: false,
        message,
        errors,
      });
  }
}

export default ApiResponse;

