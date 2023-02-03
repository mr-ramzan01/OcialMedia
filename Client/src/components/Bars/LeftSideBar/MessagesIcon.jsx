import { Badge, Link, Typography } from "@mui/material";
import { useContext } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { AuthContext } from "../../../context/AuthContext";

export const MessagesIcon = () => {
    const {messagesNotification } = useContext(AuthContext);
  return (
    <>
      <Link
        href="/messages"
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
        <Badge
          sx={{
            "& .MuiBadge-badge": {
              color: "#fff",
              backgroundColor: "red",
            },
          }}
          badgeContent={messagesNotification.length}
          overlap="circular"
        >
          <AiOutlineMessage fontSize={"25px"} />
        </Badge>
        <Typography display={{ xs: "none", lg: "block" }} ml="15px">
          Messages
        </Typography>
      </Link>
    </>
  );
};
