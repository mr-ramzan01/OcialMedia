import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Carousel } from "react-responsive-carousel";
import { useEffect } from "react";
import { Loader } from "./Loader";

export const SinglePost = ({ data }) => {
  const [postOpen, setPostOpen] = useState(true);
  const { setShowSinglePost, userData } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setPostOpen(false);
    setShowSinglePost(false);
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
  }
  useEffect(() => {
    setIsLoading(true);
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
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Dialog open={postOpen} onClose={handleClose} maxWidth="md">
        <Box sx={{ width: "880px" }}>
          <DialogContent>
            <Stack direction="row" gap="20px" height="100%">
              <Box overflow="hidden" borderRadius="10px" width="50%">
                <Carousel
                  showStatus={false}
                  showIndicators={data.post_images.length > 1}
                  showThumbs={false}
                >
                  {data.post_images.map((el) => (
                    <img
                      key={el}
                      width="100%"
                      height="480px"
                      src={el.url}
                      alt=""
                    />
                  ))}
                </Carousel>
              </Box>
              <Box width="50%" height="100%" border="1px solid red">
                <Stack direction="column">
                  <Stack
                    direction="row"
                    bordesr="1px solid blue"
                    alignItems="center"
                  >
                    <Avatar
                      sx={{ marginRight: "20px" }}
                      src={data.user_id.image}
                    />
                    <Stack border="1px solid red" direction="column">
                      <Typography
                        fontFamily={"Dancing Script"}
                        fontSize="25px"
                        fontWeight="600"
                      >
                        {data.user_id.username}
                      </Typography>
                      <Typography fontSize="15px" fontWeight="400">
                        {data.location}
                      </Typography>
                    </Stack>
                    {userData._id !== data.user_id._id && (
                      <Box>
                        {isFollowing ? (
                          <Typography
                            border="1px solid green"
                            marginLeft="10px"
                            color="#0066ff"
                            sx={{ cursor: "pointer" }}
                            onClick={unFollowRequest}
                          >
                            UnFollow
                          </Typography>
                        ) : (
                          <Typography
                            border="1px solid green"
                            marginLeft="10px"
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
                  <Box height="100%" border="1px solid yellow">
                    heire
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};
