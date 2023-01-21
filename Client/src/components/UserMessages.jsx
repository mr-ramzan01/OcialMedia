import { Avatar, Box, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";

export const UserMessages = ({ messages}) => {
  const { userData } = useContext(AuthContext);
  

  return (
    <>
      {messages.length > 0 ? (
        <Stack gap="10px">
          {messages.map((el) => (
            <Box
              marginLeft={userData._id === el.sender._id && "30%"}
              width="70%"
              key={el._id}
            >
              <Stack
                direction={
                  userData._id === el.sender._id ? "row-reverse" : "row"
                }
                gap="10px"
              >
                <Avatar
                  sx={{ h: "40px", w: "40px" }}
                  src={el.sender.image}
                  alt="userImage"
                />
                <Box
                  sx={{
                    p: "5px 8px",
                    borderRadius: "10px",
                    bgcolor: "#f1f1f1",
                  }}
                >
                  <Typography>{el.message}</Typography>
                  <Typography fontSize="12px" textAlign="right">
                    {moment(el.createdAt).format().substring(11, 16)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <img
            src="/Images/sendMessage.png"
            style={{ height: "100px", width: "100px" }}
            alt=""
          />
          <Typography>Type message to start the chat</Typography>
        </Stack>
      )}
    </>
  );
};
