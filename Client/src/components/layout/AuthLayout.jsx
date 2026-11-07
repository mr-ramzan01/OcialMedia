import { Box, Paper, Stack, Typography } from "@mui/material";
import { Logo } from "./Logo";
import { brand } from "../../theme";

/**
 * Centered card used by login, signup and password pages.
 */
export const AuthLayout = ({ title, subtitle, children, footer }) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      px: 2,
      py: 6,
      backgroundImage: `radial-gradient(60% 50% at 10% 0%, rgba(91,91,214,0.18) 0%, transparent 70%),
                        radial-gradient(50% 40% at 100% 100%, rgba(255,92,138,0.16) 0%, transparent 70%)`,
    }}
  >
    <Box sx={{ width: "100%", maxWidth: 440 }}>
      <Stack sx={{ alignItems: "center", mb: 3 }}>
        <Logo size="lg" />
      </Stack>
      <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 5, boxShadow: 4 }}>
        <Typography variant="h3" component="h1" align="center">
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" align="center" sx={{ mt: 0.75 }}>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ mt: 3 }}>{children}</Box>
      </Paper>
      {footer && (
        <Paper sx={{ mt: 2, p: 2, textAlign: "center", borderRadius: 4 }}>
          {footer}
        </Paper>
      )}
      <Typography
        variant="caption"
        component="p"
        align="center"
        sx={{ mt: 3, color: brand.muted }}
      >
        © {new Date().getFullYear()} Ocial Media
      </Typography>
    </Box>
  </Box>
);
