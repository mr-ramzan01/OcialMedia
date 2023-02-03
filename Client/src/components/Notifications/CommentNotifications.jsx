import { Avatar, Box, Stack } from "@mui/material";
import React, { useState } from "react";
import { NotificationMessage } from "./NotificationMessage";
import { SinglePost } from "../SinglePost";

export const CommentNotifications = ({ el }) => {
  const [showSinglePostFromNotifications, setShowSinglePostFromNotifications] =
    useState(false);
  return (
    <Box>
      {showSinglePostFromNotifications && (
        <SinglePost
          id={el.comment_id.post_Id._id}
          setShowSinglePostFromNotifications={
            setShowSinglePostFromNotifications
          }
        />
      )}
      <Stack
        direction="row"
        key={el._id}
        alignItems="center"
        gap="10px"
        justifyContent="space-between"
      >
        <NotificationMessage
          el={el}
          type={el.type}
          commentCount={el.comment_id.post_Id.commentCount - 1}
        />
        <Avatar
          onClick={() => setShowSinglePostFromNotifications(true)}
          sx={{ borderRadius: "0", cursor: "pointer" }}
          src={el.comment_id.post_Id.post_images[0].url}
          alt=""
        />
      </Stack>
    </Box>
  );
};
