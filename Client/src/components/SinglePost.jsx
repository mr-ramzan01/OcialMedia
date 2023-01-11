import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Carousel } from "react-responsive-carousel";
import { useEffect } from "react";
import { Loader } from "./Loader";
import { BsSuitHeartFill, BsSuitHeart } from "react-icons/bs";
import { FaRegComment, FaAngry, FaLaughSquint, FaSadCry } from "react-icons/fa";
import { GrShareOption } from "react-icons/gr";
import moment from "moment";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

export const SinglePost = ({ data }) => {
  const [postOpen, setPostOpen] = useState(true);
  const { setShowSinglePost, userData, handleClick } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const commentRef = useRef(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState({ liked: false, type: "", id: "" });
  const [comment, setComment] = useState("");
  const [commentsData, setCommentsData] = useState([]);
  const [showReactions, setShowReactions] = useState(false);
  const [reactionsData, setReactionsData] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleClose = () => {
    setPostOpen(false);
    setShowSinglePost(false);
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const followRequest = () => {
    fetch(`/follows/followRequest`, {
      method: "POST",
      body: JSON.stringify({
        following_Id: userData._id,
        follower_Id: data.user_id._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        isFollowingUser();
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "following error");
      });
  };

  const unFollowRequest = () => {
    fetch(`/follows/unfollowRequest`, {
      method: "DELETE",
      body: JSON.stringify({
        following_Id: userData._id,
        follower_Id: data.user_id._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        isFollowingUser();
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "unfollow error");
      });
  };
  useEffect(() => {
    setIsLoading(true);
    getComments();
    hasLikedByUser();
    isFollowingUser();
  }, []);

  const isFollowingUser = () => {
    fetch(
      `/follows/isfollowing?followerID=${data.user_id._id}&followingID=${userData._id}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleComment = () => {
    commentRef.current.focus();
  };

  const handleLikes = (val) => {
    setActionsOpen(false);
    setIsLoading(true);
    fetch("/likes/createlike", {
      method: "POST",
      body: JSON.stringify({
        post_Id: data._id,
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
          handleClick(data._id);
          hasLikedByUser();
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRemoveLikes = () => {
    setIsLoading(true);
    fetch(`/likes/removelike/${hasLiked.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          handleClick(data._id);
          hasLikedByUser();
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hasLikedByUser = () => {
    fetch(`/likes/hasliked/${data._id}`)
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

  const getComments = () => {
    fetch(`/comments/get/${data._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setCommentsData(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const AddComments = () => {
    setIsLoading(true);
    fetch(`/comments/create`, {
      method: "POST",
      body: JSON.stringify({ post_Id: data._id, title: comment }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          getComments();
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setComment("");
        setIsLoading(false);
      });
  };

  const getLikesOnpost = () => {
    fetch(`/likes/get/${data._id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res, "res");
        if (res.success) {
          setReactionsData(res.data);
          setShowReactions(true);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const handleSClosehowReactions = () => {
    setShowReactions(false);
  };

  const handleSelectEmoji = (e) => {
    setComment((prev) => prev+e.emoji);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Dialog open={postOpen} onClose={handleClose} maxWidth="md">
        <Box sx={{ width: "880px" }}>
          <DialogContent>
            <Stack direction="row" height="100%">
              <Box overflow="hidden"  borderRadius="10px" width="50%">
                <Carousel
                  showStatus={false}
                  showIndicators={data.post_images.length > 1}
                  showThumbs={false}
                >
                  {data.post_images.map((el) => (
                    <img
                      key={el}
                      width="100%"
                      height="485px"
                      src={el.url}
                      alt=""
                    />
                  ))}
                </Carousel>
              </Box>
              <Box width="50%" height="485px">
                <Stack
                  height="100%"
                  padding="0 20px"
                  direction="column"
                  position='relative'
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                  >
                    <Avatar
                      sx={{ marginRight: "20px" }}
                      src={data.user_id.image}
                    />
                    <Stack direction="column">
                      <Stack direction="row" alignItems="center">
                        <Link
                          href={`/${data.user_id.username}`}
                          underline="none"
                          color="#000"
                        >
                          <Typography
                            fontFamily={"Dancing Script"}
                            fontSize="22px"
                            fontWeight="600"
                          >
                            {data.user_id.username}
                          </Typography>
                        </Link>
                        {userData._id !== data.user_id._id && (
                          <Box>
                            {isFollowing ? (
                              <Typography
                                marginLeft="15px"
                                color="#0066ff"
                                sx={{ cursor: "pointer" }}
                                onClick={unFollowRequest}
                              >
                                UnFollow
                              </Typography>
                            ) : (
                              <Typography
                                marginLeft="15px"
                                color="#0066ff"
                                sx={{ cursor: "pointer" }}
                                onClick={followRequest}
                              >
                                Follow
                              </Typography>
                            )}{" "}
                          </Box>
                        )}
                      </Stack>
                      <Typography fontSize="13px" fontWeight="400">
                        {data.location}
                        {data.location === "" ? "" : ", "}
                        {new Date(data.createdAt).getDate()}{" "}
                        {new Date(data.createdAt).toLocaleString("default", {
                          month: "long",
                        })}{" "}
                        {new Date(data.createdAt).getFullYear()}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box height="100%" position="relative">
                    <Stack mt="10px" direction="column">
                      <Typography>{data.caption}</Typography>
                      <Typography color="#0066ff">
                        {data.tags.map((el, ind) => (
                          <Typography
                            sx={{ cursor: "pointer" }}
                            component="span"
                            key={ind}
                          >
                            #{el}{" "}
                          </Typography>
                        ))}
                      </Typography>
                    </Stack>
                    <Box
                      overflow={"scroll"}
                      height="220px"
                      mt="10px"
                      p="0 10px"
                      border="1px solid #d2d2d2"
                      borderRadius="10px"
                      sx={{ "&::-webkit-scrollbar": { width: "0" } }}
                    >
                      <Box height="100%">
                        {commentsData.length > 0 ? (
                          <Box>
                            <Stack direction="column" gap="10px">
                              {commentsData.map((el) => (
                                <Stack
                                  direction="row"
                                  key={el._id}
                                  alignItems="center"
                                >
                                  <Avatar
                                    sx={{ marginRight: "20px" }}
                                    src={el.comment_by.image}
                                  />
                                  <Stack direction="column">
                                    <Link
                                      href={`/${el.comment_by.username}`}
                                      underline="none"
                                      color="#000"
                                    >
                                      <Typography
                                        fontFamily={"Dancing Script"}
                                        fontSize="22px"
                                        fontWeight="600"
                                      >
                                        {el.comment_by.username}
                                      </Typography>
                                    </Link>
                                    <Typography fontSize="15px">
                                      {el.title}
                                    </Typography>
                                    <Typography fontSize="10px">
                                      {moment(el.createdAt).fromNow()}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              ))}
                            </Stack>
                          </Box>
                        ) : (
                          <Box>
                            <Stack direction="column">
                              <Box
                                display="grid"
                                sx={{ placeContent: "center" }}
                              >
                                <img
                                  style={{ objectFit: "contain" }}
                                  height="180px"
                                  src="/Images/comments.png"
                                  alt="gd"
                                />
                              </Box>
                              <Typography
                                textAlign="center"
                                fontSize={"25px"}
                                color="#a1a1a1"
                                mt="-20px"
                              >
                                No Comments Yet
                              </Typography>
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    {actionsOpen && (
                      <Box
                        onMouseOver={() => setActionsOpen(true)}
                        onMouseOut={() => setActionsOpen(false)}
                        height="50px"
                        bottom="125px"
                        position="absolute"
                      >
                        <Stack
                          gap="15px"
                          borderRadius="10px"
                          bgcolor={"#eee"}
                          padding="10px 10px"
                          direction="row"
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
                      </Box>
                    )}
                    <Box position="absolute" width="100%" bottom="0">
                      <Box>
                        <Stack direction="row" gap="15px">
                          {hasLiked.liked ? (
                            <Box>
                              {hasLiked.type === "love" && (
                                <BsSuitHeartFill
                                  onClick={handleRemoveLikes}
                                  fontSize="25px"
                                  color="red"
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              {hasLiked.type === "funny" && (
                                <FaLaughSquint
                                  onClick={handleRemoveLikes}
                                  fontSize="25px"
                                  color="#eb9800"
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              {hasLiked.type === "cry" && (
                                <FaSadCry
                                  onClick={handleRemoveLikes}
                                  fontSize="25px"
                                  color="#00baff"
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              {hasLiked.type === "angry" && (
                                <FaAngry
                                  onClick={handleRemoveLikes}
                                  fontSize="25px"
                                  color="#c30909"
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                            </Box>
                          ) : (
                            <BsSuitHeart
                              fontSize="25px"
                              onMouseOver={() => setActionsOpen(true)}
                              onMouseOut={() => setActionsOpen(false)}
                              style={{ cursor: "pointer" }}
                            />
                          )}

                          <FaRegComment
                            fontSize="25px"
                            onClick={handleComment}
                            style={{ cursor: "pointer" }}
                          />
                          <GrShareOption
                            fontSize="25px"
                            style={{ cursor: "pointer" }}
                          />
                        </Stack>
                        <Box marginTop="10px">
                          <Typography>
                            <Typography
                              component="span"
                              sx={{ cursor: "pointer" }}
                              onClick={getLikesOnpost}
                            >
                              {data.likeCount} Reactions
                            </Typography>
                          </Typography>
                        </Box>
                      </Box>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        onChange={handleChange}
                        value={comment}
                        inputRef={commentRef}
                        placeholder="Add a comment"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                              border: "none",
                            },
                            "&.Mui-focused fieldset": {
                              border: "none",
                            },
                          },
                          bgcolor: "transparent",
                          borderRadius: "5px",
                          border: "1px solid #d2d2d2",
                        }}
                        type="text"
                        id="comment"
                        autoComplete="off"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography
                                sx={{ cursor: "pointer", color: "#000" }}
                                onClick={AddComments}
                              >
                                Post
                              </Typography>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="end">
                              <MdOutlineEmojiEmotions onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{marginLeft: '-10px', marginRight:'10px', fontSize:'25px', cursor: 'pointer'}} />
                            </InputAdornment>
                          ),
                          style: {
                            height: "40px",
                          },
                        }}
                      />
                    </Box>
                    <Box position="absolute" bottom="60px">
                        {showEmojiPicker && (
                          <EmojiPicker
                            onEmojiClick={(e) => handleSelectEmoji(e)}
                            theme="light"
                            width={250}
                            height={300}
                            emojiStyle="google"
                          />
                        )}
                      </Box>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
        </Box>
      </Dialog>
      <Dialog open={showReactions} onClose={handleSClosehowReactions}>
        <Box
          maxHeight="200px"
          overflow="scroll"
          sx={{ "&::-webkit-scrollbar": { width: "0" } }}
        >
          {reactionsData.length > 0 ? (
            <Stack direction="column" gap="10px" padding="15px">
              {reactionsData.map((el) => (
                <Stack
                  key={el._id}
                  direction="row"
                  alignItems="center"
                  gap="15px"
                >
                  <Avatar src={el.like_by.image} />
                  <Link
                    href={`/${el.like_by.username}`}
                    underline="none"
                    color="#000"
                  >
                    <Typography
                      fontFamily={"Dancing Script"}
                      fontSize="22px"
                      fontWeight="600"
                    >
                      {el.like_by.username}
                    </Typography>
                  </Link>
                  <Box>
                    {el.like_type === "love" && (
                      <BsSuitHeartFill
                        onClick={handleRemoveLikes}
                        fontSize="25px"
                        color="red"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {el.like_type === "funny" && (
                      <FaLaughSquint
                        onClick={handleRemoveLikes}
                        fontSize="25px"
                        color="#eb9800"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {el.like_type === "cry" && (
                      <FaSadCry
                        onClick={handleRemoveLikes}
                        fontSize="25px"
                        color="#00baff"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {el.like_type === "angry" && (
                      <FaAngry
                        onClick={handleRemoveLikes}
                        fontSize="25px"
                        color="#c30909"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Box
              height="100%"
              display="flex"
              p="20px 0"
              alignItems="center"
              justifyContent="center"
            >
              <Typography>No Reactions to Show</Typography>
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
};
