import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

/**
 * Avatar + username + full name row, used by search, followers, reactions, chat search.
 * Pass `onClick` to make it a button instead of a profile link.
 */
export const UserListItem = ({
  user,
  secondary,
  trailing,
  onClick,
  dense = false,
  selected = false,
}) => {
  if (!user) return null;
  const clickable = Boolean(onClick);
  const base = clickable
    ? { component: "button", type: "button", onClick }
    : { component: RouterLink, to: `/${user.username}` };

  return (
    <Stack
      direction="row"
      spacing={1.5}
      {...base}
      sx={{
        alignItems: "center",
        width: "100%",
        textAlign: "left",
        border: 0,
        font: "inherit",
        background: "none",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        px: 1.25,
        py: dense ? 0.75 : 1,
        borderRadius: 3,
        bgcolor: selected ? "action.selected" : "transparent",
        "&:hover": { bgcolor: selected ? "action.selected" : "action.hover" },
      }}
    >
      <Avatar
        src={user.image}
        alt={user.username}
        sx={{ width: dense ? 36 : 44, height: dense ? 36 : 44 }}
      >
        {(user.username || "?").slice(0, 1).toUpperCase()}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle1" noWrap sx={{ lineHeight: 1.25 }}>
          {user.username}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {secondary !== undefined ? secondary : user.full_name}
        </Typography>
      </Box>
      {trailing}
    </Stack>
  );
};

/** Username rendered as a profile link. */
export const UserName = ({ user, sx }) => (
  <Typography
    component={RouterLink}
    to={`/${user.username}`}
    variant="subtitle1"
    sx={{
      textDecoration: "none",
      color: "text.primary",
      "&:hover": { color: "primary.main" },
      ...sx,
    }}
  >
    {user.username}
  </Typography>
);
