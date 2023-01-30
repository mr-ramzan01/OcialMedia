import { Box, Stack } from "@mui/material";
import { Logo } from "./LeftSideBar/Logo";
import { LogoutIcon } from "./LeftSideBar/LogoutIcon";
import { MessagesIcon } from "./LeftSideBar/MessagesIcon";
import { SettingsIcon } from "./LeftSideBar/SettingsIcon";

export const Navbar = () => {
  return (
    <>
      <Box
        position="fixed"
        zIndex="1000"
        display={{xs: 'flex', sm: 'none'}}
        sx={{ background: "#fff" }}
        height="50px"
        width="100%"
        top='0'
        borderBottom='1px solid #d1d1d1'
      >
        <Stack p='0 20px 0 25px' alignItems='center' justifyContent='space-between' width='100%' direction='row'>
            <Logo />
            <Stack direction='row'>
            <MessagesIcon />
            <SettingsIcon />
            <LogoutIcon />
            </Stack>
        </Stack>
      </Box>
    </>
  );
};
