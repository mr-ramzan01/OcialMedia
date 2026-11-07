import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BsSuitHeart } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import {
  IoClose,
  IoEllipsisHorizontal,
  IoLocationOutline,
} from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { EmptyState } from "./common/EmptyState";
import { ReactionIcon, ReactionPicker } from "./common/ReactionIcon";
import { CommentSkeleton } from "./common/Skeletons";
import { SmartImage } from "./common/SmartImage";
import { UserListItem, UserName } from "./common/UserListItem";
import { fromNow } from "../utils/time";
import { api } from "../utils/api";
import { emit, EVENTS } from "../utils/events";

export const SinglePost = ({
  id,
  setShowSinglePostFromRecent,
  setShowSinglePostFromNotifications,
}) => {
  const [postOpen, setPostOpen] = useState(true);
  const { setShowSinglePost, userData } = useContext(AuthContext);
  const toast = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [reacting, setReacting] = useState(false);
  const commentRef = useRef(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState({ liked: false, type: "", id: "" });
  const [comment, setComment] = useState("");
  const [commentsData, setCommentsData] = useState([]);
  const [showReactions, setShowReactions] = useState(false);
  const [reactionsData, setReactionsData] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [data, setData] = useState({});
  const [likeCount, setLikeCount] = useState(0);
  const closeTimer = useRef(null);

  // Owner "more" menu + delete confirmation
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleClose = () => {
    setPostOpen(false);
    setShowSinglePost(false);
    if (setShowSinglePostFromRecent) {
      setShowSinglePostFromRecent(false);
    }
    if (setShowSinglePostFromNotifications) {
      setShowSinglePostFromNotifications(false);
    }
  };

  const isFollowingUser = useCallback(
    (authorId) => {
      if (!authorId || authorId === userData._id) {
        setIsFollowing(false);
        return Promise.resolve();
      }
      return api(
        `/api/follows/isfollowing?followerID=${authorId}&followingID=${userData._id}`,
      )
        .then((res) => setIsFollowing(Boolean(res.success)))
        .catch((err) => console.log(err, "error"));
    },
    [userData._id],
  );

  const hasLikedByUser = useCallback((postId) => {
    return api(`/api/likes/hasliked/${postId}`)
      .then((res) => {
        if (res.success) {
          setHasLiked({ liked: true, type: res.like_type, id: res.id });
        } else {
          setHasLiked({ liked: false, type: "", id: "" });
        }
      })
      .catch((err) => {
        console.log(err, "error");
        setHasLiked({ liked: false, type: "", id: "" });
      });
  }, []);

  const getComments = useCallback((postId) => {
    return api(`/api/comments/get/${postId}`)
      .then((res) => {
        if (res.success) setCommentsData(res.data);
      })
      .catch((err) => console.log(err, "error"))
      .finally(() => setCommentsLoading(false));
  }, []);

  // Load the post and everything shown with it
  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setCommentsLoading(true);
    api(`/api/posts/single/${id}`)
      .then(async (res) => {
        if (ignore) return;
        if (!res.success || !res.data) {
          toast.error(res.message || "Post not found");
          handleClose();
          return;
        }
        setData(res.data);
        setLikeCount(res.data.likeCount);
        await Promise.all([
          getComments(res.data._id),
          hasLikedByUser(res.data._id),
          isFollowingUser(res.data.user_id && res.data.user_id._id),
        ]);
      })
      .catch((err) => console.log(err, "error"))
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
    // handleClose / toast are stable enough for this one-shot load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getComments, hasLikedByUser, isFollowingUser]);

  // Clear the reaction-picker hover timer on unmount
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openPicker = () => {
    clearTimeout(closeTimer.current);
    setActionsOpen(true);
  };
  const closePicker = () => {
    closeTimer.current = setTimeout(() => setActionsOpen(false), 250);
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const followRequest = () => {
    setFollowLoading(true);
    api("/api/follows/followRequest", {
      method: "POST",
      body: { following_Id: userData._id, follower_Id: data.user_id._id },
    })
      .then((res) => {
        if (!res.success) toast.error(res.message || "Something went wrong");
        return isFollowingUser(data.user_id._id);
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err, "following error");
      })
      .finally(() => setFollowLoading(false));
  };

  const unFollowRequest = () => {
    setFollowLoading(true);
    api("/api/follows/unfollowRequest", {
      method: "DELETE",
      body: { following_Id: userData._id, follower_Id: data.user_id._id },
    })
      .then((res) => {
        if (!res.success) toast.error(res.message || "Something went wrong");
        return isFollowingUser(data.user_id._id);
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err, "unfollow error");
      })
      .finally(() => setFollowLoading(false));
  };

  const handleComment = () => {
    if (commentRef.current) commentRef.current.focus();
  };

  const handleLikes = (val) => {
    setActionsOpen(false);
    setReacting(true);
    api("/api/likes/createlike", {
      method: "POST",
      body: { post_Id: data._id, like_type: val },
    })
      .then((res) => {
        if (res.success) {
          setLikeCount((prev) => prev + 1);
          hasLikedByUser(data._id);
        } else {
          toast.error(res.message || "Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong");
      })
      .finally(() => setReacting(false));
  };

  const handleRemoveLikes = () => {
    setReacting(true);
    api(`/api/likes/removelike/${hasLiked.id}`, { method: "DELETE" })
      .then((res) => {
        if (res.success) {
          setLikeCount((prev) => Math.max(0, prev - 1));
          hasLikedByUser(data._id);
        } else {
          toast.error(res.message || "Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong");
      })
      .finally(() => setReacting(false));
  };

  const AddComments = () => {
    const text = comment.trim();
    if (text === "") return;
    setShowEmojiPicker(false);
    setCommenting(true);
    api("/api/comments/create", {
      method: "POST",
      body: { post_Id: data._id, title: text },
    })
      .then((res) => {
        if (res.success) return getComments(data._id);
        toast.error(res.message || "Something went wrong");
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong");
      })
      .finally(() => {
        setComment("");
        setCommenting(false);
      });
  };

  const getLikesOnpost = () => {
    api(`/api/likes/get/${data._id}`)
      .then((res) => {
        if (res.success) {
          setReactionsData(res.data);
          setShowReactions(true);
        }
      })
      .catch((err) => console.log(err, "error"));
  };

  const handelCloseShowReactions = () => {
    setShowReactions(false);
  };

  const handleSelectEmoji = (e) => {
    setComment((prev) => prev + e.emoji);
  };

  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);
  const askDelete = () => {
    closeMenu();
    setConfirmOpen(true);
  };

  const deletePost = async () => {
    setDeleting(true);
    try {
      const res = await api(`/api/posts/${data._id}`, { method: "DELETE" });
      if (!res.success) throw new Error(res.message || "Something went wrong");
      setConfirmOpen(false);
      toast.success("Post deleted");
      emit(EVENTS.POST_DELETED, { id: data._id });
      handleClose();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const author = data.user_id || {};
  const isOwner = Boolean(
    userData && userData._id && author._id && userData._id === author._id,
  );
  const showSkeleton = isLoading || !data._id;

  return (
    <>
      <Dialog
        maxWidth="md"
        open={postOpen}
        onClose={handleClose}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              m: { xs: 1.5, sm: 4 },
              width: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" },
              maxHeight: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" },
            },
          },
        }}
      >
        {showSkeleton ? (
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ height: { md: 600 }, minHeight: 0 }}
            aria-busy
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: { xs: "100%", md: "55%" },
                height: { xs: 260, sm: 360, md: "100%" },
                flexShrink: 0,
              }}
            />
            <Stack sx={{ flex: 1, minWidth: 0, p: 2 }} spacing={2}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  animation="wave"
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="40%" height={18} animation="wave" />
                  <Skeleton width="25%" height={14} animation="wave" />
                </Box>
                <IconButton
                  onClick={handleClose}
                  aria-label="Close"
                  size="small"
                >
                  <IoClose size={22} />
                </IconButton>
              </Stack>
              <Skeleton width="90%" height={16} animation="wave" />
              <CommentSkeleton count={4} />
            </Stack>
          </Stack>
        ) : (
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ height: { md: 600 }, minHeight: 0 }}
          >
            {/* Media */}
            <Box
              sx={{
                width: { xs: "100%", md: "55%" },
                flexShrink: 0,
                bgcolor: "background.default",
                display: "flex",
                alignItems: "center",
                borderRight: { md: "1px solid" },
                borderBottom: { xs: "1px solid", md: 0 },
                borderColor: "divider",
                "& .carousel-root, & .carousel.carousel-slider": {
                  width: "100%",
                },
              }}
            >
              <Carousel
                showStatus={false}
                showIndicators={data.post_images.length > 1}
                showThumbs={false}
                infiniteLoop
              >
                {data.post_images.map((el) => (
                  <SmartImage
                    key={el.public_id || el.url}
                    src={el.url}
                    alt={data.caption}
                    loading="eager"
                    sx={{
                      width: "100%",
                      height: { xs: 260, sm: 360, md: 600 },
                    }}
                  />
                ))}
              </Carousel>
            </Box>

            {/* Details */}
            <Stack
              sx={{ flex: 1, minWidth: 0, minHeight: 0, position: "relative" }}
            >
              {/* Header */}
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Avatar
                  component={RouterLink}
                  to={`/${author.username}`}
                  src={author.image}
                  alt={author.username}
                  sx={{ width: 40, height: 40 }}
                >
                  {(author.username || "?").slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack
                    sx={{ alignItems: "center" }}
                    direction="row"
                    spacing={1}
                  >
                    <UserName user={author} sx={{ lineHeight: 1.2 }} />
                    {userData._id !== author._id && (
                      <Button
                        size="small"
                        variant="text"
                        onClick={isFollowing ? unFollowRequest : followRequest}
                        loading={followLoading}
                        sx={{ minHeight: 26, px: 1 }}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    )}
                  </Stack>
                  <Stack
                    sx={{ alignItems: "center" }}
                    direction="row"
                    spacing={0.75}
                  >
                    {data.location && (
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.25,
                        }}
                      >
                        <IoLocationOutline /> {data.location}
                      </Typography>
                    )}
                    {data.location && (
                      <Typography variant="caption">·</Typography>
                    )}
                    <Typography variant="caption" noWrap>
                      {fromNow(data.createdAt)}
                    </Typography>
                  </Stack>
                </Box>
                {isOwner && (
                  <>
                    <IconButton
                      size="small"
                      onClick={openMenu}
                      aria-label="More options"
                      aria-haspopup="menu"
                      aria-controls={
                        menuAnchor ? `single-post-menu-${data._id}` : undefined
                      }
                      aria-expanded={menuAnchor ? "true" : undefined}
                    >
                      <IoEllipsisHorizontal size={20} />
                    </IconButton>
                    <Menu
                      id={`single-post-menu-${data._id}`}
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor)}
                      onClose={closeMenu}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      <MenuItem
                        onClick={askDelete}
                        sx={{ color: "error.main" }}
                      >
                        Delete post
                      </MenuItem>
                    </Menu>
                  </>
                )}
                <IconButton
                  onClick={handleClose}
                  aria-label="Close"
                  size="small"
                >
                  <IoClose size={22} />
                </IconButton>
              </Stack>

              {/* Caption + comments (scrollable) */}
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  maxHeight: { xs: 240, md: "none" },
                  overflowY: "auto",
                  px: 2,
                  py: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ mr: 0.75, fontSize: "inherit" }}
                  >
                    {author.username}
                  </Typography>
                  {data.caption}
                </Typography>
                {data.tags.length > 0 && (
                  <Stack
                    direction="row"
                    sx={{ flexWrap: "wrap", gap: 0.75, mt: 1 }}
                  >
                    {data.tags.map((tag, i) => (
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

                {commentsLoading && commentsData.length === 0 ? (
                  <Box sx={{ mt: 2 }}>
                    <CommentSkeleton count={3} />
                  </Box>
                ) : commentsData.length > 0 ? (
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    {commentsData.map((el) => (
                      <Stack
                        sx={{ alignItems: "flex-start" }}
                        direction="row"
                        spacing={1.5}
                        key={el._id}
                      >
                        <Avatar
                          component={RouterLink}
                          to={`/${el.comment_by.username}`}
                          src={el.comment_by.image}
                          alt={el.comment_by.username}
                          sx={{ width: 32, height: 32, fontSize: "0.85rem" }}
                        >
                          {(el.comment_by.username || "?")
                            .slice(0, 1)
                            .toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ wordBreak: "break-word" }}
                          >
                            <UserName
                              user={el.comment_by}
                              sx={{ mr: 0.75, fontSize: "inherit" }}
                            />
                            {el.title}
                          </Typography>
                          <Typography variant="caption">
                            {fromNow(el.createdAt)}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <EmptyState
                    compact
                    image="/Images/comments.png"
                    title="No comments yet"
                    subtitle="Start the conversation."
                    sx={{ py: 2 }}
                  />
                )}
              </Box>

              {/* Actions + composer */}
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderColor: "divider",
                  px: 2,
                  pt: 1,
                  pb: 1.5,
                  position: "relative",
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: "center", ml: -1 }}
                >
                  <Box
                    onMouseEnter={openPicker}
                    onMouseLeave={closePicker}
                    sx={{ position: "relative" }}
                  >
                    {hasLiked.liked ? (
                      <Tooltip title="Remove reaction" arrow>
                        <span>
                          <IconButton
                            onClick={handleRemoveLikes}
                            aria-label="Remove reaction"
                            disabled={reacting}
                          >
                            <ReactionIcon type={hasLiked.type} size={24} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    ) : (
                      <IconButton
                        onClick={() => handleLikes("love")}
                        aria-label="React"
                        disabled={reacting}
                      >
                        <BsSuitHeart size={22} />
                      </IconButton>
                    )}
                    {actionsOpen && !hasLiked.liked && (
                      <ReactionPicker
                        onPick={handleLikes}
                        sx={{
                          position: "absolute",
                          bottom: "100%",
                          left: 0,
                          mb: 0.5,
                          zIndex: 2,
                        }}
                      />
                    )}
                  </Box>
                  <IconButton onClick={handleComment} aria-label="Comment">
                    <FaRegComment size={21} />
                  </IconButton>
                </Stack>
                <Typography
                  variant="subtitle2"
                  component="button"
                  type="button"
                  onClick={getLikesOnpost}
                  sx={{
                    border: 0,
                    background: "none",
                    p: 0,
                    cursor: "pointer",
                    font: "inherit",
                    fontWeight: 600,
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {likeCount === 0
                    ? "No reactions yet"
                    : `${likeCount} ${likeCount === 1 ? "reaction" : "reactions"}`}
                </Typography>

                {showEmojiPicker && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 16,
                      right: 16,
                      bottom: "100%",
                      zIndex: 3,
                      mb: 1,
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: 4,
                    }}
                  >
                    <EmojiPicker
                      onEmojiClick={(e) => handleSelectEmoji(e)}
                      theme="light"
                      width={"100%"}
                      height={310}
                      emojiStyle="google"
                    />
                  </Box>
                )}
                <TextField
                  fullWidth
                  size="small"
                  onChange={handleChange}
                  value={comment}
                  inputRef={commentRef}
                  placeholder="Add a comment…"
                  type="text"
                  id="comment"
                  autoComplete="off"
                  sx={{ mt: 1 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            size="small"
                            edge="start"
                            aria-label={
                              showEmojiPicker
                                ? "Hide emoji picker"
                                : "Add emoji"
                            }
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            sx={{
                              color: showEmojiPicker
                                ? "primary.main"
                                : "text.secondary",
                            }}
                          >
                            {showEmojiPicker ? (
                              <IoClose size={22} />
                            ) : (
                              <MdOutlineEmojiEmotions size={22} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            variant="text"
                            onClick={AddComments}
                            disabled={comment.trim() === ""}
                            loading={commenting}
                            sx={{ minHeight: 28, px: 1 }}
                          >
                            Post
                          </Button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        )}
      </Dialog>

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

      <Dialog
        maxWidth="xs"
        open={showReactions}
        onClose={handelCloseShowReactions}
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
          Reactions
          <IconButton onClick={handelCloseShowReactions} aria-label="Close">
            <IoClose />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 1, maxHeight: 420 }}>
          {reactionsData.length > 0 ? (
            <Stack spacing={0.25}>
              {reactionsData.map((el) => (
                <UserListItem
                  key={el._id}
                  user={el.like_by}
                  trailing={<ReactionIcon type={el.like_type} />}
                />
              ))}
            </Stack>
          ) : (
            <EmptyState
              compact
              title="No reactions yet"
              subtitle="Be the first to react to this post."
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
