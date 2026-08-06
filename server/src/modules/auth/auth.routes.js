import { Router } from "express";

import authController from "./auth.controller.js";
import {
  validateLogin,
  validateRegister,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validateRegister,
  authController.register
);

router.post(
  "/login",
  validateLogin,
  authController.login
);

export default router;