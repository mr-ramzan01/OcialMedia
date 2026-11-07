import { Box, Dialog, IconButton, LinearProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { SmartImage } from "../common/SmartImage";

const STORY_DURATION_MS = 5000;
const TICK_MS = 50;

export const ShowStory = ({ image, showStory, setShowStory }) => {
  const [progress, setProgress] = useState(0);
  const handleClose = () => {
    setShowStory(false);
  };

  // Progress bar: advances to 100% over STORY_DURATION_MS, then closes the story
  useEffect(() => {
    if (!showStory) return undefined;
    const step = 100 / (STORY_DURATION_MS / TICK_MS);
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + step));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [showStory]);

  useEffect(() => {
    if (progress >= 100) setShowStory(false);
  }, [progress, setShowStory]);

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={showStory}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.9) },
        },
        paper: { sx: { bgcolor: "text.primary", overflow: "hidden" } },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color="primary"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            height: 4,
            borderRadius: 0,
            bgcolor: (theme) => alpha(theme.palette.common.white, 0.3),
          }}
        />
        <IconButton
          onClick={handleClose}
          aria-label="Close story"
          sx={{
            position: "absolute",
            top: 12,
            right: 8,
            zIndex: 1,
            color: "common.white",
            bgcolor: (theme) => alpha(theme.palette.common.black, 0.3),
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.common.black, 0.5),
            },
          }}
        >
          <IoClose size={22} />
        </IconButton>
        <SmartImage
          src={image}
          alt=""
          loading="eager"
          sx={{
            width: "100%",
            height: "70vh",
            minHeight: 260,
            bgcolor: "text.primary",
          }}
          imgSx={{ objectFit: "contain" }}
        />
      </Box>
    </Dialog>
  );
};
