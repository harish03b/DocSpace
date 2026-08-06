import { ApiResponse } from "../../shared/index.js";
import { userService } from "./index.js";

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);

      return ApiResponse.success(
        res,
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        "Profile fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();