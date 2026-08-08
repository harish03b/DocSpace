import documentApi from "./document.api.js";

class DocumentService {
  async createDocument(data) {
    return await documentApi.createDocument(data);
  }

  async getDocuments() {
    return await documentApi.getDocuments();
  }

  async getArchivedDocuments() {
    return await documentApi.getArchivedDocuments();
  }

  async getDocumentById(documentId) {
    return await documentApi.getDocumentById(
      documentId
    );
  }

  async updateDocument(documentId, data) {
    return await documentApi.updateDocument(
      documentId,
      data
    );
  }

  async deleteDocument(documentId) {
    return await documentApi.deleteDocument(
      documentId
    );
  }

  async archiveDocument(documentId) {
    return await documentApi.archiveDocument(
      documentId
    );
  }

  async restoreDocument(documentId) {
    return await documentApi.restoreDocument(
      documentId
    );
  }
}

export default new DocumentService();