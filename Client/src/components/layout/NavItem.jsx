import { Badge, Box, Tooltip, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

/**
 * One navigation entry. Renders as a router link when `to` is given,
 * otherwise as a button (for dialogs such as Create / Logout).
 *
 * variant: "side" (desktop sidebar), "bottom" (mobile tab bar), "top" (mobile header icon)
 */
export const NavItem = ({
  to,
  icon,
  activeIcon,
  label,
  badge,
  dot,
  onClick,
  variant = "side",
  end = false,
}) => {
  const { pathname } = useLocation();
  const active = to
    ? end || to === "/"
      ? pathname === to
      : pathname.startsWith(to)
    : false;
  const Icon = active && activeIcon ? activeIcon : icon;
  const iconNode =
    typeof Icon === "function" ? (
      <Icon size={variant === "bottom" ? 24 : 24} />
    ) : (
      Icon
    );

  const wrapped = (
    <Badge
      color="secondary"
      variant={dot ? "dot" : "standard"}
      badgeContent={dot ? undefined : badge || 0}
      invisible={dot ? !dot : !badge}
      overlap="circular"
      sx={{
        "& .MuiBadge-badge": { fontSize: "0.65rem", minWidth: 18, height: 18 },
      }}
    >
      <Box
        sx={{ display: "grid", placeItems: "center", width: 28, height: 28 }}
      >
        {iconNode}
      </Box>
    </Badge>
  );

  const linkProps = to
    ? { component: RouterLink, to }
    : { component: "button", type: "button" };

  if (variant === "side") {
    return (
      <Box
        {...linkProps}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.75,
          width: "100%",
          border: 0,
          background: "none",
          cursor: "pointer",
          textDecoration: "none",
          font: "inherit",
          color: active ? "primary.main" : "text.primary",
          px: { sm: 0, lg: 1.75 },
          py: 1.25,
          borderRadius: 3,
          justifyContent: { sm: "center", lg: "flex-start" },
          transition: "background-color .15s, color .15s",
          bgcolor: active ? "action.selected" : "transparent",
          "&:hover": { bgcolor: active ? "action.selected" : "action.hover" },
        }}
      >
        <Tooltip
          title={label}
          placement="right"
          arrow
          disableHoverListener
          enterDelay={400}
        >
          <Box sx={{ display: "grid", placeItems: "center" }}>{wrapped}</Box>
        </Tooltip>
        <Typography
          sx={{
            display: { sm: "none", lg: "block" },
            fontWeight: active ? 700 : 500,
            fontSize: "0.95rem",
          }}
        >
          {label}
        </Typography>
      </Box>
    );
  }

  if (variant === "bottom") {
    return (
      <Box
        {...linkProps}
        onClick={onClick}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        sx={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          height: 56,
          border: 0,
          background: "none",
          cursor: "pointer",
          color: active ? "primary.main" : "text.secondary",
          textDecoration: "none",
        }}
      >
        {wrapped}
      </Box>
    );
  }

  // top
  return (
    <Box
      {...linkProps}
      onClick={onClick}
      aria-label={label}
      sx={{
        display: "grid",
        placeItems: "center",
        width: 40,
        height: 40,
        borderRadius: 2.5,
        border: 0,
        background: "none",
        cursor: "pointer",
        color: active ? "primary.main" : "text.primary",
        textDecoration: "none",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      {wrapped}
    </Box>
  );
};
