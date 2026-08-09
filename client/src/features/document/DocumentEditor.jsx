
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  TextField,
  Typography,
} from "@mui/material";

import { documentService } from "./index";

const AUTOSAVE_DELAY = 1500;

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [document, setDocument] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isDirty, setIsDirty] = useState(false);

  const [saveStatus, setSaveStatus] = useState("loading");

  // =========================================================
  // REFS
  // =========================================================

  const autoSaveTimerRef = useRef(null);

  const saveInProgressRef = useRef(false);

  const latestFormDataRef = useRef({
    title: "",
    content: "",
  });

  const latestDocumentRef = useRef(null);

  const mountedRef = useRef(true);

  const saveRequestIdRef = useRef(0);

  // =========================================================
  // KEEP LATEST FORM DATA IN REF
  // =========================================================

  useEffect(() => {
    latestFormDataRef.current = formData;
  }, [formData]);

  // =========================================================
  // CLEAR AUTO-SAVE TIMER
  // =========================================================

  const clearAutoSaveTimer = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  // =========================================================
  // ERROR MESSAGE HELPER
  // =========================================================

  const getErrorMessage = useCallback((error, fallback) => {
    const responseMessage =
      error?.response?.data?.message;

    if (Array.isArray(responseMessage)) {
      return responseMessage.join(", ");
    }

    if (
      typeof responseMessage === "string" &&
      responseMessage.trim()
    ) {
      return responseMessage;
    }

    if (
      typeof error?.message === "string" &&
      error.message.trim()
    ) {
      return error.message;
    }

    return fallback;
  }, []);

  // =========================================================
  // LOAD DOCUMENT
  // =========================================================

  useEffect(() => {
    mountedRef.current = true;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");
        setSaveStatus("loading");

        if (!id) {
          throw new Error(
            "Document ID is missing."
          );
        }

        const response =
          await documentService.getDocumentById(id);

        console.log(
          "DOCUMENT DETAILS RESPONSE:",
          response
        );

        /*
         * Current backend response format:
         *
         * {
         *   success: true,
         *   message: document,
         *   data: "Document fetched successfully.",
         *   meta: null
         * }
         */

        const documentData =
          response?.data?.message;

        if (
          !documentData ||
          !documentData._id
        ) {
          throw new Error(
            "Document not found."
          );
        }

        if (!mountedRef.current) {
          return;
        }

        const initialFormData = {
          title:
            documentData.title || "",
          content:
            documentData.content || "",
        };

        setDocument(documentData);

        latestDocumentRef.current =
          documentData;

        setFormData(initialFormData);

        latestFormDataRef.current =
          initialFormData;

        setIsDirty(false);

        setSaveStatus("saved");
      } catch (error) {
        console.error(
          "DOCUMENT DETAILS ERROR:",
          error
        );

        if (!mountedRef.current) {
          return;
        }

        setError(
          getErrorMessage(
            error,
            "Failed to load document."
          )
        );

        setDocument(null);

        setSaveStatus("error");
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchDocument();

    return () => {
      mountedRef.current = false;
      clearAutoSaveTimer();
    };
  }, [
    id,
    clearAutoSaveTimer,
    getErrorMessage,
  ]);

  // =========================================================
  // BROWSER REFRESH / TAB CLOSE PROTECTION
  // =========================================================

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [isDirty]);

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateFormData = useCallback(
    (data) => {
      const title =
        data.title?.trim() || "";

      const content =
        data.content || "";

      if (!title) {
        return {
          valid: false,
          message:
            "Document title is required.",
        };
      }

      if (title.length > 200) {
        return {
          valid: false,
          message:
            "Document title cannot exceed 200 characters.",
        };
      }

      return {
        valid: true,
        data: {
          title,
          content,
        },
      };
    },
    []
  );

  // =========================================================
  // SAVE DOCUMENT
  // =========================================================

  const saveDocument = useCallback(
    async (data, options = {}) => {
      const {
        manual = false,
      } = options;

      if (!id) {
        setError(
          "Document ID is missing."
        );

        setSaveStatus("error");

        return false;
      }

      /*
       * Prevent overlapping save requests.
       */

      if (
        saveInProgressRef.current
      ) {
        return false;
      }

      const validation =
        validateFormData(data);

      if (!validation.valid) {
        if (mountedRef.current) {
          setError(
            validation.message
          );

          setSaveStatus("error");
        }

        return false;
      }

      const requestId =
        ++saveRequestIdRef.current;

      try {
        saveInProgressRef.current =
          true;

        if (mountedRef.current) {
          setSaving(true);
          setError("");
          setSuccess("");
          setSaveStatus("saving");
        }

        const payload =
          validation.data;

        const response =
          await documentService.updateDocument(
            id,
            payload
          );

        console.log(
          "DOCUMENT UPDATE RESPONSE:",
          response
        );

        const updatedDocument =
          response?.data?.message;

        if (
          !updatedDocument ||
          !updatedDocument._id
        ) {
          throw new Error(
            "Document update response was invalid."
          );
        }

        /*
         * Ignore an old response if another save
         * request somehow became newer.
         */

        if (
          requestId !==
          saveRequestIdRef.current
        ) {
          return false;
        }

        if (!mountedRef.current) {
          return true;
        }

        /*
         * Update server document.
         */

        setDocument(
          updatedDocument
        );

        latestDocumentRef.current =
          updatedDocument;

        /*
         * Check whether the user typed anything
         * while the API request was running.
         */

        const latestData =
          latestFormDataRef.current;

        const serverTitle =
          updatedDocument.title || "";

        const serverContent =
          updatedDocument.content || "";

        const latestMatchesServer =
          latestData.title.trim() ===
            serverTitle &&
          latestData.content ===
            serverContent;

        /*
         * Only overwrite form state when the
         * server response is still the latest data.
         */

        if (latestMatchesServer) {
          const syncedFormData = {
            title: serverTitle,
            content: serverContent,
          };

          setFormData(
            syncedFormData
          );

          latestFormDataRef.current =
            syncedFormData;

          setIsDirty(false);
        }

        setSaveStatus("saved");

        if (manual) {
          setSuccess(
            "Document saved successfully."
          );
        }

        return true;
      } catch (error) {
        console.error(
          manual
            ? "DOCUMENT UPDATE ERROR:"
            : "AUTO-SAVE ERROR:",
          error
        );

        if (mountedRef.current) {
          setError(
            getErrorMessage(
              error,
              "Failed to save document."
            )
          );

          setSaveStatus("error");
        }

        return false;
      } finally {
        if (
          requestId ===
          saveRequestIdRef.current
        ) {
          saveInProgressRef.current =
            false;

          if (mountedRef.current) {
            setSaving(false);
          }
        }
      }
    },
    [
      id,
      validateFormData,
      getErrorMessage,
    ]
  );

  // =========================================================
  // AUTO-SAVE
  // =========================================================

  const autoSaveDocument = useCallback(
    async () => {
      if (!mountedRef.current) {
        return;
      }

      if (loading) {
        return;
      }

      if (!isDirty) {
        return;
      }

      if (
        saveInProgressRef.current
      ) {
        return;
      }

      const currentData =
        latestFormDataRef.current;

      await saveDocument(
        currentData,
        {
          manual: false,
        }
      );
    },
    [
      loading,
      isDirty,
      saveDocument,
    ]
  );

  // =========================================================
  // CHANGE HANDLER
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    const updatedFormData = {
      ...latestFormDataRef.current,
      [name]: value,
    };

    latestFormDataRef.current =
      updatedFormData;

    setFormData(
      updatedFormData
    );

    setIsDirty(true);

    setSaveStatus("unsaved");

    setError("");
    setSuccess("");

    /*
     * Cancel existing timer.
     */

    clearAutoSaveTimer();

    /*
     * Start new debounce timer.
     */

    autoSaveTimerRef.current =
      setTimeout(() => {
        autoSaveDocument();
      }, AUTOSAVE_DELAY);
  };

  // =========================================================
  // MANUAL SAVE
  // =========================================================

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (!isDirty) {
      setSuccess(
        "There are no changes to save."
      );

      return;
    }

    clearAutoSaveTimer();

    await saveDocument(
      latestFormDataRef.current,
      {
        manual: true,
      }
    );
  };

  // =========================================================
  // DISCARD CHANGES
  // =========================================================

  const handleCancelChanges = () => {
    if (!document) {
      return;
    }

    if (!isDirty) {
      return;
    }

    const confirmed =
      window.confirm(
        "Discard your unsaved changes?"
      );

    if (!confirmed) {
      return;
    }

    clearAutoSaveTimer();

    const originalData = {
      title:
        latestDocumentRef.current
          ?.title || "",
      content:
        latestDocumentRef.current
          ?.content || "",
    };

    setFormData(
      originalData
    );

    latestFormDataRef.current =
      originalData;

    setIsDirty(false);

    setError("");

    setSuccess(
      "Unsaved changes discarded."
    );

    setSaveStatus("saved");
  };

  // =========================================================
  // BACK TO DASHBOARD
  // =========================================================

  const handleBack = () => {
    if (isDirty) {
      const confirmed =
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );

      if (!confirmed) {
        return;
      }
    }

    clearAutoSaveTimer();

    navigate("/dashboard");
  };

  // =========================================================
  // DATE FORMATTER
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
  // SAVE STATUS LABEL
  // =========================================================

  const getSaveStatusLabel =
    () => {
      switch (saveStatus) {
        case "loading":
          return "Loading...";

        case "unsaved":
          return "Unsaved changes";

        case "saving":
          return "Saving...";

        case "saved":
          return "Saved";

        case "error":
          return "Save failed";

        default:
          return "Saved";
      }
    };

  // =========================================================
  // SAVE STATUS COLOR
  // =========================================================

  const getSaveStatusColor =
    () => {
      switch (saveStatus) {
        case "unsaved":
          return "warning";

        case "saving":
          return "primary";

        case "saved":
          return "success";

        case "error":
          return "error";

        default:
          return "default";
      }
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
          Loading document...
        </Typography>
      </Stack>
    );
  }

  // =========================================================
  // DOCUMENT LOAD ERROR
  // =========================================================

  if (!document) {
    return (
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          py: 4,
          px: 2,
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Typography
                variant="h5"
                fontWeight={700}
              >
                Unable to open document
              </Typography>

              <Alert severity="error">
                {error ||
                  "Document not found."}
              </Alert>

              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    "/dashboard"
                  )
                }
              >
                Back to Documents
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // =========================================================
  // MAIN EDITOR
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor:
          "background.default",
        py: {
          xs: 2,
          md: 4,
        },
        px: {
          xs: 1,
          sm: 2,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
        }}
      >
        <Stack spacing={3}>

          {/* =================================================
              TOP NAVIGATION
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
            <Button
              variant="text"
              onClick={
                handleBack
              }
              sx={{
                alignSelf: {
                  xs: "flex-start",
                  sm: "auto",
                },
                px: 0,
              }}
            >
              ← Back to Documents
            </Button>

            <Chip
              label={
                getSaveStatusLabel()
              }
              color={
                getSaveStatusColor()
              }
              variant="outlined"
              size="small"
            />
          </Stack>

          {/* =================================================
              EDITOR CARD
              ================================================= */}

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                },
              }}
            >
              <Stack spacing={3}>

                {/* Header */}

                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    Edit Document
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 1,
                    }}
                  >
                    Changes are
                    automatically saved
                    after you stop
                    typing.
                  </Typography>
                </Box>

                {/* Metadata */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={{
                    xs: 1,
                    sm: 3,
                  }}
                >
                  <Typography
                    variant="body2"
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
                    variant="body2"
                    color="text.secondary"
                  >
                    <strong>
                      Updated:
                    </strong>{" "}
                    {formatDate(
                      document.updatedAt
                    )}
                  </Typography>
                </Stack>

                <Divider />

                {/* Error */}

                {error && (
                  <Alert
                    severity="error"
                    onClose={() =>
                      setError("")
                    }
                  >
                    {error}
                  </Alert>
                )}

                {/* Success */}

                {success && (
                  <Alert
                    severity="success"
                    onClose={() =>
                      setSuccess("")
                    }
                  >
                    {success}
                  </Alert>
                )}

                {/* Form */}

                <Box
                  component="form"
                  onSubmit={
                    handleSave
                  }
                >
                  <Stack spacing={3}>

                    {/* TITLE */}

                    <TextField
                      label="Document Title"
                      name="title"
                      value={
                        formData.title
                      }
                      onChange={
                        handleChange
                      }
                      fullWidth
                      required
                      disabled={
                        saving
                      }
                      inputProps={{
                        maxLength: 200,
                      }}
                      helperText={`${formData.title.length}/200 characters`}
                    />

                    {/* CONTENT */}

                    <TextField
                      label="Document Content"
                      name="content"
                      value={
                        formData.content
                      }
                      onChange={
                        handleChange
                      }
                      fullWidth
                      multiline
                      minRows={16}
                      disabled={
                        saving
                      }
                      placeholder="Write your document here..."
                      helperText={`${formData.content.length} characters`}
                      sx={{
                        "& .MuiInputBase-root":
                          {
                            alignItems:
                              "flex-start",
                          },
                      }}
                    />

                    {/* ACTIONS */}

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
                      {/* STATUS */}

                      <Typography
                        variant="body2"
                        color={
                          saveStatus ===
                          "error"
                            ? "error.main"
                            : saveStatus ===
                                "unsaved"
                              ? "warning.main"
                              : saveStatus ===
                                  "saving"
                                ? "primary.main"
                                : "text.secondary"
                        }
                      >
                        {saveStatus ===
                        "saving"
                          ? "Saving your changes..."
                          : saveStatus ===
                              "unsaved"
                            ? "Changes will be saved automatically."
                            : saveStatus ===
                                "saved"
                              ? `Saved • ${formatDate(
                                  document.updatedAt
                                )}`
                              : saveStatus ===
                                  "error"
                                ? "Save failed. Try Save Changes again."
                                : ""}
                      </Typography>

                      {/* BUTTONS */}

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          justifyContent:
                            {
                              xs: "stretch",
                              sm: "flex-end",
                            },
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={
                            handleCancelChanges
                          }
                          disabled={
                            saving ||
                            !isDirty
                          }
                        >
                          Discard Changes
                        </Button>

                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={
                            saving ||
                            !isDirty
                          }
                        >
                          {saving
                            ? "Saving..."
                            : "Save Changes"}
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

export default DocumentEditor;

