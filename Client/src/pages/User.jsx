import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LeftSideBar } from "../components/LeftSideBar";
import { Loader } from "../components/Loader";
import { HiRectangleStack } from "react-icons/hi2";
import { AuthContext } from "../context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { SinglePost } from "../components/SinglePost";
import { SavedPosts } from "../components/SavedPosts";

export const User = () => {
  const { username } = useParams();
  const [oneUserData, setOneUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loginUserData, setLoginUserData] = useState({});
  const [userNotFound, setUserNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [unfollowOpen, setUnfollowOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const { showSinglePost, postData, handleClick } = useContext(AuthContext);
  const [selected, setSelected] = useState("post");
  const [page, setPage] = useState(1);
  const [totalPostsLength, setTotalPostsLength] = useState(0);
  const navigate = useNavigate();

  const followRequest = () => {
    fetch(`/follows/followRequest`, {
      method: "POST",
      body: JSON.stringify({
        following_Id: loginUserData._id,
        follower_Id: oneUserData._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res, 'follow response');
        fetchData();
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "following error");
      });
  };

  const getPosts = () => {
    setPage((prev) => prev + 1);
    fetch(`/posts/${username}?page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUserPosts(() => [...userPosts, ...res.data]);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const fetchData = () => {
    setIsLoading(true);
    setPage(1);
    Promise.all([
      fetch("/users/loggedInUser"),
      fetch(`/users/${username}`),
      fetch(`/posts/${username}?page=${1}`),
    ])
      .then((res) => {
        return Promise.all(
          res.map(function (res) {
            return res.json();
          })
        );
      })
      .then((res) => {
        if (res[0].success) {
          setLoginUserData(res[0].data);
        }
        if (res[2].success) {
          setUserPosts(res[2].data);
          setTotalPostsLength(res[2].totalPosts);
          setPage((prev) => prev + 1);
        }
        if (res[1].success) {
          setOneUserData(res[1].data);
        } else {
          setUserNotFound(true);
        }

        fetch(
          `/follows/isfollowing?followerID=${res[1].data._id}&followingID=${res[0].data._id}`
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.success) {
              setIsFollowing(true);
            } else {
              setIsFollowing(false);
            }
          });
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFollow = () => {
    if (!isFollowing) {
      followRequest();
    } else {
      setUnfollowOpen(true);
    }
  };
  
  const handleUnFollow = () => {
    fetch(`/follows/unfollowRequest`, {
      method: "DELETE",
      body: JSON.stringify({
        following_Id: loginUserData._id,
        follower_Id: oneUserData._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res , 'unfollow response');
        fetchData();
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "unfollow error");
      });
    setUnfollowOpen(false);
  };

  const handleClose = () => {
    setUnfollowOpen(false);
    setFollowersOpen(false);
    setFollowingOpen(false);
  };

  const getFollowers = () => {
    fetch(`/follows/getFollowers?userID=${oneUserData._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setFollowersData(res.data);
          setFollowersOpen(true);
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "error");
      });
  };

  const getFollowing = () => {
    fetch(`/follows/getFollowing?userID=${oneUserData._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setFollowingData(res.data);
          setFollowingOpen(true);
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "error");
      });
  };

  const handleMessageClick = (user_id) => {
    fetch(`/chats/create`, {
      method: "POST",
      body: JSON.stringify({ userId: user_id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {})
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        navigate("/messages");
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (userNotFound) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Stack direction="column">
          <img src="/Images/404user.gif" alt="404 user" />
          <Typography
            textAlign="center"
            variant="h3"
            fontFamily={"'Dancing Script', cursive"}
          >
            User Not Found
          </Typography>
        </Stack>
      </Box>
    );
  }
  return (
    <>
      {showSinglePost && <SinglePost data={postData} />}
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box
          marginLeft="240px"
          width="100%"
          display="grid"
          justifyContent="center"
        >
          <Box width="900px">
            <Stack direction="column">
              <Stack sx={{ marginTop: "30px" }} direction="row">
                <Grid
                  display="grid"
                  sx={{ placeContent: "center" }}
                  width="35%"
                >
                  <Avatar
                    sx={{
                      height: "150px",
                      width: "150px",
                    }}
                    src={oneUserData.image}
                    alt={oneUserData.full_name}
                  />
                </Grid>
                <Grid
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                  width="65%"
                >
                  <Stack direction="row" gap="15px" alignItems="center">
                    <Typography
                      fontFamily="'Petrona', serif"
                      fontStyle={"italic"}
                      fontWeight={400}
                      fontSize="25px"
                      color="#303030"
                      mr="20px"
                    >
                      {oneUserData.username}
                    </Typography>
                    {loginUserData.username === oneUserData.username ? (
                      <Link underline="none" href="/settings">
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#d3d3d3",
                            color: "#000",
                            letterSpacing: "0px",
                            padding: "5px 10px",
                            boxShadow: "none",
                            "&:hover": {
                              backgroundColor: "#bbbbbb",
                              boxShadow: "none",
                            },
                          }}
                        >
                          Edit Profile
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          onClick={handleFollow}
                          sx={{
                            backgroundColor: "#129ffd",
                            letterSpacing: "0px",
                            padding: "5px 10px",
                            boxShadow: "none",
                            "&:hover": {
                              backgroundColor: "#0066ff",
                              boxShadow: "none",
                            },
                            width: "100px",
                          }}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#eee",
                            color: "#000",
                            letterSpacing: "0px",
                            padding: "5px 10px",
                            boxShadow: "none",
                            "&:hover": {
                              backgroundColor: "#d3d3d3",
                              boxShadow: "none",
                            },
                          }}
                          onClick={() => handleMessageClick(oneUserData._id)}
                        >
                          Message
                        </Button>
                      </>
                    )}
                  </Stack>
                  <Stack direction="row" gap="30px" alignItems="center">
                    <Stack direction="row" alignItems="center">
                      <Typography mr="5px" fontSize="18px" marginBottom="2px">
                        {oneUserData.postsCount}
                      </Typography>
                      <Typography color="#363638" fontSize="15px">
                        posts
                      </Typography>
                    </Stack>
                    <Stack
                      onClick={getFollowers}
                      sx={{ cursor: "pointer" }}
                      direction="row"
                      alignItems="center"
                    >
                      <Typography mr="5px" fontSize="18px" marginBottom="2px">
                        {oneUserData.followerCount}
                      </Typography>
                      <Typography color="#363638" fontSize="15px">
                        followers
                      </Typography>
                    </Stack>
                    <Stack
                      onClick={getFollowing}
                      sx={{ cursor: "pointer" }}
                      direction="row"
                      alignItems="center"
                    >
                      <Typography mr="5px" fontSize="18px" marginBottom="2px">
                        {oneUserData.followingCount}
                      </Typography>
                      <Typography color="#363638" fontSize="15px">
                        following
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box width="50%" marginTop="20px">
                    <Typography fontSize={"20px"}>
                      {oneUserData.full_name}
                    </Typography>
                  </Box>
                  <Box width="50%" marginTop="-10px">
                    <Typography>{oneUserData.bio}</Typography>
                  </Box>
                </Grid>
              </Stack>
              <Stack row="column" mt="30px">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  gap="20px"
                  borderTop="1px solid gray"
                >
                  <Typography
                    borderTop={
                      selected === "post" ? "2px solid #000" : "2px solid #fff"
                    }
                    onClick={() => setSelected("post")}
                    p="10px 0"
                    textAlign="center"
                    fontSize={"22px"}
                    sx={{ cursor: "pointer" }}
                  >
                    Post
                  </Typography>
                  <Typography
                    borderTop={
                      selected === "saved" ? "2px solid #000" : "2px solid #fff"
                    }
                    onClick={() => setSelected("saved")}
                    p="10px 0"
                    textAlign="center"
                    fontSize={"22px"}
                    sx={{ cursor: "pointer" }}
                  >
                    Saved
                  </Typography>
                </Stack>
                {selected === "post" ? (
                  <Box padding="0 30px 30px">
                    {userPosts.length > 0 ? (
                      <InfiniteScroll
                        dataLength={userPosts.length}
                        className={"scrollDiv"}
                        next={getPosts}
                        hasMore={totalPostsLength !== userPosts.length}
                        loader={
                          <div
                            style={{
                              display: "grid",
                              placeContent: "center",
                              padding: "30px 0",
                            }}
                          >
                            <CircularProgress sx={{ color: "#bbbbbb" }} />
                          </div>
                        }
                      >
                        <Grid
                          display="grid"
                          gridTemplateColumns={"repeat(3,1fr)"}
                          gap="10px"
                        >
                          {userPosts.map((el) => (
                            <Box
                              key={el._id}
                              height="280px"
                              onClick={() => handleClick(el._id)}
                              sx={{
                                cursor: "pointer",
                                position: "relative",
                                "&:hover": {
                                  opacity: "0.5",
                                },
                              }}
                            >
                              {el.post_images.length > 1 && (
                                <HiRectangleStack
                                  style={{
                                    color: "#ffffff",
                                    fontSize: "30px",
                                    top: "2px",
                                    position: "absolute",
                                    right: "0",
                                    transform: "rotate(90deg)",
                                  }}
                                />
                              )}
                              <img
                                height="100%"
                                width="100%"
                                src={el.post_images[0].url}
                                loading="lazy"
                                alt=""
                              />
                            </Box>
                          ))}
                        </Grid>
                      </InfiniteScroll>
                    ) : (
                      <Box
                        padding="30px 0"
                        display="grid"
                        sx={{ placeContent: "center" }}
                      >
                        <Box>
                          <Box width="200px" height="200px">
                            <img
                              width="100%"
                              height="100%"
                              style={{ objectFit: "contain" }}
                              src="/Images/nopost.png"
                              alt=""
                            />
                          </Box>
                          <Typography
                            textAlign="center"
                            fontSize={"30px"}
                            color="#a1a1a1"
                          >
                            No Posts Yet
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box padding="0 30px 30px">
                    <SavedPosts id={oneUserData._id} />
                  </Box>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Stack>

      {/* It will show unfollow dialog */}
      <Dialog onClose={handleClose} open={unfollowOpen}>
        <DialogTitle
          onClick={handleUnFollow}
          sx={{ fontSize: "15px", "&:hover": { cursor: "pointer" } }}
        >
          UnFollow
        </DialogTitle>
      </Dialog>

      {/* It will show all follower of the user */}
      <Dialog onClose={handleClose} open={followersOpen}>
        <Box
          sx={{
            maxHeight: "60vh",
            width: "30vw",
            overflowY: "scroll",
            borderRadius: "5px",
            "::-webkit-scrollbar": {
              width: "5px",
            },
            "::-webkit-scrollbar-thumb": {
              background: "#d1d1d1",
              borderRadius: "10px",
            },
          }}
        >
          <Box sx={{ p: "5px 10px" }}>
            {followersData.length > 0 ? (
              followersData.map((el) => (
                <Link
                  href={`/${el.following_Id.username}`}
                  key={el.following_Id._id}
                  underline="none"
                  color="#000"
                >
                  <Stack
                    padding="5px 10px"
                    sx={{ cursor: "pointer" }}
                    alignItems="center"
                    direction={"row"}
                  >
                    <Avatar sx={{ mr: "30px" }} src={el.following_Id.image} />
                    <Box>
                      <Typography
                        fontSize="20px"
                        fontWeight={600}
                        fontFamily={"'Dancing Script', cursive"}
                      >
                        {el.following_Id.username}
                      </Typography>
                      <Typography color="#8d929b">
                        {el.following_Id.full_name}
                      </Typography>
                    </Box>
                  </Stack>
                </Link>
              ))
            ) : (
              <Box p="10px">
                <Typography textAlign="center">No Followers to show</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Dialog>

      {/* It will show all following of the user */}
      <Dialog onClose={handleClose} open={followingOpen}>
        <Box
          sx={{
            maxHeight: "60vh",
            width: "30vw",
            overflowY: "scroll",
            borderRadius: "5px",
            "::-webkit-scrollbar": {
              width: "5px",
            },
            "::-webkit-scrollbar-thumb": {
              background: "#d1d1d1",
              borderRadius: "10px",
            },
          }}
        >
          <Box sx={{ p: "5px 10px" }}>
            {followingData.length > 0 ? (
              followingData.map((el) => (
                <Link
                  href={`/${el.follower_Id.username}`}
                  key={el.follower_Id._id}
                  underline="none"
                  color="#000"
                >
                  <Stack
                    padding="5px 10px"
                    sx={{ cursor: "pointer" }}
                    alignItems="center"
                    direction={"row"}
                  >
                    <Avatar sx={{ mr: "30px" }} src={el.follower_Id.image} />
                    <Box>
                      <Typography
                        fontSize="20px"
                        fontWeight={600}
                        fontFamily={"'Dancing Script', cursive"}
                      >
                        {el.follower_Id.username}
                      </Typography>
                      <Typography color="#8d929b">
                        {el.follower_Id.full_name}
                      </Typography>
                    </Box>
                  </Stack>
                </Link>
              ))
            ) : (
              <Box p="10px">
                <Typography textAlign="center">No Following to show</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
