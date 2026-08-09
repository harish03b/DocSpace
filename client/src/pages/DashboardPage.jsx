
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import LogoutButton from "../features/auth/components/LogoutButton";
import DocumentSearch from "../features/document/DocumentSearch";
import { documentService } from "../features/document";

const DashboardPage = () => {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [activeDocuments, setActiveDocuments] =
    useState([]);

  const [archivedDocuments, setArchivedDocuments] =
    useState([]);

  const [view, setView] =
    useState("active");

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState("updatedAt");

  /*
   * Stores the document ID currently being
   * processed.
   *
   * This prevents duplicate requests for the
   * same document.
   */
  const [processingDocuments, setProcessingDocuments] =
    useState({});

  const [successMessage, setSuccessMessage] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  // =========================================================
  // HELPERS
  // =========================================================

  const getResponseMessage = useCallback(
    (response) => {
      const message =
        response?.data?.message;

      if (typeof message === "string") {
        return message;
      }

      return "";
    },
    []
  );

  const getErrorMessage = useCallback(
    (error, fallbackMessage) => {
      const message =
        error?.response?.data?.message;

      if (Array.isArray(message)) {
        return message.join(", ");
      }

      if (
        typeof message === "string" &&
        message.trim()
      ) {
        return message;
      }

      if (
        typeof error?.message === "string" &&
        error.message.trim()
      ) {
        return error.message;
      }

      return fallbackMessage;
    },
    []
  );

  // =========================================================
  // PROCESSING STATE
  // =========================================================

  const setDocumentProcessing = (
    documentId,
    action
  ) => {
    setProcessingDocuments(
      (previous) => ({
        ...previous,
        [documentId]: action,
      })
    );
  };

  const clearDocumentProcessing = (
    documentId
  ) => {
    setProcessingDocuments(
      (previous) => {
        const next = {
          ...previous,
        };

        delete next[documentId];

        return next;
      }
    );
  };

  const isDocumentProcessing = (
    documentId
  ) => {
    return Boolean(
      processingDocuments[documentId]
    );
  };

  // =========================================================
  // FETCH DOCUMENTS
  // =========================================================

  const fetchDocuments = useCallback(
    async () => {
      try {
        setLoading(true);
        setLoadError("");
        setActionError("");

        const [
          activeResponse,
          archivedResponse,
        ] = await Promise.all([
          documentService.getDocuments(),
          documentService.getArchivedDocuments(),
        ]);

        console.log(
          "ACTIVE DOCUMENT RESPONSE:",
          activeResponse
        );

        console.log(
          "ARCHIVED DOCUMENT RESPONSE:",
          archivedResponse
        );

        const activeData =
          activeResponse?.data?.message;

        const archivedData =
          archivedResponse?.data?.message;

        setActiveDocuments(
          Array.isArray(activeData)
            ? activeData
            : []
        );

        setArchivedDocuments(
          Array.isArray(archivedData)
            ? archivedData
            : []
        );
      } catch (error) {
        console.error(
          "DASHBOARD DOCUMENT ERROR:",
          error
        );

        setLoadError(
          getErrorMessage(
            error,
            "Unable to load documents. Please try again."
          )
        );

        setActiveDocuments([]);
        setArchivedDocuments([]);
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage]
  );

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // =========================================================
  // CURRENT DOCUMENT COLLECTION
  // =========================================================

  const currentDocuments =
    view === "active"
      ? activeDocuments
      : archivedDocuments;

  // =========================================================
  // LOCAL SEARCH
  //
  // Search works independently for both active
  // and archived documents.
  // =========================================================

  const filteredDocuments =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      if (!normalizedSearch) {
        return currentDocuments;
      }

      return currentDocuments.filter(
        (document) => {
          const title =
            document.title
              ?.toLowerCase() || "";

          const content =
            document.content
              ?.toLowerCase() || "";

          return (
            title.includes(
              normalizedSearch
            ) ||
            content.includes(
              normalizedSearch
            )
          );
        }
      );
    }, [
      currentDocuments,
      search,
    ]);

  // =========================================================
  // SORT
  // =========================================================

  const sortedDocuments =
    useMemo(() => {
      return [
        ...filteredDocuments,
      ].sort((a, b) => {
        switch (sortBy) {
          case "createdAt":
            return (
              new Date(
                b.createdAt || 0
              ) -
              new Date(
                a.createdAt || 0
              )
            );

          case "titleAsc":
            return (
              (
                a.title || ""
              ).localeCompare(
                b.title || "",
                undefined,
                {
                  sensitivity:
                    "base",
                }
              )
            );

          case "titleDesc":
            return (
              (
                b.title || ""
              ).localeCompare(
                a.title || "",
                undefined,
                {
                  sensitivity:
                    "base",
                }
              )
            );

          case "updatedAt":
          default:
            return (
              new Date(
                b.updatedAt || 0
              ) -
              new Date(
                a.updatedAt || 0
              )
            );
        }
      });
    }, [
      filteredDocuments,
      sortBy,
    ]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalDocuments =
    activeDocuments.length;

  const documentsWithContent =
    activeDocuments.filter(
      (document) =>
        Boolean(
          document.content?.trim()
        )
    ).length;

  const emptyDocuments =
    totalDocuments -
    documentsWithContent;

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Unavailable";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Unavailable";
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

  const formatDateTime = (
    date
  ) => {
    if (!date) {
      return "Unavailable";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Unavailable";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =========================================================
  // CONTENT PREVIEW
  // =========================================================

  const getContentPreview = (
    content
  ) => {
    if (!content?.trim()) {
      return "No content available.";
    }

    const normalizedContent =
      content
        .replace(/\s+/g, " ")
        .trim();

    if (
      normalizedContent.length <=
      180
    ) {
      return normalizedContent;
    }

    return `${normalizedContent.slice(
      0,
      180
    )}...`;
  };

  // =========================================================
  // ARCHIVE
  // =========================================================

  const handleArchive = async (
    documentId
  ) => {
    if (
      isDocumentProcessing(
        documentId
      )
    ) {
      return;
    }

    try {
      setDocumentProcessing(
        documentId,
        "archive"
      );

      setActionError("");
      setSuccessMessage("");

      await documentService.archiveDocument(
        documentId
      );

      /*
       * Immediately remove from active UI.
       */

      setActiveDocuments(
        (previousDocuments) =>
          previousDocuments.filter(
            (document) =>
              document._id !==
              documentId
          )
      );

      /*
       * Refresh archived documents.
       */

      const response =
        await documentService.getArchivedDocuments();

      const archivedData =
        response?.data?.message;

      setArchivedDocuments(
        Array.isArray(archivedData)
          ? archivedData
          : []
      );

      setSuccessMessage(
        "Document archived successfully."
      );
    } catch (error) {
      console.error(
        "ARCHIVE ERROR:",
        error
      );

      setActionError(
        getErrorMessage(
          error,
          "Failed to archive document."
        )
      );
    } finally {
      clearDocumentProcessing(
        documentId
      );
    }
  };

  // =========================================================
  // RESTORE
  // =========================================================

  const handleRestore = async (
    documentId
  ) => {
    if (
      isDocumentProcessing(
        documentId
      )
    ) {
      return;
    }

    try {
      setDocumentProcessing(
        documentId,
        "restore"
      );

      setActionError("");
      setSuccessMessage("");

      await documentService.restoreDocument(
        documentId
      );

      /*
       * Immediately remove from archived UI.
       */

      setArchivedDocuments(
        (previousDocuments) =>
          previousDocuments.filter(
            (document) =>
              document._id !==
              documentId
          )
      );

      /*
       * Refresh active documents.
       */

      const response =
        await documentService.getDocuments();

      const activeData =
        response?.data?.message;

      setActiveDocuments(
        Array.isArray(activeData)
          ? activeData
          : []
      );

      setSuccessMessage(
        "Document restored successfully."
      );
    } catch (error) {
      console.error(
        "RESTORE ERROR:",
        error
      );

      setActionError(
        getErrorMessage(
          error,
          "Failed to restore document."
        )
      );
    } finally {
      clearDocumentProcessing(
        documentId
      );
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (
    documentId,
    isArchived
  ) => {
    if (
      isDocumentProcessing(
        documentId
      )
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this document?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDocumentProcessing(
        documentId,
        "delete"
      );

      setActionError("");
      setSuccessMessage("");

      await documentService.deleteDocument(
        documentId
      );

      if (isArchived) {
        setArchivedDocuments(
          (previousDocuments) =>
            previousDocuments.filter(
              (document) =>
                document._id !==
                documentId
            )
        );

        setSuccessMessage(
          "Archived document deleted permanently."
        );
      } else {
        setActiveDocuments(
          (previousDocuments) =>
            previousDocuments.filter(
              (document) =>
                document._id !==
                documentId
            )
        );

        setSuccessMessage(
          "Document deleted permanently."
        );
      }
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      setActionError(
        getErrorMessage(
          error,
          "Failed to delete document."
        )
      );
    } finally {
      clearDocumentProcessing(
        documentId
      );
    }
  };

  // =========================================================
  // VIEW CHANGE
  // =========================================================

  const handleViewChange = (
    nextView
  ) => {
    setView(nextView);

    /*
     * Keep search behavior predictable when
     * switching between active and archived.
     */

    setSearch("");

    setSortBy("updatedAt");

    setActionError("");
    setSuccessMessage("");
  };

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClearSearch = () => {
    setSearch("");
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <Stack
        sx={{
          minHeight: "60vh",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />

        <Typography
          color="text.secondary"
          sx={{
            mt: 2,
          }}
        >
          Loading documents...
        </Typography>
      </Stack>
    );
  }

  // =========================================================
  // MAIN RENDER
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor:
          "background.default",
        py: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Stack spacing={4}>

          {/* =================================================
              HEADER
              ================================================= */}

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
                sm: "center",
              },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
              >
                DocSpace
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                Welcome back
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Manage your
                documents from
                one place.
              </Typography>
            </Box>

            <LogoutButton />
          </Stack>

          {/* =================================================
              ERRORS
              ================================================= */}

          {loadError && (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={
                    fetchDocuments
                  }
                >
                  Retry
                </Button>
              }
            >
              {loadError}
            </Alert>
          )}

          {actionError && (
            <Alert
              severity="error"
              onClose={() =>
                setActionError("")
              }
            >
              {actionError}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              onClose={() =>
                setSuccessMessage("")
              }
            >
              {successMessage}
            </Alert>
          )}

          {/* =================================================
              STATISTICS
              ================================================= */}

          {view === "active" && (
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <Card
                sx={{
                  flex: 1,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography
                    color="text.secondary"
                  >
                    Total Documents
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {
                      totalDocuments
                    }
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Active documents
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography
                    color="text.secondary"
                  >
                    With Content
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {
                      documentsWithContent
                    }
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Documents containing
                    text
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography
                    color="text.secondary"
                  >
                    Empty Documents
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {
                      emptyDocuments
                    }
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Documents without
                    content
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* =================================================
              VIEW SWITCH
              ================================================= */}

          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap:
                "wrap",
            }}
          >
            <Button
              variant={
                view === "active"
                  ? "contained"
                  : "outlined"
              }
              onClick={() =>
                handleViewChange(
                  "active"
                )
              }
            >
              Active Documents
            </Button>

            <Button
              variant={
                view === "archived"
                  ? "contained"
                  : "outlined"
              }
              color={
                view === "archived"
                  ? "warning"
                  : "primary"
              }
              onClick={() =>
                handleViewChange(
                  "archived"
                )
              }
            >
              Archived Documents
            </Button>
          </Stack>

          {/* =================================================
              CREATE
              ================================================= */}

          {view === "active" && (
            <Box>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    "/documents/create"
                  )
                }
              >
                Create Document
              </Button>
            </Box>
          )}

          {/* =================================================
              SEARCH
              ================================================= */}

          <Box>
            <DocumentSearch
              search={search}
              setSearch={setSearch}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {search.trim() && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems:
                    "center",
                  mt: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Searching for:
                </Typography>

                <Chip
                  label={search}
                  size="small"
                  onDelete={
                    handleClearSearch
                  }
                />
              </Stack>
            )}
          </Box>

          {/* =================================================
              DOCUMENT SECTION
              ================================================= */}

          <Box>
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
                  sm: "center",
                },
                gap: 1,
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  {view === "active"
                    ? "Your Documents"
                    : "Archived Documents"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {
                    sortedDocuments.length
                  }{" "}
                  {sortedDocuments.length ===
                  1
                    ? "document"
                    : "documents"}
                </Typography>
              </Box>
            </Stack>

            {/* =================================================
                EMPTY STATE
                ================================================= */}

            {sortedDocuments.length ===
            0 ? (
              <Card
                sx={{
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Stack
                    spacing={1}
                    sx={{
                      alignItems:
                        "center",
                      py: 5,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                    >
                      {search.trim()
                        ? "No matching documents"
                        : view === "active"
                        ? "No documents found"
                        : "No archived documents"}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      align="center"
                    >
                      {search.trim()
                        ? `No documents found for "${search}".`
                        : view === "active"
                        ? "Create your first document to get started."
                        : "Archived documents will appear here."}
                    </Typography>

                    {search.trim() && (
                      <Button
                        variant="outlined"
                        onClick={
                          handleClearSearch
                        }
                        sx={{
                          mt: 1,
                        }}
                      >
                        Clear Search
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              /* =================================================
                 DOCUMENT LIST
                 ================================================= */

              <Stack spacing={2}>
                {sortedDocuments.map(
                  (document) => {
                    const processingAction =
                      processingDocuments[
                        document._id
                      ];

                    const processing =
                      Boolean(
                        processingAction
                      );

                    return (
                      <Card
                        key={
                          document._id
                        }
                        sx={{
                          borderRadius: 3,
                        }}
                      >
                        <CardContent>
                          <Stack spacing={2}>

                            {/* DOCUMENT HEADER */}

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
                                  sm: "center",
                                },
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  minWidth: 0,
                                  flex: 1,
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    alignItems:
                                      "center",
                                    flexWrap:
                                      "wrap",
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{
                                      wordBreak:
                                        "break-word",
                                    }}
                                  >
                                    {
                                      document.title
                                    }
                                  </Typography>

                                  <Chip
                                    label={
                                      view ===
                                      "archived"
                                        ? "Archived"
                                        : "Active"
                                    }
                                    color={
                                      view ===
                                      "archived"
                                        ? "warning"
                                        : "success"
                                    }
                                    size="small"
                                    variant="outlined"
                                  />

                                  <Chip
                                    label={
                                      document.content?.trim()
                                        ? "Has content"
                                        : "Empty"
                                    }
                                    color={
                                      document.content?.trim()
                                        ? "primary"
                                        : "default"
                                    }
                                    size="small"
                                    variant="outlined"
                                  />
                                </Stack>
                              </Box>

                              {/* ACTIONS */}

                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                  flexWrap:
                                    "wrap",
                                }}
                              >
                                {view ===
                                  "active" && (
                                  <>
                                    <Button
                                      variant="outlined"
                                      disabled={
                                        processing
                                      }
                                      onClick={() =>
                                        navigate(
                                          `/documents/${document._id}`
                                        )
                                      }
                                    >
                                      Open
                                    </Button>

                                    <Button
                                      color="warning"
                                      variant="outlined"
                                      disabled={
                                        processing
                                      }
                                      onClick={() =>
                                        handleArchive(
                                          document._id
                                        )
                                      }
                                    >
                                      {processingAction ===
                                      "archive"
                                        ? "Archiving..."
                                        : "Archive"}
                                    </Button>
                                  </>
                                )}

                                {view ===
                                  "archived" && (
                                  <Button
                                    color="success"
                                    variant="outlined"
                                    disabled={
                                      processing
                                    }
                                    onClick={() =>
                                      handleRestore(
                                        document._id
                                      )
                                    }
                                  >
                                    {processingAction ===
                                    "restore"
                                      ? "Restoring..."
                                      : "Restore"}
                                  </Button>
                                )}

                                <Button
                                  color="error"
                                  variant="outlined"
                                  disabled={
                                    processing
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      document._id,
                                      view ===
                                        "archived"
                                    )
                                  }
                                >
                                  {processingAction ===
                                  "delete"
                                    ? "Deleting..."
                                    : "Delete"}
                                </Button>
                              </Stack>
                            </Stack>

                            <Divider />

                            {/* CONTENT */}

                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  lineHeight:
                                    1.7,
                                  wordBreak:
                                    "break-word",
                                }}
                              >
                                {getContentPreview(
                                  document.content
                                )}
                              </Typography>
                            </Box>

                            <Divider />

                            {/* METADATA */}

                            <Stack
                              direction={{
                                xs: "column",
                                sm: "row",
                              }}
                              spacing={{
                                xs: 0.75,
                                sm: 3,
                              }}
                              sx={{
                                flexWrap:
                                  "wrap",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                <strong>
                                  Created:
                                </strong>{" "}
                                {formatDate(
                                  document.createdAt
                                )}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                <strong>
                                  Last updated:
                                </strong>{" "}
                                {formatDateTime(
                                  document.updatedAt
                                )}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                <strong>
                                  Content:
                                </strong>{" "}
                                {document.content?.trim()
                                  ? `${document.content.trim().length} characters`
                                  : "Empty"}
                              </Typography>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default DashboardPage;
