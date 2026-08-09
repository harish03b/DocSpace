
import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";

import documentController from "./document.controller.js";

const router = Router();

/*
 * =========================================================
 * AUTHENTICATION
 *
 * Every document endpoint requires a valid access token.
 * =========================================================
 */

router.use(authenticate);

/*
 * =========================================================
 * CREATE DOCUMENT
 * =========================================================
 */

router.post(
  "/",
  documentController.create
);

/*
 * =========================================================
 * GET ARCHIVED DOCUMENTS
 *
 * IMPORTANT:
 * This must remain before /:id.
 * =========================================================
 */

router.get(
  "/archived",
  documentController.getArchived
);

/*
 * =========================================================
 * GET ACTIVE DOCUMENTS
 * =========================================================
 */

router.get(
  "/",
  documentController.getAll
);

/*
 * =========================================================
 * GET SINGLE DOCUMENT
 * =========================================================
 */

router.get(
  "/:id",
  documentController.getById
);

/*
 * =========================================================
 * UPDATE DOCUMENT
 * =========================================================
 */

router.put(
  "/:id",
  documentController.update
);

/*
 * =========================================================
 * DELETE DOCUMENT
 * =========================================================
 */

router.delete(
  "/:id",
  documentController.delete
);

/*
 * =========================================================
 * ARCHIVE DOCUMENT
 * =========================================================
 */

router.patch(
  "/:id/archive",
  documentController.archive
);

/*
 * =========================================================
 * RESTORE DOCUMENT
 * =========================================================
 */

router.patch(
  "/:id/restore",
  documentController.restore
);

export default router;
