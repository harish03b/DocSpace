
import Document from "./document.model.js";

class DocumentRepository {
  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  async create(documentData) {
    return await Document.create(
      documentData
    );
  }

  /*
   * =========================================================
   * FIND ACTIVE DOCUMENTS BY OWNER
   * =========================================================
   */

  async findByOwner(ownerId) {
    return await Document.find({
      owner: ownerId,
      isArchived: false,
    }).sort({
      updatedAt: -1,
    });
  }

  /*
   * =========================================================
   * FIND ARCHIVED DOCUMENTS BY OWNER
   * =========================================================
   */

  async findArchivedByOwner(ownerId) {
    return await Document.find({
      owner: ownerId,
      isArchived: true,
    }).sort({
      updatedAt: -1,
    });
  }

  /*
   * =========================================================
   * FIND BY ID + OWNER
   *
   * IMPORTANT:
   * Never use findById() for protected document operations.
   * The authenticated user's ID must always be included.
   * =========================================================
   */

  async findByIdAndOwner(
    documentId,
    ownerId
  ) {
    return await Document.findOne({
      _id: documentId,
      owner: ownerId,
    });
  }

  /*
   * =========================================================
   * UPDATE BY ID + OWNER
   * =========================================================
   */

  async updateByOwner(
    documentId,
    ownerId,
    data
  ) {
    return await Document.findOneAndUpdate(
      {
        _id: documentId,
        owner: ownerId,
      },
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
   * =========================================================
   * DELETE BY ID + OWNER
   * =========================================================
   */

  async deleteByOwner(
    documentId,
    ownerId
  ) {
    return await Document.findOneAndDelete({
      _id: documentId,
      owner: ownerId,
    });
  }

  /*
   * =========================================================
   * ARCHIVE BY ID + OWNER
   * =========================================================
   */

  async archiveByOwner(
    documentId,
    ownerId
  ) {
    return await Document.findOneAndUpdate(
      {
        _id: documentId,
        owner: ownerId,
        isArchived: false,
      },
      {
        isArchived: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
   * =========================================================
   * RESTORE BY ID + OWNER
   * =========================================================
   */

  async restoreByOwner(
    documentId,
    ownerId
  ) {
    return await Document.findOneAndUpdate(
      {
        _id: documentId,
        owner: ownerId,
        isArchived: true,
      },
      {
        isArchived: false,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export default new DocumentRepository();

