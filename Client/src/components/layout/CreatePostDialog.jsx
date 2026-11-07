import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import {
  IoAddCircleOutline,
  IoAddCircle,
  IoClose,
  IoImagesOutline,
  IoLocationOutline,
  IoPricetagOutline,
} from "react-icons/io5";
import { Carousel } from "react-responsive-carousel";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Loader } from "../Loader";
import { NavItem } from "./NavItem";
import { api } from "../../utils/api";
import { emit, EVENTS } from "../../utils/events";

const MAX_FILES = 5;
const MAX_TAGS = 5;

export const CreateIcon = ({ variant = "side" }) => {
  const [open, setOpen] = useState(false);
  const [postFiles, setPostFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [tagsInput, setTagsInput] = useState("");
  const [postData, setPostData] = useState({ caption: "", location: "" });
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const { userData, getUser } = useContext(AuthContext);
  const toast = useToast();

  const notify = (text, sev = "error") => {
    if (sev === "success") toast.success(text);
    else toast.error(text);
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = null;
    if (files.length === 0) return;
    if (files.length > MAX_FILES) {
      notify(`You can select up to ${MAX_FILES} images`);
      return;
    }
    setPostFiles(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const reset = () => {
    setOpen(false);
    setTags([]);
    setTagsInput("");
    setPostData({ caption: "", location: "" });
    setPostFiles([]);
    previewImages.forEach((url) => URL.revokeObjectURL(url));
    setPreviewImages([]);
  };

  const addTag = () => {
    const tag = tagsInput.trim().replace(/^#/, "").replace(/\s+/g, "");
    if (!tag) return;
    if (tags.length >= MAX_TAGS || tags.includes(tag)) {
      setTagsInput("");
      return;
    }
    setTags((prev) => [...prev, tag]);
    setTagsInput("");
  };

  const handleTagKey = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSharePost = async () => {
    if (postFiles.length === 0) return notify("Pick at least one image");
    if (postData.caption.trim() === "") return notify("Please write a caption");

    setLoading(true);
    setUploadProgress({ current: 0, total: postFiles.length });
    try {
      const post_images = [];
      for (const [index, file] of postFiles.entries()) {
        setUploadProgress({ current: index + 1, total: postFiles.length });
        const form = new FormData();
        form.append("posts", file);
        const res = await api("/api/posts/upload-poston-cloudinary", {
          method: "POST",
          body: form,
        });
        if (!res.success) throw new Error(res.message || "Image upload failed");
        post_images.push({
          public_id: res.data.public_id,
          url: res.data.secure_url,
        });
      }
      const res = await api("/api/posts/create", {
        method: "POST",
        body: {
          ...postData,
          caption: postData.caption.trim(),
          tags,
          post_images,
        },
      });
      if (!res.success) throw new Error(res.message || "Something went wrong");
      notify("Post shared", "success");
      getUser();
      reset();
      emit(EVENTS.POST_CREATED, res.data);
    } catch (error) {
      notify(error.message || "Internal Server Error");
    } finally {
      setLoading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <>
      {loading && (
        <Loader
          overlay
          label={
            uploadProgress.total > 0
              ? `Uploading ${uploadProgress.current}/${uploadProgress.total}…`
              : "Sharing your post…"
          }
        />
      )}
      <NavItem
        variant={variant}
        icon={IoAddCircleOutline}
        activeIcon={IoAddCircle}
        label="Create"
        onClick={() => setOpen(true)}
      />

      <Dialog
        maxWidth="md"
        open={open}
        onClose={() => !loading && reset()}
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1.5,
          }}
        >
          Create new post
          <IconButton onClick={reset} aria-label="Close" disabled={loading}>
            <IoClose />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            {/* Media */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {previewImages.length === 0 ? (
                <Box
                  component="label"
                  htmlFor="postcreate"
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    gap: 1,
                    height: { xs: 240, md: 380 },
                    borderRadius: 4,
                    border: "2px dashed",
                    borderColor: "divider",
                    bgcolor: "background.default",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ color: "primary.main", mb: 1 }}>
                      <IoImagesOutline size={48} />
                    </Box>
                    <Typography variant="h6">Drag photos here</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      JPG or PNG, up to {MAX_FILES} images
                    </Typography>
                    <Button variant="contained" component="span">
                      Select from computer
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "background.default",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Carousel
                    showStatus={false}
                    showIndicators={previewImages.length > 1}
                    showThumbs={false}
                    infiniteLoop
                  >
                    {previewImages.map((src) => (
                      <Box
                        key={src}
                        component="img"
                        src={src}
                        alt=""
                        sx={{
                          height: { xs: 260, md: 380 },
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ))}
                  </Carousel>
                  <Box sx={{ p: 1, textAlign: "right" }}>
                    <Button size="small" component="label" htmlFor="postcreate">
                      Change photos
                    </Button>
                  </Box>
                </Box>
              )}
              <input
                id="postcreate"
                type="file"
                hidden
                multiple
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleFiles}
              />
            </Box>

            {/* Details */}
            <Stack
              spacing={2}
              sx={{ width: { xs: "100%", md: 320 }, flexShrink: 0 }}
            >
              <Stack
                sx={{ alignItems: "center" }}
                direction="row"
                spacing={1.5}
              >
                <Avatar src={userData.image} alt={userData.username} />
                <Typography variant="subtitle1">{userData.username}</Typography>
              </Stack>
              <TextField
                placeholder="Write a caption…"
                multiline
                minRows={3}
                maxRows={6}
                value={postData.caption}
                onChange={(e) =>
                  setPostData({ ...postData, caption: e.target.value })
                }
                slotProps={{ htmlInput: { maxLength: 200 } }}
                helperText={`${postData.caption.length}/200`}
              />
              <TextField
                placeholder="Add location"
                value={postData.location}
                onChange={(e) =>
                  setPostData({ ...postData, location: e.target.value })
                }
                slotProps={{
                  htmlInput: { maxLength: 50 },
                  input: {
                    startAdornment: (
                      <Box
                        sx={{ color: "text.secondary", mr: 1, display: "flex" }}
                      >
                        <IoLocationOutline />
                      </Box>
                    ),
                  },
                }}
              />
              <TextField
                placeholder={
                  tags.length >= MAX_TAGS
                    ? "Tag limit reached"
                    : "Add tags (press Enter)"
                }
                value={tagsInput}
                disabled={tags.length >= MAX_TAGS}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleTagKey}
                onBlur={addTag}
                slotProps={{
                  htmlInput: { maxLength: 25 },
                  input: {
                    startAdornment: (
                      <Box
                        sx={{ color: "text.secondary", mr: 1, display: "flex" }}
                      >
                        <IoPricetagOutline />
                      </Box>
                    ),
                  },
                }}
              />
              {tags.length > 0 && (
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={`#${tag}`}
                      color="primary"
                      variant="outlined"
                      onDelete={() => setTags(tags.filter((t) => t !== tag))}
                    />
                  ))}
                </Stack>
              )}
              <Box sx={{ flex: 1 }} />
              <Button
                variant="contained"
                size="large"
                onClick={handleSharePost}
                loading={loading}
              >
                Share
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
