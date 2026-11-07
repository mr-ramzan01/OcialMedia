import { Box, Stack, Typography } from "@mui/material";

/**
 * Illustration + title + hint, for empty lists.
 */
export const EmptyState = ({
  image,
  icon,
  title,
  subtitle,
  action,
  compact = false,
  sx,
}) => (
  <Stack
    spacing={1}
    sx={{
      alignItems: "center",
      justifyContent: "center",
      py: compact ? 4 : 8,
      px: 2,
      textAlign: "center",
      ...sx,
    }}
  >
    {image && (
      <Box
        component="img"
        src={image}
        alt=""
        sx={{
          width: compact ? 96 : 150,
          height: compact ? 96 : 150,
          objectFit: "contain",
          opacity: 0.9,
          mb: 1,
        }}
      />
    )}
    {icon && (
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "30%",
          display: "grid",
          placeItems: "center",
          bgcolor: "action.selected",
          color: "primary.main",
          mb: 1,
          "& svg": { fontSize: 30 },
        }}
      >
        {icon}
      </Box>
    )}
    <Typography variant="h5">{title}</Typography>
    {subtitle && (
      <Typography color="text.secondary" sx={{ maxWidth: 360 }}>
        {subtitle}
      </Typography>
    )}
    {action && <Box sx={{ pt: 1 }}>{action}</Box>}
  </Stack>
);
