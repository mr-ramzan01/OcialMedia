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
import { RxCross2 } from "react-icons/rx";
import { root_url } from "../utils/url";

export const SinglePost = ({
  id,
  setShowSinglePostFromRecent,
  setShowSinglePostFromNotifications,
}) => {
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
  const [data, setData] = useState({});
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${root_url}/api/posts/single/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setLikeCount(res.data.likeCount);
        }
        getComments(res.data._id);
        hasLikedByUser(res.data._id);
        isFollowingUser(res.data.user_id._id);
      })
      .catch((err) => {
        console.log(err, "error");
      });
  }, []);

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

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const followRequest = () => {
    fetch(`${root_url}/api/follows/followRequest`, {
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
        isFollowingUser(data.user_id._id);
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "following error");
      });
  };

  const unFollowRequest = () => {
    fetch(`${root_url}/api/follows/unfollowRequest`, {
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
        isFollowingUser(data.user_id._id);
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "unfollow error");
      });
  };

  const isFollowingUser = (id) => {
    fetch(
      `${root_url}/api/follows/isfollowing?followerID=${id}&followingID=${userData._id}`
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
    fetch(`${root_url}/api/likes/createlike`, {
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
          setLikeCount((prev) => prev + 1);
          hasLikedByUser(data._id);
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
    fetch(`${root_url}/api/likes/removelike/${hasLiked.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          handleClick(data._id);
          setLikeCount((prev) => prev - 1);
          hasLikedByUser(data._id);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hasLikedByUser = (id) => {
    fetch(`${root_url}/api/likes/hasliked/${id}`)
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

  const getComments = (id) => {
    fetch(`${root_url}/api/comments/get/${id}`)
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
    if (comment === "") return;
    setShowEmojiPicker(false);
    setIsLoading(true);
    fetch(`${root_url}/api/comments/create`, {
      method: "POST",
      body: JSON.stringify({ post_Id: data._id, title: comment }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          getComments(data._id);
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
    fetch(`${root_url}/api/likes/get/${data._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setReactionsData(res.data);
          setShowReactions(true);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const handelCloseShowReactions = () => {
    setShowReactions(false);
  };

  const handleSelectEmoji = (e) => {
    setComment((prev) => prev + e.emoji);
  };

  return (
    <>
      <Dialog open={postOpen} onClose={handleClose} maxWidth="md">
        {isLoading && <Loader />}
        {data._id && (
          <Box
            padding="0"
            margin="0"
            sx={{ width: { xs: "340px", sm: "500px", md: "880px" } }}
          >
            <DialogContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                gap={{ xs: "10px", md: "0" }}
                height="100%"
              >
                <Box
                  overflow="hidden"
                  border="1px solid #d1d1d1"
                  borderRadius="10px"
                  width={{ xs: "100%", md: "50%" }}
                >
                  <Carousel
                    showStatus={false}
                    showIndicators={data.post_images.length > 1}
                    showThumbs={false}
                  >
                    {data.post_images.map((el) => (
                      <Avatar
                        key={el}
                        sx={{
                          width: "100%",
                          height: { xs: "200px", sm: "300px", md: "485px" },
                          borderRadius: "0",
                        }}
                        src={el.url}
                        alt=""
                      />
                    ))}
                  </Carousel>
                </Box>
                <Box
                  width={{ xs: "100%", md: "50%" }}
                  height={{ xs: "300px", md: "485px" }}
                >
                  <Stack
                    height="100%"
                    padding={{ xs: "0", md: "0 20px" }}
                    direction="column"
                    position="relative"
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      display={{ xs: "none", md: "flex" }}
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
                    <Box height="100%" width="100%" position="relative">
                      <Stack mt={{ xs: "0", md: "10px" }} direction="column">
                        <Typography
                          fontSize={{ xs: "10px", sm: "13px", md: "15px" }}
                        >
                          {data.caption}
                        </Typography>
                        <Typography color="#0066ff">
                          {data.tags.map((el, ind) => (
                            <Typography
                              height="17px"
                              fontSize={{ xs: "10px", sm: "13px", md: "15px" }}
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
                        height={{ xs: "110px", md: "210px" }}
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
                                          fontSize={{
                                            xs: "15px",
                                            sm: "18px",
                                            md: "22px",
                                          }}
                                          fontWeight="600"
                                        >
                                          {el.comment_by.username}
                                        </Typography>
                                      </Link>
                                      <Typography
                                        fontSize={{
                                          xs: "10px",
                                          sm: "13px",
                                          md: "15px",
                                        }}
                                      >
                                        {el.title}
                                      </Typography>
                                      <Typography
                                        fontSize={{
                                          xs: "7px",
                                          sm: "8px",
                                          md: "10px",
                                        }}
                                      >
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
                                  display={{ xs: "none", md: "grid" }}
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
                                  mt={{ xs: "0", md: "-20px" }}
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
                          <Stack height="25px" direction="row" gap="15px">
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
                                {likeCount} Reactions
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
                                  sx={{ cursor: "pointer", color: "#676767" }}
                                  onClick={AddComments}
                                >
                                  Post
                                </Typography>
                              </InputAdornment>
                            ),
                            startAdornment: (
                              <InputAdornment position="end">
                                {showEmojiPicker ? (
                                  <RxCross2
                                    onClick={() => setShowEmojiPicker(false)}
                                    style={{
                                      marginLeft: "-10px",
                                      marginRight: "10px",
                                      fontSize: "25px",
                                      cursor: "pointer",
                                    }}
                                  />
                                ) : (
                                  <MdOutlineEmojiEmotions
                                    onClick={() => setShowEmojiPicker(true)}
                                    style={{
                                      marginLeft: "-10px",
                                      marginRight: "10px",
                                      fontSize: "25px",
                                      cursor: "pointer",
                                    }}
                                  />
                                )}
                              </InputAdornment>
                            ),
                            style: {
                              height: "40px",
                            },
                          }}
                        />
                      </Box>
                      <Box position="absolute" width="100%" bottom="60px">
                        {showEmojiPicker && (
                          <EmojiPicker
                            onEmojiClick={(e) => handleSelectEmoji(e)}
                            theme="light"
                            width={"100%"}
                            height={310}
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
        )}
      </Dialog>
      <Dialog open={showReactions} onClose={handelCloseShowReactions}>
        <Box
          maxHeight="200px"
          overflow="scroll"
          mt="20px"
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
                        fontSize="25px"
                        color="red"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {el.like_type === "funny" && (
                      <FaLaughSquint
                        fontSize="25px"
                        color="#eb9800"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {el.like_type === "cry" && (
                      <FaSadCry
                        fontSize="25px"
                        color="#00baff"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {el.like_type === "angry" && (
                      <FaAngry
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
              p="0 5px"
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
