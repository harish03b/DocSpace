
import { ApiResponse } from "../../shared/index.js";

import documentService from "./document.service.js";

class DocumentController {
  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  async create(
    req,
    res,
    next
  ) {
    try {
      const document =
        await documentService.createDocument(
          req.body,
          req.user.id
        );

      return ApiResponse.success(
        res,
        document,
        "Document created successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  /*
   * =========================================================
   * GET ACTIVE DOCUMENTS
   * =========================================================
   */

  async getAll(
    req,
    res,
    next
  ) {
    try {
      const documents =
        await documentService.getUserDocuments(
          req.user.id
        );

      return ApiResponse.success(
        res,
        documents,
        "Documents fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  /*
   * =========================================================
   * GET ARCHIVED DOCUMENTS
   * =========================================================
   */

  async getArchived(
    req,
    res,
    next
  ) {
    try {
      const documents =
        await documentService.getArchivedDocuments(
          req.user.id
        );

      return ApiResponse.success(
        res,
        documents,
        "Archived documents fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  /*
   * =========================================================
   * GET SINGLE DOCUMENT
   * =========================================================
   */

  async getById(
    req,
    res,
    next
  ) {
    try {
      const document =
        await documentService.getDocumentById(
          req.params.id,
          req.user.id
        );

      return ApiResponse.success(
        res,
        document,
        "Document fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  /*
   * =========================================================
   * UPDATE DOCUMENT
   * =========================================================
   */

  async update(
    req,
    res,
    next
  ) {
    try {
      const document =
        await documentService.updateDocument(
          req.params.id,
          req.body,
          req.user.id
        );

      return ApiResponse.success(
        res,
        document,
        "Document updated successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  /*
   * =========================================================
   * DELETE DOCUMENT
   * =========================================================
   */

  async delete(
    req,
    res,
    next
  ) {
    try {
      await documentService.deleteDocument(
        req.params.id,
        req.user.id
      );

      return ApiResponse.success(
        res,
        null,
        "Document deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  /*
   * =========================================================
   * ARCHIVE DOCUMENT
   * =========================================================
   */

  async archive(
    req,
    res,
    next
  ) {
    try {
      const document =
        await documentService.archiveDocument(
          req.params.id,
          req.user.id
        );

      return ApiResponse.success(
        res,
        document,
        "Document archived successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  /*
   * =========================================================
   * RESTORE DOCUMENT
   * =========================================================
   */

  async restore(
    req,
    res,
    next
  ) {
    try {
      const document =
        await documentService.restoreDocument(
          req.params.id,
          req.user.id
        );

      return ApiResponse.success(
        res,
        document,
        "Document restored successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new DocumentController();

