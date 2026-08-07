import { Box, Stack, Typography } from "@mui/material";

import LogoutButton from "../features/auth/components/LogoutButton";
import DocumentList from "../features/document/DocumentList";
import CreateDocument from "../features/document/CreateDocument";
const DashboardPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Stack spacing={4}>
        <Stack
  direction="row"
  sx={{
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Dashboard
            </Typography>

            <Typography color="text.secondary">
              Your documents
            </Typography>
          </Box>

          <LogoutButton />
        </Stack>
<CreateDocument onCreated={() => window.location.reload()} />
        <DocumentList />
      </Stack>
    </Box>
  );
};

export default DashboardPage;