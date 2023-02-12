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
import { Loader } from "../components/Loader";
import { HiRectangleStack } from "react-icons/hi2";
import { AuthContext } from "../context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { SinglePost } from "../components/SinglePost";
import { SavedPosts } from "../components/Profile/SavedPosts";
import { ShowFollowing } from "../components/Profile/ShowFollowing";
import { ShowFollower } from "../components/Profile/ShowFollower";
import { AiOutlineMessage } from "react-icons/ai";
import { Navbar } from "../components/Bars/Navbar";
import { BottomBar } from "../components/Bars/BottomBar";
import { LeftSideBar } from "../components/Bars/LeftSideBar";
import { root_url } from "../utils/url";

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
  const { showSinglePost, postData, handleClick, userToken } = useContext(AuthContext);
  const [selected, setSelected] = useState("post");
  const [page, setPage] = useState(1);
  const [totalPostsLength, setTotalPostsLength] = useState(0);
  const navigate = useNavigate();

  const followRequest = () => {
    fetch(`${root_url}/api/follows/followRequest`, {
      method: "POST",
      body: JSON.stringify({
        following_Id: loginUserData._id,
        follower_Id: oneUserData._id,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`
      },
    })
      .then((res) => res.json())
      .then((res) => {
        fetchData();
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "following error");
      });
  };

  const getPosts = () => {
    setPage((prev) => prev + 1);
    fetch(`${root_url}/api/posts/${username}?page=${page}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
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
      fetch(`${root_url}/api/users/loggedInUser`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${userToken}`
        }
      }),
      fetch(`${root_url}/api/users/${username}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${userToken}`
        }
      }),
      fetch(`${root_url}/api/posts/${username}?page=${1}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${userToken}`
        }
      }),
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
          `${root_url}/api/follows/isfollowing?followerID=${res[1].data._id}&followingID=${res[0].data._id}`, {
            method: 'GET',
            headers: {
              authorization: `Bearer ${userToken}`
            }
          }
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
    fetch(`${root_url}/api/follows/unfollowRequest`, {
      method: "DELETE",
      body: JSON.stringify({
        following_Id: loginUserData._id,
        follower_Id: oneUserData._id,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`
      },
    })
      .then((res) => res.json())
      .then((res) => {
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
    fetch(`${root_url}/api/follows/getFollowers?userID=${oneUserData._id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
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
    fetch(`${root_url}/api/follows/getFollowing?userID=${oneUserData._id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
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
    fetch(`${root_url}/api/chats/create`, {
      method: "POST",
      body: JSON.stringify({ userId: user_id }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`
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
      {followingData && (
        <ShowFollowing
          followingOpen={followingOpen}
          followingData={followingData}
          handleClose={handleClose}
        />
      )}
      {followersOpen && (
        <ShowFollower
          followersOpen={followersOpen}
          followersData={followersData}
          handleClose={handleClose}
        />
      )}
      {showSinglePost && <SinglePost id={postData._id} />}
      <Navbar />
      <BottomBar />
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box
          marginLeft={{ xs: "0", sm: "80px", lg: "240px" }}
          width="100%"
          display="grid"
          justifyContent="center"
        >
          <Box width={{ xs: "100%", sm: "500px", md: "800px", lg: "900px" }}>
            <Stack direction="column" m={{ xs: "60px 0", sm: "30px 0" }}>
              <Stack direction="row">
                <Grid
                  display="grid"
                  sx={{ placeContent: "center" }}
                  width={{ xs: "120px", sm: "35%" }}
                >
                  <Avatar
                    sx={{
                      height: {
                        xs: "65px",
                        sm: "100px",
                        md: "120px",
                        lg: "150px",
                      },
                      width: {
                        xs: "65px",
                        sm: "100px",
                        md: "120px",
                        lg: "150px",
                      },
                    }}
                    src={oneUserData.image}
                    alt={oneUserData.full_name}
                  />
                </Grid>
                <Grid
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                  width={{ xs: "100%", sm: "65%" }}
                >
                  <Stack
                    direction="row"
                    gap={{ xs: "8px", sm: "15px" }}
                    alignItems="center"
                  >
                    <Typography
                      fontFamily="'Petrona', serif"
                      fontStyle={"italic"}
                      fontWeight={400}
                      fontSize={{ xs: "15px", sm: "20px", md: "25px" }}
                      color="#303030"
                      mr={{ xs: "5px", sm: "20px" }}
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
                            fontSize: { xs: "10px", sm: "13px" },
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
                            fontSize: { xs: "10px", md: "13px" },
                            padding: "5px 10px",
                            boxShadow: "none",
                            "&:hover": {
                              backgroundColor: "#0066ff",
                              boxShadow: "none",
                            },
                            width: { xs: "70px", sm: "100px" },
                          }}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#eee",
                            color: "#000",
                            display: { xs: "none", sm: "block" },
                            letterSpacing: "0px",
                            fontSize: { xs: "10px", md: "13px" },
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
                        <Box
                          onClick={() => handleMessageClick(oneUserData._id)}
                          padding="2px 10px"
                          borderRadius="5px"
                          backgroundColor="#eee"
                          display={{ xs: "block", sm: "none" }}
                        >
                          <AiOutlineMessage />
                        </Box>
                      </>
                    )}
                  </Stack>
                  <Stack
                    direction="row"
                    gap={{ xs: "10px", sm: "30px" }}
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center">
                      <Typography
                        mr="5px"
                        fontSize={{ xs: "15px", sm: "18px" }}
                        marginBottom="2px"
                      >
                        {oneUserData.postsCount}
                      </Typography>
                      <Typography
                        color="#363638"
                        fontSize={{ xs: "12px", sm: "15px" }}
                      >
                        posts
                      </Typography>
                    </Stack>
                    <Stack
                      onClick={getFollowers}
                      sx={{ cursor: "pointer" }}
                      direction="row"
                      alignItems="center"
                    >
                      <Typography
                        mr="5px"
                        fontSize={{ xs: "15px", sm: "18px" }}
                        marginBottom="2px"
                      >
                        {oneUserData.followerCount}
                      </Typography>
                      <Typography
                        color="#363638"
                        fontSize={{ xs: "12px", sm: "15px" }}
                      >
                        followers
                      </Typography>
                    </Stack>
                    <Stack
                      onClick={getFollowing}
                      sx={{ cursor: "pointer" }}
                      direction="row"
                      alignItems="center"
                    >
                      <Typography
                        mr="5px"
                        fontSize={{ xs: "15px", sm: "18px" }}
                        marginBottom="2px"
                      >
                        {oneUserData.followingCount}
                      </Typography>
                      <Typography
                        color="#363638"
                        fontSize={{ xs: "12px", sm: "15px" }}
                      >
                        following
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box width="50%" marginTop="20px">
                    <Typography fontSize={{ xs: "17px", sm: "20px" }}>
                      {oneUserData.full_name}
                    </Typography>
                  </Box>
                  <Box width="50%" marginTop="-10px">
                    <Typography fontSize={{ xs: "13px", sm: "15px" }}>
                      {oneUserData.bio}
                    </Typography>
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
                    fontSize={{ xs: "15px", sm: "20px" }}
                    sx={{ cursor: "pointer" }}
                  >
                    Post
                  </Typography>
                  {loginUserData._id === oneUserData._id && (
                    <Typography
                      borderTop={
                        selected === "saved"
                          ? "2px solid #000"
                          : "2px solid #fff"
                      }
                      onClick={() => setSelected("saved")}
                      p="10px 0"
                      textAlign="center"
                      fontSize={{ xs: "15px", sm: "20px" }}
                      sx={{ cursor: "pointer" }}
                    >
                      Saved
                    </Typography>
                  )}
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
                              height={{ xs: "130px", sm: "170px", md: "280px" }}
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
    </>
  );
};
