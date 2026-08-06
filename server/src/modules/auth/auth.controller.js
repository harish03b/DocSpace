import { ApiResponse } from "../../shared/index.js";
import { userService } from "../user/index.js";

class AuthController {
  async register(req, res, next) {
    try {
      const user = await userService.createUser(req.body);

      return ApiResponse.success(
        res,
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        "User registered successfully."
      );
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
  try {
    const result = await userService.loginUser(
      req.body.email,
      req.body.password
    );

    return ApiResponse.success(
      res,
      result,
      "Login successful."
    );
  } catch (error) {
    next(error);
  }
}
}

export default new AuthController();