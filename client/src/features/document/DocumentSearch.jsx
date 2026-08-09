import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

const DocumentSearch = ({
  search,
  setSearch,
  sortBy,
  setSortBy,
}) => {
  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={2}
      sx={{
        width: "100%",
      }}
    >
      {/* Search */}
      <TextField
        fullWidth
        label="Search documents"
        placeholder="Search by title or content..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />

      {/* Sort */}
      <FormControl
        sx={{
          minWidth: {
            xs: "100%",
            sm: 240,
          },
        }}
      >
        <InputLabel id="document-sort-label">
          Sort by
        </InputLabel>

        <Select
          labelId="document-sort-label"
          value={sortBy}
          label="Sort by"
          onChange={(event) =>
            setSortBy(event.target.value)
          }
        >
          <MenuItem value="updatedAt">
            Recently Updated
          </MenuItem>

          <MenuItem value="createdAt">
            Recently Created
          </MenuItem>

          <MenuItem value="titleAsc">
            Title A-Z
          </MenuItem>

          <MenuItem value="titleDesc">
            Title Z-A
          </MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

export default DocumentSearch;