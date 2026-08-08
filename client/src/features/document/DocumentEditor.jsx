
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { documentService } from "./index";

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  /*
   * Load document
   */
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const response =
          await documentService.getDocumentById(id);

        console.log(
          "DOCUMENT DETAILS RESPONSE:",
          response
        );

        const documentData = response?.message;

        if (!documentData) {
          throw new Error("Document not found.");
        }

        setDocument(documentData);

        setFormData({
          title: documentData.title || "",
          content: documentData.content || "",
        });

        setIsDirty(false);
      } catch (error) {
        console.error(
          "DOCUMENT DETAILS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load document."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  /*
   * Protect against browser refresh / tab close
   * when there are unsaved changes.
   */
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

  /*
   * Handle form changes
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setIsDirty(true);
    setSuccess("");
    setError("");
  };

  /*
   * Save document
   */
  const handleSave = async (event) => {
    event.preventDefault();

    if (!isDirty) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await documentService.updateDocument(
          id,
          formData
        );

      console.log(
        "DOCUMENT UPDATE RESPONSE:",
        response
      );

      const updatedDocument = response?.message;

      if (!updatedDocument) {
        throw new Error(
          "Document update response was invalid."
        );
      }

      setDocument(updatedDocument);

      setFormData({
        title: updatedDocument.title || "",
        content: updatedDocument.content || "",
      });

      setIsDirty(false);

      setSuccess(
        "Document saved successfully."
      );
    } catch (error) {
      console.error(
        "DOCUMENT UPDATE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save document."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Handle back navigation
   */
  const handleBack = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );

      if (!confirmed) {
        return;
      }
    }

    navigate("/dashboard");
  };

  /*
   * Loading state
   */
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

  /*
   * Document loading error
   */
  if (error && !document) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">
          {error}
        </Alert>

        <Button
          variant="outlined"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Documents
        </Button>
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      <Stack spacing={3}>
        {/* Back Navigation */}
        <Box>
          <Button
            variant="text"
            onClick={handleBack}
            sx={{
              px: 0,
            }}
          >
            ← Back to Documents
          </Button>
        </Box>

        {/* Editor Card */}
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
                  Update your document and save
                  your changes.
                </Typography>
              </Box>

              <Divider />

              {/* Error Message */}
              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              {/* Success Message */}
              {success && (
                <Alert severity="success">
                  {success}
                </Alert>
              )}

              {/* Editor Form */}
              <Box
                component="form"
                onSubmit={handleSave}
              >
                <Stack spacing={3}>
                  {/* Title */}
                  <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                  />

                  {/* Content */}
                  <TextField
                    label="Content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={14}
                    placeholder="Write your document here..."
                  />

                  {/* Editor Footer */}
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
                    {/* Save Status */}
                    <Typography
                      variant="body2"
                      color={
                        isDirty
                          ? "warning.main"
                          : "text.secondary"
                      }
                    >
                      {saving
                        ? "Saving changes..."
                        : isDirty
                          ? "Unsaved changes"
                          : document?.updatedAt
                            ? `Saved • Last updated ${new Date(
                                document.updatedAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}`
                            : "Saved"}
                    </Typography>

                    {/* Save Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={
                        saving || !isDirty
                      }
                    >
                      {saving
                        ? "Saving..."
                        : isDirty
                          ? "Save Changes"
                          : "Saved"}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default DocumentEditor;
