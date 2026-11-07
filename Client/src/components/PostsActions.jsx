import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BsBookmark, BsBookmarkFill, BsSuitHeart } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { AllReactionsonPost } from "./AllReactionsonPost";
import { SinglePost } from "./SinglePost";
import { ReactionIcon, ReactionPicker } from "./common/ReactionIcon";
import { useToast } from "../context/ToastContext";
import { api } from "../utils/api";

/**
 * Reaction / comment / save row under a post.
 */
export const PostsActions = ({ el }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showSinglePostFromRecent, setShowSinglePostFromRecent] =
    useState(false);
  const [hasLiked, setHasLiked] = useState({ liked: false, type: "", id: "" });
  const [likeCount, setLikeCount] = useState(0);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const closeTimer = useRef(null);
  const toast = useToast();

  const openPicker = () => {
    clearTimeout(closeTimer.current);
    setPickerOpen(true);
  };
  const closePicker = () => {
    closeTimer.current = setTimeout(() => setPickerOpen(false), 250);
  };

  const hasLikedByUser = useCallback(() => {
    api(`/api/likes/hasliked/${el._id}`)
      .then((res) => {
        setHasLiked(
          res.success
            ? { liked: true, type: res.like_type, id: res.id }
            : { liked: false, type: "", id: "" },
        );
      })
      .catch(() => setHasLiked({ liked: false, type: "", id: "" }));
  }, [el._id]);

  const hasSaved = useCallback(() => {
    api(`/api/savedposts/issaved/${el._id}`)
      .then((res) => setIsSaved(Boolean(res.success)))
      .catch((err) => console.log(err, "error"));
  }, [el._id]);

  useEffect(() => {
    setLikeCount(el.likeCount);
    hasLikedByUser();
    hasSaved();
    return () => clearTimeout(closeTimer.current);
  }, [el._id, el.likeCount, hasLikedByUser, hasSaved]);

  const handleLikes = (type) => {
    setPickerOpen(false);
    api("/api/likes/createlike", {
      method: "POST",
      body: { post_Id: el._id, like_type: type },
    })
      .then((res) => {
        if (res.success) {
          setLikeCount((prev) => prev + 1);
          hasLikedByUser();
        } else {
          toast.error(res.message || "Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong");
      });
  };

  const handleRemoveLikes = () => {
    api(`/api/likes/removelike/${hasLiked.id}`, { method: "DELETE" })
      .then((res) => {
        if (res.success) {
          setLikeCount((prev) => Math.max(0, prev - 1));
          hasLikedByUser();
        } else {
          toast.error(res.message || "Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong");
      });
  };

  const toggleSaved = () => {
    const req = isSaved
      ? api(`/api/savedposts/unsave/${el._id}`, { method: "DELETE" })
      : api("/api/savedposts/save", {
          method: "POST",
          body: { post_id: el._id },
        });
    req
      .then((res) => {
        if (res.success) setIsSaved(!isSaved);
        else toast.error(res.message || "Something went wrong");
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      {showAllReactions && (
        <AllReactionsonPost
          data={el}
          showAllReactions={showAllReactions}
          handelCloseShowReactions={() => setShowAllReactions(false)}
        />
      )}
      {showSinglePostFromRecent && (
        <SinglePost
          id={el._id}
          setShowSinglePostFromRecent={setShowSinglePostFromRecent}
        />
      )}

      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          ml: -1,
        }}
      >
        <Stack sx={{ alignItems: "center" }} direction="row" spacing={0.5}>
          <Box
            onMouseEnter={openPicker}
            onMouseLeave={closePicker}
            sx={{ position: "relative" }}
          >
            {hasLiked.liked ? (
              <Tooltip title="Remove reaction" arrow>
                <IconButton
                  onClick={handleRemoveLikes}
                  aria-label="Remove reaction"
                >
                  <ReactionIcon type={hasLiked.type} size={24} />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton
                onClick={() => handleLikes("love")}
                aria-label="React"
              >
                <BsSuitHeart size={22} />
              </IconButton>
            )}
            {pickerOpen && !hasLiked.liked && (
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
          <IconButton
            onClick={() => setShowSinglePostFromRecent(true)}
            aria-label="Comments"
          >
            <FaRegComment size={21} />
          </IconButton>
        </Stack>
        <Tooltip title={isSaved ? "Unsave" : "Save"} arrow>
          <IconButton
            onClick={toggleSaved}
            aria-label="Save post"
            sx={{ color: isSaved ? "primary.main" : "inherit" }}
          >
            {isSaved ? <BsBookmarkFill size={20} /> : <BsBookmark size={20} />}
          </IconButton>
        </Tooltip>
      </Stack>

      <Typography
        variant="subtitle2"
        component="button"
        type="button"
        onClick={() => likeCount > 0 && setShowAllReactions(true)}
        sx={{
          border: 0,
          background: "none",
          p: 0,
          cursor: likeCount > 0 ? "pointer" : "default",
          font: "inherit",
          fontWeight: 600,
          color: "text.secondary",
        }}
      >
        {likeCount === 0
          ? "No reactions yet"
          : `${likeCount} ${likeCount === 1 ? "reaction" : "reactions"}`}
      </Typography>
    </>
  );
};
