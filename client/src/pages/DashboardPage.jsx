import { useMemo, useState } from "react";

import {
  Box,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CreateDocument from "../features/document/CreateDocument";
import DocumentList from "../features/document/DocumentList";
import DocumentSearch from "../features/document/DocumentSearch";
import DocumentStats from "../features/document/DocumentStats";

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updated");

  const filteredDocuments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    let result = documents.filter((document) => {
      if (!searchValue) {
        return true;
      }

      const title = document.title?.toLowerCase() || "";
      const content = document.content?.toLowerCase() || "";

      return (
        title.includes(searchValue) ||
        content.includes(searchValue)
      );
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(
          b.title || ""
        );
      }

      if (sortBy === "created") {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      }

      return (
        new Date(b.updatedAt || 0) -
        new Date(a.updatedAt || 0)
      );
    });

    return result;
  }, [documents, search, sortBy]);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Welcome back
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Manage your documents from one place.
        </Typography>
      </Box>

      <DocumentStats documents={documents} />

      <CreateDocument
        onCreated={(createdDocument) => {
          setDocuments((previousDocuments) => [
            createdDocument,
            ...previousDocuments,
          ]);
        }}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
      >
        <DocumentSearch
          search={search}
          setSearch={setSearch}
        />

        <TextField
          select
          label="Sort by"
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value)
          }
          sx={{
            minWidth: {
              xs: "100%",
              md: 220,
            },
          }}
        >
          <MenuItem value="updated">
            Recently Updated
          </MenuItem>

          <MenuItem value="created">
            Recently Created
          </MenuItem>

          <MenuItem value="title">
            Title A-Z
          </MenuItem>
        </TextField>
      </Stack>

      <Box>
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          Your Documents
        </Typography>

        <DocumentList
          documents={filteredDocuments}
          setDocuments={setDocuments}
        />
      </Box>
    </Stack>
  );
};

export default DashboardPage;