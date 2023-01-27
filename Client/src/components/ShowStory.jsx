import { Avatar, Dialog, DialogContent, LinearProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
let interval = undefined;

export const ShowStory = ({ image, showStory, setShowStory}) => {
    const [progress, setProgress] = useState(0);
    const [running, setRunning] = useState(true);
    const handleClose = () => {
        setShowStory(false);
      };
      useEffect(() => {
        if (running) {
          interval = setInterval(() => {
            setProgress((prev) => prev + 1);
          }, 100);
        } else {
          clearInterval(interval);
        }
      }, [running]);

      useEffect(() => {
        if (progress === 100) {
          setRunning(false);
          setShowStory(false);
          clearInterval(interval);
        }
      }, [progress]);
    
  return (
    <Dialog fullWidth maxWidth="sm" open={showStory} onClose={handleClose}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            "& .MuiLinearProgress-bar1Determinate": {
              backgroundColor: "#000",
            },
            background: '#d8d8d8'
          }}
        />
        <DialogContent>
          <Avatar
            style={{
              objectFit: "contain",
              border: "1px solid #d1d1d1",
              borderRadius: "5px",
              width: "calc(100% - 5px)",
              height: "300px",
            }}
            src={image}
            alt=""
          />
        </DialogContent>
      </Dialog>
  )
}
