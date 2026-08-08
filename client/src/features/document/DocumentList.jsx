
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

const DocumentList = ({
  documents,
  setDocuments,
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  /*
   * Fetch documents
   */
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await documentService.getDocuments();

      console.log(
        "DOCUMENT RESPONSE:",
        response
      );

      /*
       * Axios response structure:
       *
       * response
       *   └── data
       *       ├── success
       *       ├── message: [documents]
       *       ├── data: "Documents fetched successfully."
       *       └── meta
       */

      const documentData =
        response?.data?.message;

      if (!Array.isArray(documentData)) {
        throw new Error(
          "Invalid document response received from server."
        );
      }

      setDocuments(documentData);
    } catch (error) {
      console.error(
        "DOCUMENT FETCH ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load documents."
      );

      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Load documents when component mounts
   */
  useEffect(() => {
    fetchDocuments();
  }, []);

  /*
   * Archive document
   */
  const handleArchive = async (
    event,
    documentId
  ) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to archive this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(documentId);
      setError("");

      const response =
        await documentService.archiveDocument(
          documentId
        );

      console.log(
        "ARCHIVE DOCUMENT RESPONSE:",
        response
      );

      /*
       * Remove archived document
       * from current active list.
       */
      setDocuments(
        (previousDocuments) =>
          previousDocuments.filter(
            (document) =>
              document._id !== documentId
          )
      );
    } catch (error) {
      console.error(
        "ARCHIVE DOCUMENT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to archive document."
      );
    } finally {
      setActionId(null);
    }
  };

  /*
   * Delete document
   */
  const handleDelete = async (
    event,
    documentId
  ) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(documentId);
      setError("");

      const response =
        await documentService.deleteDocument(
          documentId
        );

      console.log(
        "DELETE DOCUMENT RESPONSE:",
        response
      );

      setDocuments(
        (previousDocuments) =>
          previousDocuments.filter(
            (document) =>
              document._id !== documentId
          )
      );
    } catch (error) {
      console.error(
        "DELETE DOCUMENT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete document."
      );
    } finally {
      setActionId(null);
    }
  };

  /*
   * Open document
   */
  const handleOpen = (
    event,
    documentId
  ) => {
    event.stopPropagation();

    navigate(
      `/documents/${documentId}`
    );
  };

  /*
   * Content preview
   */
  const getPreview = (content) => {
    if (!content?.trim()) {
      return "No content available.";
    }

    const cleanedContent = content
      .replace(/\s+/g, " ")
      .trim();

    if (cleanedContent.length <= 140) {
      return cleanedContent;
    }

    return `${cleanedContent.substring(
      0,
      140
    )}...`;
  };

  /*
   * Format date
   */
  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * Loading
   */
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
      {/* Error */}
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {/* Empty state */}
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
                Create your first document
                to get started.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        documents.map((document) => (
          <Card
            key={document._id}
            onClick={() =>
              navigate(
                `/documents/${document._id}`
              )
            }
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              transition:
                "transform 0.2s, box-shadow 0.2s",

              "&:hover": {
                transform:
                  "translateY(-2px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                {/* Header */}
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
                  {/* Document information */}
                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
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
                      {getPreview(
                        document.content
                      )}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      flexShrink: 0,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(event) =>
                        handleOpen(
                          event,
                          document._id
                        )
                      }
                    >
                      Open
                    </Button>

                    <Button
                      color="warning"
                      variant="outlined"
                      size="small"
                      disabled={
                        actionId ===
                        document._id
                      }
                      onClick={(event) =>
                        handleArchive(
                          event,
                          document._id
                        )
                      }
                    >
                      {actionId ===
                      document._id
                        ? "Working..."
                        : "Archive"}
                    </Button>

                    <Button
                      color="error"
                      variant="outlined"
                      size="small"
                      disabled={
                        actionId ===
                        document._id
                      }
                      onClick={(event) =>
                        handleDelete(
                          event,
                          document._id
                        )
                      }
                    >
                      {actionId ===
                      document._id
                        ? "Working..."
                        : "Delete"}
                    </Button>
                  </Stack>
                </Stack>

                {/* Metadata */}
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
