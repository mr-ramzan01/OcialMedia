import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Logo } from "../layout/Logo";

/** Catches render errors so a single broken component never blanks the whole app. */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled render error:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          p: 3,
          bgcolor: "background.default",
        }}
      >
        <Box>
          <Logo size="lg" />
          <Typography variant="h3" sx={{ mt: 3 }}>
            Something went wrong
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 1, mb: 3, maxWidth: 420, mx: "auto" }}
          >
            The page hit an unexpected error. Reloading usually fixes it. If it
            keeps happening, let us know.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </Box>
      </Box>
    );
  }
}
