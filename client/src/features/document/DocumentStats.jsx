import { Card, CardContent, Stack, Typography } from "@mui/material";

const DocumentStats = ({ documents }) => {
  const totalDocuments = documents.length;

  const documentsWithContent = documents.filter(
    (document) => document.content?.trim()
  ).length;

  const emptyDocuments =
    totalDocuments - documentsWithContent;

  const stats = [
    {
      label: "Total Documents",
      value: totalDocuments,
    },
    {
      label: "With Content",
      value: documentsWithContent,
    },
    {
      label: "Empty Documents",
      value: emptyDocuments,
    },
  ];

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
    >
      {stats.map((stat) => (
        <Card
          key={stat.label}
          sx={{ flex: 1 }}
        >
          <CardContent>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              {stat.label}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ mt: 1 }}
            >
              {stat.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default DocumentStats;