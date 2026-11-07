import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Loader } from "./Loader";
import { AllStories } from "./Story/AllStories";
import { api } from "../utils/api";
import { emit, EVENTS } from "../utils/events";
import { brand } from "../theme";

export const Stories = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [showStoryPreview, setShowStoryPreview] = useState(false);
  const [file, setFile] = useState();
  const { userData, userToken } = useContext(AuthContext);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadStory = (e) => {
    const files = e.target.files[0];
    setFile(files);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setShowStoryPreview(true);
  };

  const addStory = () => {
    setIsLoading(true);
    var data = new FormData();
    data.append("story", file);
    api("/api/stories/upload", { method: "POST", body: data, token: userToken })
      .then((res) => {
        if (res.success) {
          setShowStoryPreview(false);
          toast.success(res.message || "Story shared");
          emit(EVENTS.STORY_CREATED);
        } else {
          toast.error(res.message || "Something went wrong please try later");
        }
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong please try later");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleClose = () => {
    if (isLoading) return;
    setShowStoryPreview(false);
  };

  return (
    <>
      {isLoading && <Loader overlay label="Sharing your story…" />}
      <Card sx={{ mb: 3, px: 1.5, py: 1.25 }}>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            alignItems: "flex-start",
            overflowX: "auto",
            overflowY: "hidden",
            pb: 0.5,
          }}
        >
          {/* Your story */}
          <Stack
            component="label"
            htmlFor="storycreate"
            spacing={0.5}
            sx={{
              alignItems: "center",
              p: 0.5,
              width: 72,
              flexShrink: 0,
              cursor: "pointer",
              borderRadius: 3,
              transition: "background-color 150ms",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Box sx={{ position: "relative", p: "2.5px", lineHeight: 0 }}>
              <Avatar
                src={userData.image}
                alt={userData.username}
                sx={{
                  width: 54,
                  height: 54,
                  border: "2px solid",
                  borderColor: "divider",
                }}
              >
                {(userData.username || "?").slice(0, 1).toUpperCase()}
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "primary.contrastText",
                  background: brand.gradient,
                  border: "2px solid",
                  borderColor: "background.paper",
                }}
              >
                <IoAdd size={14} />
              </Box>
            </Box>
            <Typography
              variant="caption"
              noWrap
              sx={{ maxWidth: 72, color: "text.primary" }}
            >
              Your story
            </Typography>
          </Stack>
          <input
            id="storycreate"
            type="file"
            hidden
            accept="image/png, image/jpg, image/jpeg"
            onClick={(e) => (e.target.value = null)}
            onChange={handleUploadStory}
          />
          <AllStories />
        </Stack>
      </Card>

      <Dialog
        maxWidth="sm"
        fullWidth
        open={showStoryPreview}
        onClose={handleClose}
      >
        <DialogTitle>New story</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Box
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              component="img"
              src={previewImage || undefined}
              alt=""
              sx={{
                display: "block",
                width: "100%",
                height: { xs: 260, sm: 360 },
                objectFit: "contain",
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="text"
            color="inherit"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={addStory} loading={isLoading}>
            Share story
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
