import { Box, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Logo } from "../components/layout/Logo";
import { EmptyState } from "../components/common/EmptyState";
import { usePageTitle } from "../hooks/usePageTitle";

export const NotFound = () => {
  usePageTitle("Page not found");
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 6,
        bgcolor: "background.default",
      }}
    >
      <Stack
        spacing={2}
        sx={{ alignItems: "center", width: "100%", maxWidth: 480 }}
      >
        <Logo size="lg" />
        <EmptyState
          image="/Images/404user.gif"
          title="Page not found"
          subtitle="The page you're looking for doesn't exist or may have been moved."
          action={
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
            >
              Go home
            </Button>
          }
        />
      </Stack>
    </Box>
  );
};
