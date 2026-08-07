import api from "../../services/api";

export const getDocumentsApi = () => {
  return api.get("/documents");
};

export const getDocumentByIdApi = (documentId) => {
  return api.get(`/documents/${documentId}`);
};

export const createDocumentApi = (data) => {
  return api.post("/documents", data);
};

export const updateDocumentApi = (documentId, data) => {
  return api.put(`/documents/${documentId}`, data);
};

export const deleteDocumentApi = (documentId) => {
  return api.delete(`/documents/${documentId}`);
};