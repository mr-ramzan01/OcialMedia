import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import {
  IoHomeOutline,
  IoHome,
  IoSearchOutline,
  IoSearch,
  IoCompassOutline,
  IoCompass,
  IoChatbubbleEllipsesOutline,
  IoChatbubbleEllipses,
  IoHeartOutline,
  IoHeart,
  IoSettingsOutline,
  IoSettings,
} from "react-icons/io5";
import { AuthContext } from "../../context/AuthContext";
import { Logo } from "./Logo";
import { NavItem } from "./NavItem";
import { CreateIcon } from "./CreatePostDialog";
import { LogoutIcon } from "./LogoutDialog";

export const SIDEBAR_WIDTH = { sm: 88, lg: 264 };
const CONTENT_WIDTH = { feed: 640, wide: 980, full: 1200 };

/**
 * Page chrome shared by every authenticated page:
 * desktop sidebar, mobile top + bottom bars, and a centered content column.
 */
export const AppShell = ({
  children,
  width = "wide",
  disablePadding = false,
}) => {
  const {
    userData,
    messagesNotification,
    generalNotifications,
    getUser,
    hasGeneralNotifications,
  } = useContext(AuthContext);

  useEffect(() => {
    getUser();
    hasGeneralNotifications();
  }, [getUser, hasGeneralNotifications]);

  const profileTo = userData.username ? `/${userData.username}` : "/";
  const avatar = (
    <Avatar
      src={userData.image}
      alt={userData.username}
      sx={{ width: 26, height: 26, fontSize: 13 }}
    >
      {(userData.username || "?").slice(0, 1).toUpperCase()}
    </Avatar>
  );

  const primaryNav = (variant) => (
    <>
      <NavItem
        variant={variant}
        to="/"
        icon={IoHomeOutline}
        activeIcon={IoHome}
        label="Home"
        end
      />
      <NavItem
        variant={variant}
        to="/search"
        icon={IoSearchOutline}
        activeIcon={IoSearch}
        label="Search"
      />
      <NavItem
        variant={variant}
        to="/explore"
        icon={IoCompassOutline}
        activeIcon={IoCompass}
        label="Explore"
      />
      {variant === "side" && (
        <NavItem
          variant={variant}
          to="/messages"
          icon={IoChatbubbleEllipsesOutline}
          activeIcon={IoChatbubbleEllipses}
          label="Messages"
          badge={messagesNotification.length}
        />
      )}
      {variant === "bottom" && <CreateIcon variant={variant} />}
      <NavItem
        variant={variant}
        to="/notifications"
        icon={IoHeartOutline}
        activeIcon={IoHeart}
        label="Notifications"
        dot={!generalNotifications}
      />
      {variant === "side" && <CreateIcon variant={variant} />}
      <NavItem variant={variant} to={profileTo} icon={avatar} label="Profile" />
    </>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Desktop sidebar */}
      <Box
        component="nav"
        aria-label="Primary"
        sx={{
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          px: { sm: 1.5, lg: 2.5 },
          py: 3,
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          zIndex: (t) => t.zIndex.appBar,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: { sm: "center", lg: "flex-start" },
            px: { lg: 1.75 },
            mb: 4,
          }}
        >
          <Box sx={{ display: { sm: "block", lg: "none" } }}>
            <Logo variant="mark" size="sm" />
          </Box>
          <Box sx={{ display: { sm: "none", lg: "block" } }}>
            <Logo size="sm" />
          </Box>
        </Box>
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          {primaryNav("side")}
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <Stack spacing={0.5}>
          <NavItem
            variant="side"
            to="/settings"
            icon={IoSettingsOutline}
            activeIcon={IoSettings}
            label="Settings"
          />
          <LogoutIcon variant="side" />
        </Stack>
      </Box>

      {/* Mobile top bar */}
      <Box
        component="header"
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          px: 2,
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: (t) => t.zIndex.appBar,
        }}
      >
        <Logo size="sm" />
        <Stack direction="row" spacing={0.5}>
          <NavItem
            variant="top"
            to="/messages"
            icon={IoChatbubbleEllipsesOutline}
            activeIcon={IoChatbubbleEllipses}
            label="Messages"
            badge={messagesNotification.length}
          />
          <NavItem
            variant="top"
            to="/settings"
            icon={IoSettingsOutline}
            activeIcon={IoSettings}
            label="Settings"
          />
          <LogoutIcon variant="top" />
        </Stack>
      </Box>

      {/* Mobile bottom bar */}
      <Box
        component="nav"
        aria-label="Primary mobile"
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          px: 1,
          alignItems: "center",
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid",
          borderColor: "divider",
          zIndex: (t) => t.zIndex.appBar,
        }}
      >
        {primaryNav("bottom")}
      </Box>

      {/* Content */}
      <Box
        component="main"
        sx={{
          ml: {
            xs: 0,
            sm: `${SIDEBAR_WIDTH.sm}px`,
            lg: `${SIDEBAR_WIDTH.lg}px`,
          },
          pt: { xs: "76px", sm: 4 },
          pb: { xs: "80px", sm: 6 },
          px: disablePadding ? 0 : { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            maxWidth: CONTENT_WIDTH[width] || CONTENT_WIDTH.wide,
            mx: "auto",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

/** Small helper for page titles. */
export const PageHeader = ({ title, subtitle, action }) => (
  <Stack
    direction="row"
    sx={{
      alignItems: "flex-end",
      justifyContent: "space-between",
      mb: 3,
      gap: 2,
    }}
  >
    <Box>
      <Typography variant="h2" component="h1">
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action}
  </Stack>
);
