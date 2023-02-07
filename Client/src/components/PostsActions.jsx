import { Box, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  BsSuitHeartFill,
  BsSuitHeart,
  BsBookmark,
  BsBookmarkFill,
} from "react-icons/bs";
import { FaRegComment, FaAngry, FaLaughSquint, FaSadCry } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { AllReactionsonPost } from "./AllReactionsonPost";
import { SinglePost } from "./SinglePost";

export const PostsActions = ({ el }) => {
  const [actionsOpen, setActionsOpen] = useState(false);
  const [showSinglePostFromRecent, setShowSinglePostFromRecent] =
    useState(false);
  const [hasLiked, setHasLiked] = useState({ liked: false, type: "", id: "" });
  const [likeCount, setLikeCount] = useState(0);
  const { userData } = useContext(AuthContext);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handelCloseShowReactions = () => {
    setShowAllReactions(false);
  };

  useEffect(() => {
    hasLikedByUser();
    setLikeCount(el.likeCount);
    hasSaved();
  }, []);

  const handleLikes = (val) => {
    setActionsOpen(false);
    fetch(`apilikes/createlike`, {
      method: "POST",
      body: JSON.stringify({
        post_Id: el._id,
        like_type: val,
        like_by: userData._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLikeCount((prev) => prev + 1);
          hasLikedByUser();
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {});
  };

  const handleRemoveLikes = () => {
    fetch(`/api/likes/removelike/${hasLiked.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLikeCount((prev) => prev - 1);
          hasLikedByUser();
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {});
  };

  const hasLikedByUser = () => {
    fetch(`/api/likes/hasliked/${el._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setHasLiked({
            ...hasLiked,
            liked: true,
            type: res.like_type,
            id: res.id,
          });
        } else {
          setHasLiked({ liked: false, type: "", id: "" });
        }
      })
      .catch((err) => {
        console.log(err, "error");
        setHasLiked({ liked: false, type: "", id: "" });
      });
  };

  const hasSaved = () => {
    fetch(`/api/savedposts/issaved/${el._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setIsSaved(true);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const handleSaved = () => {
    fetch(`api/savedposts/save`, {
      method: "POST",
      body: JSON.stringify({ post_id: el._id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setIsSaved(true);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  return (
    <>
      {showAllReactions && (
        <AllReactionsonPost
          data={el}
          showAllReactions={showAllReactions}
          handelCloseShowReactions={handelCloseShowReactions}
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
        justifyContent="space-between"
        position={"relative"}
        gap="15px"
      >
        <Stack gap="15px" direction="row">
          {hasLiked.liked ? (
            <Box>
              {hasLiked.type === "love" && (
                <BsSuitHeartFill
                  onClick={handleRemoveLikes}
                  fontSize="25px"
                  color="red"
                  style={{ cursor: "pointer", padding: "10px 0" }}
                />
              )}
              {hasLiked.type === "funny" && (
                <FaLaughSquint
                  onClick={handleRemoveLikes}
                  fontSize="25px"
                  color="#eb9800"
                  style={{ cursor: "pointer", padding: "10px 0" }}
                />
              )}
              {hasLiked.type === "cry" && (
                <FaSadCry
                  onClick={handleRemoveLikes}
                  fontSize="25px"
                  color="#00baff"
                  style={{ cursor: "pointer", padding: "10px 0" }}
                />
              )}
              {hasLiked.type === "angry" && (
                <FaAngry
                  onClick={handleRemoveLikes}
                  fontSize="25px"
                  color="#c30909"
                  style={{ cursor: "pointer", padding: "10px 0" }}
                />
              )}
            </Box>
          ) : (
            <Box>
              <BsSuitHeart
                fontSize="25px"
                onMouseOver={() => setActionsOpen(true)}
                onMouseOut={() => setActionsOpen(false)}
                style={{ cursor: "pointer", padding: "10px 0" }}
              />
            </Box>
          )}
          <FaRegComment
            fontSize="25px"
            onClick={() => setShowSinglePostFromRecent(true)}
            style={{ cursor: "pointer", padding: "10px 0" }}
          />
        </Stack>
        <Box>
          {isSaved ? (
            <BsBookmarkFill
              fontSize="25px"
              style={{ cursor: "pointer", padding: "10px 0" }}
            />
          ) : (
            <BsBookmark
              fontSize="25px"
              style={{ cursor: "pointer", padding: "10px 0" }}
              onClick={handleSaved}
            />
          )}
        </Box>
        {actionsOpen && (
          <Stack
            onMouseOver={() => setActionsOpen(true)}
            onMouseOut={() => setActionsOpen(false)}
            gap="15px"
            borderRadius="10px"
            bgcolor={"#eee"}
            padding="10px 10px"
            direction="row"
            position="absolute"
            bottom="45px"
          >
            <BsSuitHeartFill
              fontSize="25px"
              onClick={() => handleLikes("love")}
              color="red"
              style={{ cursor: "pointer" }}
            />
            <FaLaughSquint
              fontSize="25px"
              onClick={() => handleLikes("funny")}
              color="#eb9800"
              style={{ cursor: "pointer" }}
            />
            <FaAngry
              fontSize="25px"
              onClick={() => handleLikes("angry")}
              color="#c30909"
              style={{ cursor: "pointer" }}
            />
            <FaSadCry
              fontSize="25px"
              onClick={() => handleLikes("cry")}
              color="#00baff"
              style={{ cursor: "pointer" }}
            />
          </Stack>
        )}
      </Stack>
      {likeCount === 0 ? (
        <Typography>No Reactions</Typography>
      ) : (
        <Typography>
          <Typography
            onClick={() => setShowAllReactions(true)}
            sx={{ cursor: "pointer" }}
            component="span"
          >
            {likeCount} Reactions
          </Typography>
        </Typography>
      )}
    </>
  );
};
