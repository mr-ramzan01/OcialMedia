import { Avatar, Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { ShowStory } from "./ShowStory";
import { brand } from "../../theme";

export const StoryIcons = ({ story }) => {
  const [showStory, setShowStory] = useState(false);
  const user = story.user_id || {};

  return (
    <>
      <Stack
        component="button"
        type="button"
        onClick={() => setShowStory(true)}
        spacing={0.5}
        aria-label={`View ${user.username}'s story`}
        sx={{
          alignItems: "center",
          border: 0,
          background: "none",
          p: 0.5,
          cursor: "pointer",
          font: "inherit",
          color: "inherit",
          borderRadius: 3,
          width: 72,
          flexShrink: 0,
          transition: "background-color 150ms",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Box
          sx={{
            background: brand.gradient,
            p: "2.5px",
            borderRadius: "50%",
            lineHeight: 0,
            transition: "transform 150ms",
            "button:hover &": { transform: "scale(1.04)" },
          }}
        >
          <Avatar
            src={user.image}
            alt={user.username}
            sx={{
              width: 54,
              height: 54,
              border: "2px solid",
              borderColor: "background.paper",
            }}
          >
            {(user.username || "?").slice(0, 1).toUpperCase()}
          </Avatar>
        </Box>
        <Typography
          variant="caption"
          noWrap
          sx={{ maxWidth: 72, color: "text.primary" }}
        >
          {user.username}
        </Typography>
      </Stack>
      {showStory && (
        <ShowStory
          image={story.image}
          showStory={showStory}
          setShowStory={setShowStory}
        />
      )}
    </>
  );
};
