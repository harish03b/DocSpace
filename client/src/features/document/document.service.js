import {
  getDocumentsApi,
  getDocumentByIdApi,
  createDocumentApi,
  updateDocumentApi,
  deleteDocumentApi,
} from "./document.api";

class DocumentService {
  async getDocuments() {
    const response = await getDocumentsApi();
    return response.data;
  }

  async getDocumentById(documentId) {
    const response = await getDocumentByIdApi(documentId);
    return response.data;
  }

  async createDocument(data) {
    const response = await createDocumentApi(data);
    return response.data;
  }

  async updateDocument(documentId, data) {
    const response = await updateDocumentApi(documentId, data);
    return response.data;
  }

  async deleteDocument(documentId) {
    const response = await deleteDocumentApi(documentId);
    return response.data;
  }
}

export default new DocumentService();