import { Box, Grid, InputLabel, Paper, TextField } from "@mui/material";
import React from "react";

export const Stories = () => {
  const handleUploadStory = (e) => {
    const file = e.target.files[0];
    console.log(file, "file");

    var data = new FormData();
    data.append("story", file);
    // setLoading(true);
    fetch(`/stories/upload`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res, "upload story");
        if (res.success) {
          // setMessage(res.message);
          // setSeverity('success');
          // setState({ ...state, open: true });
          // getUser();
        }
      })
      .catch((err) => {
        console.log(err, "error");
        // setMessage("Something went wrong please try later");
        // setSeverity('error');
        // setState({ ...state, open: true });
      })
      .finally(() => {
        // setLoading(false);
        // setProfileOpen(false);
      });
  };
  return (
    <Box height="60px" mb="20px">
      <Paper
        border="1px solid #d1d1d1"
        sx={{ height: "100%", display: "flex" }}
      >
        <Box border="1px solid blue" width="70px">
          <Grid>
            <InputLabel
              htmlFor="postcreate"
              sx={{
                width: "180px",
                margin: "auto",
                color: "#fff",
                borderRadius: "5px",
                padding: "10px 0",
                bgcolor: "#0099ff",
                textAlign: "center",
                "&:hover": { cursor: "pointer" },
              }}
            >
              Upload from library
            </InputLabel>
            <TextField
              onChange={handleUploadStory}
              id="postcreate"
              type="file"
              sx={{ display: "none" }}
              inputProps={{
                accept: "image/png, image/jpg, image/jpeg",
                multiple: true,
              }}
            ></TextField>
          </Grid>
        </Box>
        <Box border="1px solid green" width="100%">
          others
        </Box>
      </Paper>
    </Box>
  );
};
