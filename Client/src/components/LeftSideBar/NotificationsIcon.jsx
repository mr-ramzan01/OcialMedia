import { Badge, Link, Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BsSuitHeart } from "react-icons/bs";

export const NotificationsIcon = () => {
  const { generalNotifications } = useContext(AuthContext);

  return (
    <>
      <Link
        href="/notifications"
        sx={{
          "&:hover": {
            backgroundColor: "#fafafa",
            cursor: "pointer",
            borderRadius: "20px",
          },
        }}
        m="10px 0 8px 0"
        color={"#000"}
        p="10px"
        underline="none"
        display={"flex"}
        alignItems={"center"}
      >
        <Badge
          sx={{
            "& .MuiBadge-badge": {
              color: "#fff",
              backgroundColor: "red",
            },
          }}
          variant="dot"
          invisible={generalNotifications}
          overlap="circular"
        >
          <BsSuitHeart fontSize={"25px"} />
        </Badge>
        <Typography display={{xs: "none", lg: 'block' }} ml="15px">Notifications</Typography>
      </Link>
    </>
  );
};
