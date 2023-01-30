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
            backgroundColor:{xs: '', lg: "#fafafa"},
            cursor: "pointer",
            borderRadius: "20px",
          },
        }}
        m={{xs: '0', sm: "10px 0 8px 0"}}
        color={"#000"}
        p="10px"
        underline="none"
        display={{xs: 'block', lg: 'flex'}}
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
