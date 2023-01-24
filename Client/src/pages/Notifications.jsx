import {
  Avatar,
  Box,
  CircularProgress,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { LeftSideBar } from "../components/LeftSideBar";
import { AuthContext } from "../context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";

import { NotificationMessage } from "../components/NotificationMessage";

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [totalNotificationsLength, setTotalNotificationsLength] = useState(0);
  const [page, setPage] = useState(1);

  // const { getGeneralNotifications } = useContext(AuthContext);
  useEffect(() => {
    getGeneralNotifications();
  }, []);

  const getGeneralNotifications = () => {
    fetch(`/notifications/get/all`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res, "notifications");
        if (res.success) {
          setNotifications(res.data);
          setTotalNotificationsLength(res.totalLength);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  return (
    <>
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box
          marginLeft="240px"
          display="grid"
          justifyContent="center"
          width="100%"
        >
          <Paper
            sx={{
              m: "20px 0",
              minHeight: "calc(100vh - 45px)",
              display: "grid",
              border: "1px solid #d1d1d1",
              width: "600px",
            }}
          >
            {notifications.length > 0 ? (
              <Box border="1px solid blue" p="15px 20px">
                <InfiniteScroll
                  dataLength={notifications.length}
                  className={"scrollDiv"}
                  next={getGeneralNotifications}
                  hasMore={totalNotificationsLength !== notifications.length}
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
                  <Stack gap="20px">
                    {notifications.map((el) => (
                      <Box key={el._id}>
                        {el.type === "like" && el.from._id !== el.to && (
                          <Box>
                            <Stack
                              direction="row"
                              key={el._id}
                              alignItems="center"
                              gap="10px"
                              justifyContent="space-between"
                            >
                              {/* <NotificationMessage el={el} type={el.type} likeCount={el.like_id.post_Id.likeCount}/> */}
                              <Avatar
                                sx={{ borderRadius: "0" }}
                                // src={el.like_id.post_Id.post_images[0].url}
                                alt=""
                              />
                            </Stack>
                          </Box>
                        )}
                        {el.type === "comment" && el.from._id !== el.to && (
                          <Box>
                            <Stack
                              direction="row"
                              key={el._id}
                              alignItems="center"
                              gap="10px"
                              justifyContent="space-between"
                            >
                              <NotificationMessage el={el} type={el.type} commentCount={el.comment_id.post_Id.commentCount}/>
                              <Avatar
                                sx={{ borderRadius: "0" }}
                                src={el.comment_id.post_Id.post_images[0].url}
                                alt=""
                              />
                            </Stack>
                          </Box>
                        )}
                        {el.type === "follow" && el.from._id !== el.to && (
                          <Box>
                            <NotificationMessage el={el} type={el.type} />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </InfiniteScroll>
              </Box>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box width="200px" height="200px">
                    <img
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      src="/images/notifications.png"
                      alt=""
                    />
                  </Box>
                  <Typography
                    color="#a1a1a1"
                    fontSize="22px"
                    textAlign="center"
                    mt="20px"
                  >
                    No Notifications to show
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Stack>
    </>
  );
};
