import { Avatar, Link, Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const ProfileIcon = () => {
  const { userData } = useContext(AuthContext);
  return (
    <>
      <Link
        href={`/${userData.username}`}
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
        <Avatar src={userData.image} sx={{ width: "27px", height: "27px" }} />
        <Typography display={{ xs: "none", lg: "block" }} ml="15px">
          Profile
        </Typography>
      </Link>
    </>
  );
};
