import { createTheme, alpha } from "@mui/material/styles";

/**
 * Single source of truth for the Ocial Media look.
 * Every page and component styles itself from these tokens (via `sx` and
 * `theme.palette.*`) – no page defines its own colors.
 */
export const brand = {
  primary: "#5B5BD6",
  primaryDark: "#4343B5",
  primaryLight: "#8F8FE8",
  accent: "#FF5C8A",
  ink: "#15172B",
  muted: "#6B7089",
  line: "#E4E6F0",
  canvas: "#F4F5FB",
  surface: "#FFFFFF",
  gradient: "linear-gradient(135deg, #5B5BD6 0%, #8A5BD6 55%, #FF5C8A 130%)",
};

export const reactionColors = {
  love: "#FF4D6D",
  funny: "#F5A623",
  angry: "#D62828",
  cry: "#2E9BFF",
};

export const fonts = {
  body: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  brand: '"Pacifico", "Dancing Script", cursive',
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brand.primary,
      dark: brand.primaryDark,
      light: brand.primaryLight,
      contrastText: "#fff",
    },
    secondary: { main: brand.accent, contrastText: "#fff" },
    background: { default: brand.canvas, paper: brand.surface },
    text: { primary: brand.ink, secondary: brand.muted },
    divider: brand.line,
    success: { main: "#22A06B" },
    error: { main: "#E5484D" },
    warning: { main: "#F5A623" },
    info: { main: "#2E9BFF" },
    action: {
      hover: alpha(brand.primary, 0.06),
      selected: alpha(brand.primary, 0.1),
    },
  },
  shape: { borderRadius: 4 },
  spacing: 8,
  typography: {
    fontFamily: fonts.body,
    h1: { fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontSize: "1.25rem", fontWeight: 700 },
    h5: { fontSize: "1.1rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
    subtitle1: { fontSize: "0.95rem", fontWeight: 600 },
    subtitle2: { fontSize: "0.85rem", fontWeight: 600, color: brand.muted },
    body1: { fontSize: "0.95rem", lineHeight: 1.6 },
    body2: { fontSize: "0.85rem", lineHeight: 1.55 },
    caption: { fontSize: "0.75rem", color: brand.muted },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
  },
  shadows: [
    "none",
    "0 1px 2px rgba(21,23,43,0.04)",
    "0 2px 8px rgba(21,23,43,0.06)",
    "0 4px 16px rgba(21,23,43,0.08)",
    "0 8px 24px rgba(21,23,43,0.10)",
    "0 12px 32px rgba(21,23,43,0.12)",
    ...Array(19).fill("0 16px 40px rgba(21,23,43,0.14)"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: brand.canvas, color: brand.ink },
        "::selection": { background: alpha(brand.primary, 0.2) },
        "*::-webkit-scrollbar": { width: 6, height: 6 },
        "*::-webkit-scrollbar-thumb": {
          background: brand.line,
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20, minHeight: 40 },
        sizeSmall: { minHeight: 32, paddingInline: 14, fontSize: "0.8rem" },
        sizeLarge: { minHeight: 48, fontSize: "1rem" },
        containedPrimary: {
          backgroundImage: brand.gradient,
          "&:hover": {
            backgroundImage: brand.gradient,
            filter: "brightness(1.05)",
          },
        },
        outlined: {
          borderColor: brand.line,
          "&:hover": {
            borderColor: brand.primary,
            backgroundColor: alpha(brand.primary, 0.04),
          },
        },
        text: { "&:hover": { backgroundColor: alpha(brand.primary, 0.06) } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "&:hover": { backgroundColor: alpha(brand.primary, 0.08) },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: "none", border: `1px solid ${brand.line}` },
        rounded: { borderRadius: 18 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 18, border: `1px solid ${brand.line}` },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 22,
          border: "none",
          boxShadow: "0 24px 64px rgba(21,23,43,0.22)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontSize: "1.05rem", fontWeight: 700 } },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#15172B", 0.55),
          backdropFilter: "blur(4px)",
        },
      },
    },
    MuiTextField: { defaultProps: { variant: "outlined" } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: brand.surface,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: brand.line },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: brand.primaryLight,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: brand.primary,
          },
          // multiline: pad the wrapper once, not the textarea as well
          "&.MuiInputBase-multiline": {
            padding: "12px 14px",
            "& .MuiInputBase-input": { padding: 0 },
          },
        },
        input: { padding: "12px 14px" },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { color: brand.muted } } },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(brand.primary, 0.12),
          color: brand.primary,
          fontWeight: 600,
        },
      },
    },
    MuiBadge: { styleOverrides: { badge: { fontWeight: 700 } } },
    MuiDivider: { styleOverrides: { root: { borderColor: brand.line } } },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: brand.ink,
          borderRadius: 8,
          fontSize: "0.75rem",
        },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 12, fontWeight: 500 } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: brand.line },
        bar: { borderRadius: 4 },
      },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 999 } },
    },
  },
});

export default theme;
