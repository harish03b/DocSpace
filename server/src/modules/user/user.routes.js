import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import userController from "./user.controller.js";

const router = Router();

router.get(
  "/profile",
  authenticate,
  userController.getProfile
);

export default router;