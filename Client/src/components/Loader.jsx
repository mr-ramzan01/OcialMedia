import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { Logo } from "./layout/Logo";

/**
 * Loader variants:
 *  - <Loader />          full-page branded splash (initial auth check, OAuth callback)
 *  - <Loader inline />   small centered spinner for a section
 *  - <Loader overlay />  blocking backdrop with spinner (uploads / submits that lock the page)
 */
export const Loader = ({ inline = false, overlay = false, label }) => {
  if (inline) {
    return (
      <Box
        sx={{ display: "grid", placeItems: "center", py: 4 }}
        role="status"
        aria-label={label || "Loading"}
      >
        <CircularProgress size={28} thickness={4.5} />
      </Box>
    );
  }

  if (overlay) {
    return (
      <Backdrop
        sx={{
          color: "common.white",
          zIndex: (theme) => theme.zIndex.modal + 1,
          flexDirection: "column",
          gap: 2,
        }}
        open
      >
        <CircularProgress color="inherit" />
        {label && <Typography sx={{ fontWeight: 600 }}>{label}</Typography>}
      </Backdrop>
    );
  }

  return (
    <Box
      role="status"
      aria-label="Loading"
      sx={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
        zIndex: (theme) => theme.zIndex.modal + 1,
        "@keyframes pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(0.94)", opacity: 0.75 },
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          gap: 2,
          animation: "pulse 1.4s ease-in-out infinite",
        }}
      >
        <Logo variant="mark" size="lg" to="/" />
        <Box
          sx={{
            width: 120,
            height: 4,
            borderRadius: 2,
            bgcolor: "divider",
            overflow: "hidden",
            "@keyframes slide": {
              "0%": { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(250%)" },
            },
            "&::after": {
              content: '""',
              display: "block",
              width: "40%",
              height: "100%",
              borderRadius: 2,
              bgcolor: "primary.main",
              animation: "slide 1.1s ease-in-out infinite",
            },
          }}
        />
      </Box>
    </Box>
  );
};
