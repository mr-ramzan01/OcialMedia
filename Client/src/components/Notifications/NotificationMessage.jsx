import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { timeAgo } from "../../utils/time";

export const NotificationMessage = ({ el, type, likeCount, commentCount }) => {
  const DateConvert = ({ date }) => (
    <Typography
      component="span"
      variant="caption"
      sx={{ ml: 0.75, whiteSpace: "nowrap" }}
    >
      · {timeAgo(date)}
    </Typography>
  );
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: "center", px: 1, py: 1.25, minWidth: 0, flex: 1 }}
    >
      <Avatar
        component={RouterLink}
        to={`/${el.from.username}`}
        src={el.from.image}
        alt={el.from.username}
        sx={{ textDecoration: "none" }}
      >
        {(el.from.username || "?").slice(0, 1).toUpperCase()}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          <Typography
            component={RouterLink}
            to={`/${el.from.username}`}
            variant="subtitle1"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              "&:hover": { color: "primary.main" },
            }}
          >
            {el.from.username}
          </Typography>{" "}
          {type === "like" &&
            (likeCount > 1
              ? `and ${likeCount - 1} others reacted to your post`
              : "reacted to your post")}
          {type === "follow" && "started following you"}
          {type === "comment" &&
            (commentCount > 1
              ? `and ${commentCount} others commented on your post`
              : "commented on your post")}
          <DateConvert date={el.createdAt} />
        </Typography>
      </Box>
      {type === "follow" && (
        <Button
          component={RouterLink}
          to={`/${el.from.username}`}
          variant="outlined"
          size="small"
          sx={{ flexShrink: 0 }}
        >
          View
        </Button>
      )}
    </Stack>
  );
};
