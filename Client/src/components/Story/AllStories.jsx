import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import { useEffect } from "react";
import { StoryIcons } from "./StoryIcons";

export const AllStories = () => {
  const [stories, setStories] = useState([]);
  useEffect(() => {
    getStories();
  }, []);

  const getStories = () => {
    fetch(`/api/stories/get`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setStories(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };
  return (
    <>
      {stories.length > 0 ? (
        <Stack direction="row" gap="10px">
          {stories.map((story) => (
            <Stack key={story._id} justifyContent="center" alignItems="center">
              <StoryIcons story={story} />
            </Stack>
          ))}
        </Stack>
      ) : (
        <Box
          height="100%"
          width="100%"
          alignItems="center"
          display="flex"
          justifyContent="center"
        >
          <Typography textAlign="center" color="#303030">
            No stories to show
          </Typography>
        </Box>
      )}
    </>
  );
};
