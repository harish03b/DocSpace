import { ApiResponse } from "../../shared/index.js";

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return ApiResponse.error(
      res,
      "Name, email and password are required.",
      400
    );
  }

  if (password.length < 6) {
    return ApiResponse.error(
      res,
      "Password must be at least 6 characters.",
      400
    );
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiResponse.error(
      res,
      "Email and password are required.",
      400
    );
  }

  next();
};