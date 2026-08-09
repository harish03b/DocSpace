
import mongoose from "mongoose";

import documentRepository from "./document.repository.js";

class DocumentService {
  /*
   * =========================================================
   * ERROR HELPER
   * =========================================================
   */

  createError(
    message,
    statusCode = 400
  ) {
    const error = new Error(
      message
    );

    error.statusCode =
      statusCode;

    return error;
  }

  /*
   * =========================================================
   * VALIDATE DOCUMENT ID
   * =========================================================
   */

  validateDocumentId(
    documentId
  ) {
    if (
      !documentId ||
      typeof documentId !== "string"
    ) {
      throw this.createError(
        "Document ID is required.",
        400
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        documentId
      )
    ) {
      throw this.createError(
        "Invalid document ID.",
        400
      );
    }
  }

  /*
   * =========================================================
   * VALIDATE OWNER
   * =========================================================
   */

  validateOwner(ownerId) {
    if (!ownerId) {
      throw this.createError(
        "Authenticated user is required.",
        401
      );
    }
  }

  /*
   * =========================================================
   * CREATE DOCUMENT
   * =========================================================
   */

  async createDocument(
    documentData,
    ownerId
  ) {
    this.validateOwner(
      ownerId
    );

    if (
      !documentData?.title ||
      typeof documentData.title !==
        "string" ||
      !documentData.title.trim()
    ) {
      throw this.createError(
        "Document title is required.",
        400
      );
    }

    return await documentRepository.create(
      {
        title:
          documentData.title.trim(),

        content:
          typeof documentData.content ===
          "string"
            ? documentData.content
            : "",

        owner: ownerId,

        isArchived: false,
      }
    );
  }

  /*
   * =========================================================
   * GET ACTIVE DOCUMENTS
   * =========================================================
   */

  async getUserDocuments(
    ownerId
  ) {
    this.validateOwner(
      ownerId
    );

    return await documentRepository.findByOwner(
      ownerId
    );
  }

  /*
   * =========================================================
   * GET ARCHIVED DOCUMENTS
   * =========================================================
   */

  async getArchivedDocuments(
    ownerId
  ) {
    this.validateOwner(
      ownerId
    );

    return await documentRepository.findArchivedByOwner(
      ownerId
    );
  }

  /*
   * =========================================================
   * GET SINGLE DOCUMENT
   * =========================================================
   */

  async getDocumentById(
    documentId,
    ownerId
  ) {
    this.validateDocumentId(
      documentId
    );

    this.validateOwner(
      ownerId
    );

    const document =
      await documentRepository.findByIdAndOwner(
        documentId,
        ownerId
      );

    /*
     * We intentionally return 404 instead of
     * revealing that another user's document exists.
     */

    if (!document) {
      throw this.createError(
        "Document not found.",
        404
      );
    }

    return document;
  }

  /*
   * =========================================================
   * UPDATE DOCUMENT
   * =========================================================
   */

  async updateDocument(
    documentId,
    data,
    ownerId
  ) {
    this.validateDocumentId(
      documentId
    );

    this.validateOwner(
      ownerId
    );

    /*
     * Find only the authenticated user's
     * document.
     */

    const document =
      await documentRepository.findByIdAndOwner(
        documentId,
        ownerId
      );

    if (!document) {
      throw this.createError(
        "Document not found.",
        404
      );
    }

    /*
     * Archived documents cannot be edited.
     */

    if (document.isArchived) {
      throw this.createError(
        "Archived documents cannot be edited. Restore the document first.",
        400
      );
    }

    /*
     * Only allow title/content.
     *
     * Never allow the client to change:
     *
     * - _id
     * - owner
     * - isArchived
     * - createdAt
     * - updatedAt
     */

    const updateData = {};

    if (
      Object.prototype.hasOwnProperty.call(
        data || {},
        "title"
      )
    ) {
      if (
        typeof data.title !==
        "string"
      ) {
        throw this.createError(
          "Document title must be a string.",
          400
        );
      }

      const title =
        data.title.trim();

      if (!title) {
        throw this.createError(
          "Document title is required.",
          400
        );
      }

      updateData.title =
        title;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        data || {},
        "content"
      )
    ) {
      if (
        typeof data.content !==
        "string"
      ) {
        throw this.createError(
          "Document content must be a string.",
          400
        );
      }

      updateData.content =
        data.content;
    }

    if (
      Object.keys(
        updateData
      ).length === 0
    ) {
      throw this.createError(
        "No valid document fields were provided for update.",
        400
      );
    }

    const updatedDocument =
      await documentRepository.updateByOwner(
        documentId,
        ownerId,
        updateData
      );

    if (!updatedDocument) {
      throw this.createError(
        "Document could not be updated.",
        404
      );
    }

    return updatedDocument;
  }

  /*
   * =========================================================
   * DELETE DOCUMENT
   * =========================================================
   */

  async deleteDocument(
    documentId,
    ownerId
  ) {
    this.validateDocumentId(
      documentId
    );

    this.validateOwner(
      ownerId
    );

    /*
     * Verify ownership before deleting.
     */

    const document =
      await documentRepository.findByIdAndOwner(
        documentId,
        ownerId
      );

    if (!document) {
      throw this.createError(
        "Document not found.",
        404
      );
    }

    const deletedDocument =
      await documentRepository.deleteByOwner(
        documentId,
        ownerId
      );

    if (!deletedDocument) {
      throw this.createError(
        "Document could not be deleted.",
        404
      );
    }

    return deletedDocument;
  }

  /*
   * =========================================================
   * ARCHIVE DOCUMENT
   * =========================================================
   */

  async archiveDocument(
    documentId,
    ownerId
  ) {
    this.validateDocumentId(
      documentId
    );

    this.validateOwner(
      ownerId
    );

    const document =
      await documentRepository.findByIdAndOwner(
        documentId,
        ownerId
      );

    if (!document) {
      throw this.createError(
        "Document not found.",
        404
      );
    }

    if (document.isArchived) {
      throw this.createError(
        "Document is already archived.",
        400
      );
    }

    const archivedDocument =
      await documentRepository.archiveByOwner(
        documentId,
        ownerId
      );

    if (!archivedDocument) {
      throw this.createError(
        "Document could not be archived.",
        404
      );
    }

    return archivedDocument;
  }

  /*
   * =========================================================
   * RESTORE DOCUMENT
   * =========================================================
   */

  async restoreDocument(
    documentId,
    ownerId
  ) {
    this.validateDocumentId(
      documentId
    );

    this.validateOwner(
      ownerId
    );

    const document =
      await documentRepository.findByIdAndOwner(
        documentId,
        ownerId
      );

    if (!document) {
      throw this.createError(
        "Document not found.",
        404
      );
    }

    if (!document.isArchived) {
      throw this.createError(
        "Document is already active.",
        400
      );
    }

    const restoredDocument =
      await documentRepository.restoreByOwner(
        documentId,
        ownerId
      );

    if (!restoredDocument) {
      throw this.createError(
        "Document could not be restored.",
        404
      );
    }

    return restoredDocument;
  }
}

export default new DocumentService();
