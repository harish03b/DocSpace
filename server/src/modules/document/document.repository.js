import Document from "./document.model.js";

class DocumentRepository {
  async create(documentData) {
    return await Document.create(documentData);
  }

  async findByOwner(ownerId) {
    return await Document.find({
      owner: ownerId,
      isArchived: false,
    }).sort({
      updatedAt: -1,
    });
  }

  async findById(documentId) {
    return await Document.findById(documentId);
  }

  async update(documentId, data) {
    return await Document.findByIdAndUpdate(
      documentId,
      data,
      {
        new: true,
      }
    );
  }

  async delete(documentId) {
    return await Document.findByIdAndDelete(documentId);
  }
}

export default new DocumentRepository();