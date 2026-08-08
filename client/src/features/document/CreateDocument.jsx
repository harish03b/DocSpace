import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const CreateDocument = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

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

      if (!formData.title.trim()) {
        setError(
          "Document title is required."
        );
        return;
      }

      const response =
        await documentService.createDocument({
          title: formData.title.trim(),
          content: formData.content,
        });

      console.log(
        "CREATE DOCUMENT RESPONSE:",
        response
      );

      /*
       * Backend returns the created
       * document in response.data.message
       */
      const createdDocument =
        response?.data?.message;

      if (!createdDocument?._id) {
        throw new Error(
          "Document was created but the server did not return the document."
        );
      }

      /*
       * Open the newly created document.
       */
      navigate(
        `/documents/${createdDocument._id}`
      );
    } catch (error) {
      console.error(
        "CREATE DOCUMENT ERROR:",
        error
      );

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
    <Box
      sx={{
        maxWidth: 900,
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
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
              >
                Create Document
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Create a new document in
                DocSpace.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
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
                  minRows={12}
                  placeholder="Write your document content..."
                />

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Document"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    disabled={loading}
                    onClick={() =>
                      navigate(
                        "/dashboard"
                      )
                    }
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateDocument;