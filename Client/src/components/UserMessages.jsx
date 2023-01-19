import { Avatar, Box, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import { useEffect } from "react";

export const UserMessages = ({ messages, currentSelectedChat }) => {
  const { userData, messagesNotification, setMessagesNotification,getAllNotifications, deleteNotifications } = useContext(AuthContext);
  useEffect(() => {
    if(messagesNotification) {
      let haveNotifications = false;
      for(let i=0; i<messagesNotification.length; i++) {
        if(messagesNotification[i].to === userData._id) {
          haveNotifications = true;
          break;
        }
      }
      if(haveNotifications) {
        {
          currentSelectedChat.users[0]._id === userData._id
            ?  deleteNotifications(currentSelectedChat.users[1]._id, currentSelectedChat.users[0]._id)
            :  deleteNotifications(currentSelectedChat.users[0]._id, currentSelectedChat.users[1]._id)
        }
      }
    }
  },[])

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
