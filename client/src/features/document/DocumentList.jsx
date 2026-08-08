import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import { documentService } from "./index";

const DocumentList = ({ documents, setDocuments }) => {
  const navigate = useNavigate();

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

  const getPreview = (content) => {
    if (!content?.trim()) {
      return "No content yet.";
    }

    const cleanedContent = content
      .replace(/\s+/g, " ")
      .trim();

    if (cleanedContent.length <= 140) {
      return cleanedContent;
    }

    return `${cleanedContent.substring(0, 140)}...`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
        <Card>
          <CardContent>
            <Stack
              spacing={1}
              sx={{
                alignItems: "center",
                py: 4,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
              >
                No documents found
              </Typography>

              <Typography
                color="text.secondary"
                align="center"
              >
                Create your first document to get started.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        documents.map((document) => (
          <Card
            key={document._id}
            onClick={() =>
              navigate(`/documents/${document._id}`)
            }
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              transition:
                "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  sx={{
                    justifyContent:
                      "space-between",
                    alignItems: {
                      xs: "stretch",
                      sm: "flex-start",
                    },
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {document.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        lineHeight: 1.6,
                      }}
                    >
                      {getPreview(document.content)}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      flexShrink: 0,
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(
                          `/documents/${document._id}`
                        );
                      }}
                    >
                      Open
                    </Button>

                    <Button
                      color="error"
                      variant="outlined"
                      size="small"
                      disabled={
                        deletingId === document._id
                      }
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
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    size="small"
                    label={
                      document.content?.trim()
                        ? "Has content"
                        : "Empty"
                    }
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Updated{" "}
                    {formatDate(
                      document.updatedAt ||
                        document.createdAt
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
};

export default DocumentList;