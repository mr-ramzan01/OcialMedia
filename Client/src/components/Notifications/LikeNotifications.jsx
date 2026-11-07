import { Box, ButtonBase, Stack } from "@mui/material";
import React, { useState } from "react";
import { NotificationMessage } from "./NotificationMessage";
import { SmartImage } from "../common/SmartImage";
import { SinglePost } from "../SinglePost";

export const LikeNotifications = ({ el }) => {
  const [showSinglePostFromNotifications, setShowSinglePostFromNotifications] =
    useState(false);
  return (
    <Box>
      {showSinglePostFromNotifications && (
        <SinglePost
          id={el.like_id.post_Id._id}
          setShowSinglePostFromNotifications={
            setShowSinglePostFromNotifications
          }
        />
      )}
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", pr: 1 }}>
        <NotificationMessage
          el={el}
          type={el.type}
          likeCount={el.like_id.post_Id.likeCount}
        />
        <ButtonBase
          aria-label="Open post"
          onClick={() => setShowSinglePostFromNotifications(true)}
          sx={{
            flexShrink: 0,
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <SmartImage
            src={el.like_id.post_Id.post_images[0].url}
            alt=""
            ratio="1 / 1"
            sx={{ width: 44, height: 44, borderRadius: 2 }}
          />
        </ButtonBase>
      </Stack>
    </Box>
  );
};
