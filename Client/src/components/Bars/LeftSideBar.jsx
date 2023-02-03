import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Logo } from "./LeftSideBar/Logo";
import { HomeIcon } from "./LeftSideBar/HomeIcon";
import { SearchIcon } from "./LeftSideBar/SearchIcon";
import { MessagesIcon } from "./LeftSideBar/MessagesIcon";
import { NotificationsIcon } from "./LeftSideBar/NotificationsIcon";
import { CreateIcon } from "./LeftSideBar/CreateIcon";
import { ProfileIcon } from "./LeftSideBar/ProfileIcon";
import { SettingsIcon } from "./LeftSideBar/SettingsIcon";
import { LogoutIcon } from "./LeftSideBar/LogoutIcon";
import { ExploreIcon } from "./LeftSideBar/ExploreIcon";
import { AuthContext } from "../../context/AuthContext";

export const LeftSideBar = () => {
  const { getUser, hasGeneralNotifications } = useContext(AuthContext);

  useEffect(() => {
    getUser();
    hasGeneralNotifications();
  }, []);

  return (
    <>
      <Box
        overflow={"scroll"}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
        display={{ xs: "none", sm: "block" }}
        padding="0 20px"
        width={{ xs: "40px", lg: "200px" }}
        bgcolor={"#fff"}
        borderRight="1px solid #d2d2d2"
        zIndex={"100"}
        color="#000000"
        height="100vh"
        position={"fixed"}
      >
        <Box>
          <Logo />
          <Stack direction={"column"}>
            <HomeIcon />
            <SearchIcon />
            <ExploreIcon />
            <MessagesIcon />
            <NotificationsIcon />
            <CreateIcon />
            <ProfileIcon />
            <SettingsIcon />
            <LogoutIcon />
          </Stack>
        </Box>
      </Box>
    </>
  );
};
