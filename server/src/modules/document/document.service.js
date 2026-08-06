import documentRepository from "./document.repository.js";

class DocumentService {
  async createDocument(documentData, ownerId) {
    return await documentRepository.create({
      ...documentData,
      owner: ownerId,
    });
  }

  async getUserDocuments(ownerId) {
    return await documentRepository.findByOwner(ownerId);
  }

  async getDocumentById(documentId) {
    return await documentRepository.findById(documentId);
  }

  async updateDocument(documentId, data) {
    return await documentRepository.update(documentId, data);
  }

  async deleteDocument(documentId) {
    return await documentRepository.delete(documentId);
  }
}

export default new DocumentService();