import {
  Avatar,
  Dialog,
  DialogContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { ShowStory } from "./ShowStory";

export const StoryIcons = ({ story }) => {
  const [showStory, setShowStory] = useState(false);

  
  
  return (
    <>
      <Avatar
        onClick={() => setShowStory(true)}
        sx={{ border: "3px solid black", cursor: "pointer" }}
        src={story.user_id.image}
        alt="users"
      />
      <Typography
        color="#303030"
        fontSize="12px"
        fontFamily="Dancing Script"
        sx={{
          fontStyle: "italic",
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitLineClamp: 1,
          //   fontSize: "13px",
          display: "-webkit-box",
          //   width: "40px",
          WebkitBoxOrient: "vertical",
        }}
      >
        {story.user_id.username}
      </Typography>
      {showStory && <ShowStory image={story.image} showStory={showStory} setShowStory={setShowStory}/>}
    </>
  );
};
