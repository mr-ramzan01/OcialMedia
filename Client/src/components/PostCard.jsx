import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoEllipsisHorizontal, IoLocationOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { PostsActions } from "./PostsActions";
import { RecentPostsComments } from "./RecentPostsComments";
import { SmartImage } from "./common/SmartImage";
import { timeAgo } from "../utils/time";
import { api } from "../utils/api";
import { emit, EVENTS } from "../utils/events";

/**
 * Feed post: header, media carousel, actions, caption, recent comments.
 */
export const PostCard = ({ post }) => {
  const author = post.user_id || {};
  const { userData } = useContext(AuthContext);
  const toast = useToast();
  const isOwner = Boolean(
    userData && userData._id && userData._id === author._id,
  );

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const askDelete = () => {
    closeMenu();
    setConfirmOpen(true);
  };

  const deletePost = async () => {
    setDeleting(true);
    try {
      const res = await api(`/api/posts/${post._id}`, { method: "DELETE" });
      if (!res.success) throw new Error(res.message || "Something went wrong");
      setConfirmOpen(false);
      toast.success("Post deleted");
      emit(EVENTS.POST_DELETED, { id: post._id });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card component="article" sx={{ overflow: "hidden" }}>
      {/* Header */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", px: 2, py: 1.5 }}
      >
        <Avatar
          component={RouterLink}
          to={`/${author.username}`}
          src={author.image}
          alt={author.username}
          sx={{ width: 42, height: 42 }}
        >
          {(author.username || "?").slice(0, 1).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            component={RouterLink}
            to={`/${author.username}`}
            variant="subtitle1"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              display: "block",
              lineHeight: 1.2,
              "&:hover": { color: "primary.main" },
            }}
          >
            {author.username}
          </Typography>
          <Stack sx={{ alignItems: "center" }} direction="row" spacing={0.75}>
            {post.location && (
              <Typography
                variant="caption"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.25 }}
              >
                <IoLocationOutline /> {post.location}
              </Typography>
            )}
            {post.location && <Typography variant="caption">·</Typography>}
            <Typography variant="caption">{timeAgo(post.createdAt)}</Typography>
          </Stack>
        </Box>
        {isOwner && (
          <>
            <IconButton
              size="small"
              onClick={openMenu}
              aria-label="More options"
              aria-haspopup="menu"
              aria-controls={menuAnchor ? `post-menu-${post._id}` : undefined}
              aria-expanded={menuAnchor ? "true" : undefined}
            >
              <IoEllipsisHorizontal size={20} />
            </IconButton>
            <Menu
              id={`post-menu-${post._id}`}
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={closeMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={askDelete} sx={{ color: "error.main" }}>
                Delete post
              </MenuItem>
            </Menu>
          </>
        )}
      </Stack>

      {/* Media */}
      <Box sx={{ bgcolor: "background.default" }}>
        <Carousel
          showStatus={false}
          showIndicators={post.post_images.length > 1}
          showThumbs={false}
          infiniteLoop
        >
          {post.post_images.map((img) => (
            <SmartImage
              key={img.public_id || img.url}
              src={img.url}
              alt={post.caption}
              sx={{ width: "100%", height: { xs: 340, sm: 420, md: 520 } }}
            />
          ))}
        </Carousel>
      </Box>

      {/* Body */}
      <Box sx={{ px: 2, pt: 1, pb: 2 }}>
        <PostsActions el={post} />
        <Typography sx={{ mt: 1 }}>
          <Typography component="span" variant="subtitle1" sx={{ mr: 0.75 }}>
            {author.username}
          </Typography>
          {post.caption}
        </Typography>
        {post.tags.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 1 }}>
            {post.tags.map((tag, i) => (
              <Chip
                key={`${tag}-${i}`}
                label={`#${tag}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: 24 }}
              />
            ))}
          </Stack>
        )}
        <RecentPostsComments el={post} />
      </Box>

      {/* Delete confirmation */}
      {isOwner && (
        <Dialog
          maxWidth="xs"
          fullWidth
          open={confirmOpen}
          onClose={() => !deleting && setConfirmOpen(false)}
        >
          <DialogTitle>Delete this post?</DialogTitle>
          <DialogContent>
            <DialogContentText>This can't be undone.</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => setConfirmOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={deletePost}
              loading={deleting}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};
