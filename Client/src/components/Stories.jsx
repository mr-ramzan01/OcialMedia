import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useContext, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import { ShowAlert } from "./Alert";
import { Loader } from "./Loader";
import { AllStories } from "./Story/AllStories";
import { root_url } from "../utils/url";

export const Stories = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [showStoryPreview, setShowStoryPreview] = useState(false);
  const [file, setFile] = useState();
  const { userData, userToken } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadStory = (e) => {
    const files = e.target.files[0];
    setFile(files);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setShowStoryPreview(true);
  };

  const addStory = () => {
    setShowStoryPreview(false);
    setIsLoading(true);
    var data = new FormData();
    data.append("story", file);
    fetch(`${root_url}/api/stories/upload`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${userToken}`
      },
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setAlertMessage(res.message);
          setSeverity("success");
          setShowAlert(true);
        }
      })
      .catch((err) => {
        console.log(err, "error");
        setAlertMessage("Something went wrong please try later");
        setSeverity("error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleClose = () => {
    setShowStoryPreview(false);
  };

  return (
    <>
      {isLoading && <Loader />}
      {showAlert && (
        <ShowAlert
          message={alertMessage}
          severity={severity}
          alertOpen={showAlert}
          setAlertOpen={setShowAlert}
        />
      )}
      <Box height="80px" mb="20px">
        <Paper
          sx={{ height: "100%", display: "flex", border: "1px solid #d1d1d1" }}
        >
          <Stack direction="row" width="83px">
            <Grid width="100%" height="100%">
              <InputLabel
                htmlFor="storycreate"
                sx={{
                  margin: "auto",
                  color: "#fff",
                  textAlign: "center",
                  "&:hover": { cursor: "pointer" },
                }}
              >
                <Box
                  position="relative"
                  height="80px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Avatar
                    src={userData.image}
                    alt=""
                    sx={{
                      position: "absolute",
                      width: "50px",
                      height: "50px",
                      left: "12px",
                    }}
                  />
                  <AiFillPlusCircle
                    style={{
                      background: "#fff",
                      borderRadius: "50%",
                      left: "27px",
                      position: "absolute",
                      fontSize: "45px",
                      color: "#000",
                    }}
                  />
                </Box>
              </InputLabel>
              <TextField
                onClick={(e) => (e.target.value = null)}
                onChange={handleUploadStory}
                id="storycreate"
                type="file"
                sx={{ display: "none" }}
                inputProps={{
                  accept: "image/png, image/jpg, image/jpeg",
                }}
              ></TextField>
            </Grid>
          </Stack>
          <Box
            padding="0 10px"
            display="flex"
            alignItems="center"
            sx={{
              overflow: "scroll",
              "::-webkit-scrollbar": {
                width: "5px",
                height: "5px",
              },
              "::-webkit-scrollbar-thumb": {
                background: "#d1d1d1",
                borderRadius: "10px",
              },
            }}
            width="calc(100% - 83px)"
          >
            <AllStories />
          </Box>
        </Paper>
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={showStoryPreview}
        onClose={handleClose}
      >
        <DialogActions
          sx={{ padding: "10px 20px 5px 0", borderBottom: "1px solid gray" }}
        >
          <Typography
            onClick={handleClose}
            color="gray"
            sx={{ cursor: "pointer", mr: "20px" }}
          >
            Cancel
          </Typography>
          <Typography
            onClick={addStory}
            color="#0066ff"
            sx={{ cursor: "pointer" }}
          >
            Add Story
          </Typography>
        </DialogActions>
        <DialogContent>
          <Avatar
            sx={{
              objectFit: "contain",
              border: "1px solid #d1d1d1",
              borderRadius: "5px",
              width: "calc(100% - 5px)",
              height: { xs: "240px", sm: "300px" },
            }}
            src={previewImage}
            alt=""
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
