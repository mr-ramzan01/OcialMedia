import { Box } from "@mui/material";
import { Stack } from "@mui/system";
import { CreateIcon } from "./LeftSideBar/CreateIcon";
import { ExploreIcon } from "./LeftSideBar/ExploreIcon";
import { HomeIcon } from "./LeftSideBar/HomeIcon";
import { NotificationsIcon } from "./LeftSideBar/NotificationsIcon";
import { ProfileIcon } from "./LeftSideBar/ProfileIcon";
import { SearchIcon } from "./LeftSideBar/SearchIcon";

export const BottomBar = () => {
  return (
    <>
      <Box
        position="fixed"
        zIndex="1000"
        borderTop='1px solid #d1d1d1'
        display={{xs: 'flex', sm: 'none'}}
        sx={{ background: "#fff" }}
        height="50px"
        width="100%"
        bottom='0'
        alignItems='center'
      >
        <Stack direction='row' width='100%' justifyContent='space-around'>
            <HomeIcon />
            <SearchIcon />
            <ExploreIcon />
            <CreateIcon />
            <NotificationsIcon />
            <ProfileIcon />
        </Stack>
      </Box>
    </>
  );
};
