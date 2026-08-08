import { TextField } from "@mui/material";

const DocumentSearch = ({ search, setSearch }) => {
  return (
    <TextField
      fullWidth
      label="Search documents"
      placeholder="Search by title or content..."
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  );
};

export default DocumentSearch;