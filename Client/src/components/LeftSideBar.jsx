import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { useContext, useEffect, useState } from "react";



import { AuthContext } from "../context/AuthContext";
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

export const LeftSideBar = () => {



  const { userData, getUser, hasGeneralNotifications } = useContext(AuthContext);
  



  const [state, setState] = useState({
    statusOpen: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, statusOpen } = state;
  
  useEffect(() => {
    getUser();
    // if(generalNotifications) {
      hasGeneralNotifications();
    // }
  }, []);



  const handleStatusClose = () => {
    setState({ ...state, statusOpen: false });
  };

  

  


  




  return (
    <>
      <Box
        overflow={"scroll"}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
        padding="0 20px"
        width="200px"
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
            <MessagesIcon />
            <NotificationsIcon />
            <CreateIcon />
            <ProfileIcon />
            <SettingsIcon />
            <LogoutIcon />
          </Stack>
        </Box>
      </Box>
      
      
      {/* <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={statusOpen}
        autoHideDuration={5000}
        TransitionComponent={Slide}
        onClose={handleStatusClose}
        key={vertical + horizontal}
      >
        <Alert
          icon={false}
          onClose={handleStatusClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar> */}
    </>
  );
};
