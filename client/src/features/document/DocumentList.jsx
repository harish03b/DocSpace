import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import { documentService } from "./index";

const DocumentList = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await documentService.getDocuments();

      console.log("DOCUMENT RESPONSE:", response);

      const documentData = Array.isArray(response?.message)
        ? response.message
        : [];

      setDocuments(documentData);
    } catch (error) {
      console.error("DOCUMENT FETCH ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (event, documentId) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(documentId);
      setError("");

      const response =
        await documentService.deleteDocument(documentId);

      console.log("DELETE DOCUMENT RESPONSE:", response);

      setDocuments((previousDocuments) =>
        previousDocuments.filter(
          (document) => document._id !== documentId
        )
      );
    } catch (error) {
      console.error("DELETE DOCUMENT ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Stack
        sx={{
          py: 6,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {documents.length === 0 ? (
        <Typography color="text.secondary">
          No documents found.
        </Typography>
      ) : (
        documents.map((document) => (
          <Card
            key={document._id}
            onClick={() =>
              navigate(`/documents/${document._id}`)
            }
            sx={{
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Stack spacing={1}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    {document.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {document.content ||
                      "No content yet."}
                  </Typography>
                </Stack>

                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  disabled={deletingId === document._id}
                  onClick={(event) =>
                    handleDelete(
                      event,
                      document._id
                    )
                  }
                >
                  {deletingId === document._id
                    ? "Deleting..."
                    : "Delete"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
};

export default DocumentList;