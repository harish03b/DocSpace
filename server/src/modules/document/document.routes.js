import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import documentController from "./document.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", documentController.create);

router.get("/", documentController.getAll);

router.get("/:id", documentController.getById);

router.put("/:id", documentController.update);

router.delete("/:id", documentController.delete);

export default router;