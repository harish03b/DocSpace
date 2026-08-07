import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { documentService } from "./index";

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await documentService.getDocumentById(id);

      console.log("DOCUMENT DETAILS RESPONSE:", response);

      const document = response?.message;

      if (!document) {
        throw new Error("Document not found.");
      }

      setFormData({
        title: document.title || "",
        content: document.content || "",
      });
    } catch (error) {
      console.error("DOCUMENT FETCH ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load document."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSuccess("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await documentService.updateDocument(
          id,
          formData
        );

      console.log("UPDATE DOCUMENT RESPONSE:", response);

      setSuccess("Document saved successfully.");
    } catch (error) {
      console.error("DOCUMENT UPDATE ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save document."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !formData.title && !formData.content) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>

        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard")}
            >
              ← Back
            </Button>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              Document Editor
            </Typography>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </Stack>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success">
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSave}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={15}
                placeholder="Start writing your document..."
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Document"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default DocumentEditor;