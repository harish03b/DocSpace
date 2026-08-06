import { ApiResponse } from "../../shared/index.js";
import documentService from "./document.service.js";

class DocumentController {
  async create(req, res, next) {
    try {
      const document = await documentService.createDocument(
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

  async getAll(req, res, next) {
    try {
      const documents = await documentService.getUserDocuments(req.user.id);

      return ApiResponse.success(
        res,
        documents,
        "Documents fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const document = await documentService.getDocumentById(
        req.params.id
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

  async update(req, res, next) {
    try {
      const document = await documentService.updateDocument(
        req.params.id,
        req.body
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

  async delete(req, res, next) {
    try {
      await documentService.deleteDocument(req.params.id);

      return ApiResponse.success(
        res,
        null,
        "Document deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new DocumentController();