import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import LogoutButton from "../features/auth/components/LogoutButton";
import { documentService } from "../features/document";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [activeDocuments, setActiveDocuments] =
    useState([]);

  const [archivedDocuments, setArchivedDocuments] =
    useState([]);

  const [view, setView] = useState("active");

  const [loading, setLoading] = useState(true);

  /*
   * Load active and archived documents
   * independently.
   */
  const fetchDocuments = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  /*
   * Current document collection
   */
  const currentDocuments =
    view === "active"
      ? activeDocuments
      : archivedDocuments;

  /*
   * Active statistics
   */
  const totalDocuments =
    activeDocuments.length;

  const documentsWithContent =
    activeDocuments.filter(
      (document) =>
        document.content?.trim()
    ).length;

  const emptyDocuments =
    totalDocuments -
    documentsWithContent;

  /*
   * Archive from dashboard
   */
  const handleArchive = async (
    documentId
  ) => {
    try {
      await documentService.archiveDocument(
        documentId
      );

      /*
       * Remove from active
       */
      setActiveDocuments(
        (previousDocuments) =>
          previousDocuments.filter(
            (document) =>
              document._id !== documentId
          )
      );

      /*
       * Reload archived list so
       * the archived document appears.
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
    } catch (error) {
      console.error(
        "ARCHIVE ERROR:",
        error
      );
    }
  };

  /*
   * Restore from archived view
   */
  const handleRestore = async (
    documentId
  ) => {
    try {
      await documentService.restoreDocument(
        documentId
      );

      /*
       * Remove from archived
       */
      setArchivedDocuments(
        (previousDocuments) =>
          previousDocuments.filter(
            (document) =>
              document._id !== documentId
          )
      );

      /*
       * Reload active list so
       * restored document appears.
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
    } catch (error) {
      console.error(
        "RESTORE ERROR:",
        error
      );
    }
  };

  /*
   * Delete document
   */
  const handleDelete = async (
    documentId,
    isArchived
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await documentService.deleteDocument(
        documentId
      );

      if (isArchived) {
        setArchivedDocuments(
          (previousDocuments) =>
            previousDocuments.filter(
              (document) =>
                document._id !== documentId
            )
        );
      } else {
        setActiveDocuments(
          (previousDocuments) =>
            previousDocuments.filter(
              (document) =>
                document._id !== documentId
            )
        );
      }
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );
    }
  };

  if (loading) {
    return (
      <Stack
        sx={{
          minHeight: "60vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
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
                sx={{ mt: 0.5 }}
              >
                Welcome back
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Manage your documents from
                one place.
              </Typography>
            </Box>

            <LogoutButton />
          </Stack>

          {/* Statistics */}
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
                    {totalDocuments}
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
                    {documentsWithContent}
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
                    {emptyDocuments}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* View switch */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
            }}
          >
            <Button
              variant={
                view === "active"
                  ? "contained"
                  : "outlined"
              }
              onClick={() =>
                setView("active")
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
                setView("archived")
              }
            >
              Archived Documents
            </Button>
          </Stack>

          {/* Create */}
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

          {/* Section */}
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mb: 2,
              }}
            >
              {view === "active"
                ? "Your Documents"
                : "Archived Documents"}
            </Typography>

            {/* Empty state */}
            {currentDocuments.length ===
            0 ? (
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
                      {view === "active"
                        ? "No documents found"
                        : "No archived documents"}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      align="center"
                    >
                      {view === "active"
                        ? "Create your first document to get started."
                        : "Archived documents will appear here."}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={2}>
                {currentDocuments.map(
                  (document) => (
                    <Card
                      key={document._id}
                      sx={{
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
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
                              variant="h6"
                              fontWeight={700}
                            >
                              {
                                document.title
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              {document.content?.trim()
                                ? document.content
                                : "No content available."}
                            </Typography>
                          </Box>

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
                                  onClick={() =>
                                    handleArchive(
                                      document._id
                                    )
                                  }
                                >
                                  Archive
                                </Button>
                              </>
                            )}

                            {view ===
                              "archived" && (
                              <Button
                                color="success"
                                variant="outlined"
                                onClick={() =>
                                  handleRestore(
                                    document._id
                                  )
                                }
                              >
                                Restore
                              </Button>
                            )}

                            <Button
                              color="error"
                              variant="outlined"
                              onClick={() =>
                                handleDelete(
                                  document._id,
                                  view ===
                                    "archived"
                                )
                              }
                            >
                              Delete
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  )
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