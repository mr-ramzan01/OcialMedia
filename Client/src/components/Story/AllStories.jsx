import { Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StoryIcons } from "./StoryIcons";
import { StoriesSkeleton } from "../common/Skeletons";
import { api } from "../../utils/api";
import { EVENTS } from "../../utils/events";
import { useAppEvent } from "../../hooks/useAppEvent";

export const AllStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchStories = useCallback(() => {
    return api("/api/stories/get")
      .then((res) => {
        if (mountedRef.current && res.success) setStories(res.data);
      })
      .catch((err) => console.log(err, "error"))
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchStories();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchStories]);

  // Refresh when the user shares a new story
  useAppEvent(EVENTS.STORY_CREATED, fetchStories);

  if (loading) {
    return <StoriesSkeleton count={4} />;
  }

  if (stories.length === 0) {
    return (
      <Typography variant="caption" sx={{ alignSelf: "center", pl: 1 }}>
        No stories from people you follow yet
      </Typography>
    );
  }

  return (
    <Stack sx={{ alignItems: "flex-start" }} direction="row" spacing={0.5}>
      {stories.map((story) => (
        <StoryIcons key={story._id} story={story} />
      ))}
    </Stack>
  );
};
