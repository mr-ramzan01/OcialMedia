import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { brand, fonts } from "../../theme";

/**
 * Brand mark. `variant="full"` shows the wordmark, `"mark"` only the monogram.
 */
export const Logo = ({ variant = "full", size = "md", to = "/" }) => {
  const fontSize =
    size === "lg" ? "2.4rem" : size === "sm" ? "1.35rem" : "1.7rem";
  const markSize = size === "lg" ? 56 : size === "sm" ? 36 : 44;

  return (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Box
        sx={{
          width: markSize,
          height: markSize,
          borderRadius: "30%",
          backgroundImage: brand.gradient,
          display: "grid",
          placeItems: "center",
          color: "common.white",
          fontFamily: fonts.brand,
          fontSize: markSize * 0.5,
          lineHeight: 1,
          boxShadow: "0 6px 16px rgba(91,91,214,0.35)",
          flexShrink: 0,
        }}
      >
        O
      </Box>
      {variant === "full" && (
        <Typography
          component="span"
          sx={{
            fontFamily: fonts.brand,
            fontSize,
            lineHeight: 1,
            backgroundImage: brand.gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            whiteSpace: "nowrap",
          }}
        >
          Ocial Media
        </Typography>
      )}
    </Box>
  );
};
