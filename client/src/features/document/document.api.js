import api from "../../services/api";

const createDocument = (data) => {
  return api.post("/documents", data);
};

const getDocuments = () => {
  return api.get("/documents");
};

const getArchivedDocuments = () => {
  return api.get("/documents/archived");
};

const getDocumentById = (documentId) => {
  return api.get(`/documents/${documentId}`);
};

const updateDocument = (documentId, data) => {
  return api.put(
    `/documents/${documentId}`,
    data
  );
};

const deleteDocument = (documentId) => {
  return api.delete(
    `/documents/${documentId}`
  );
};

const archiveDocument = (documentId) => {
  return api.patch(
    `/documents/${documentId}/archive`
  );
};

const restoreDocument = (documentId) => {
  return api.patch(
    `/documents/${documentId}/restore`
  );
};

export default {
  createDocument,
  getDocuments,
  getArchivedDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  archiveDocument,
  restoreDocument,
};