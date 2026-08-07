import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { documentService } from "./index";

const CreateDocument = ({ onCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await documentService.createDocument(
        formData
      );

      console.log("CREATE DOCUMENT RESPONSE:", response);

      setFormData({
        title: "",
        content: "",
      });

      if (onCreated) {
        onCreated();
      }
    } catch (error) {
      console.error("CREATE DOCUMENT ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create document."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            Create Document
          </Typography>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Document"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CreateDocument;