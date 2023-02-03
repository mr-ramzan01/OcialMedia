import {
  Avatar,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { NotificationMessage } from "../components/Notifications/NotificationMessage";
import { LikeNotifications } from "../components/Notifications/LikeNotifications";
import { CommentNotifications } from "../components/Notifications/CommentNotifications";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Bars/Navbar";
import { BottomBar } from "../components/Bars/BottomBar";
import { LeftSideBar } from "../components/Bars/LeftSideBar";

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [totalNotificationsLength, setTotalNotificationsLength] = useState(0);
  const { setGeneralNotifications } = useContext(AuthContext);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getGeneralNotifications();
    hasSeenNotifications();
  }, []);

  const getGeneralNotifications = () => {
    setPage((prev) => prev + 1);
    fetch(`/notifications/get/all?page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setNotifications([...notifications, ...res.data]);
          setTotalNotificationsLength(res.totalLength);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const hasSeenNotifications = () => {
    fetch("/notifications/has/seen", {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setGeneralNotifications(true);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  return (
    <>
      <Navbar />
      <BottomBar />
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box
          marginLeft={{ xs: "0", sm: "80px", lg: "240px" }}
          display="grid"
          justifyContent="center"
          width="100%"
        >
          <Paper
            sx={{
              m: { xs: "60px 20px", sm: "20px 0" },
              minHeight: {
                xs: "calc(100vh - 125px)",
                sm: "calc(100vh - 45px)",
              },
              display: "grid",
              border: "1px solid #d1d1d1",
              width: {
                xs: "calc(100% -40px)",
                sm: "450px",
                md: "600px",
                lg: "650px",
              },
            }}
          >
            {notifications.length > 0 ? (
              <Box p="15px 20px">
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
                          <LikeNotifications el={el} />
                        )}
                        {el.type === "comment" && el.from._id !== el.to && (
                          <CommentNotifications el={el} />
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
              <Box
                display="flex"
                width={{ xs: "calc(100vw - 40px)", sm: "100%" }}
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    width={{ xs: "150px", sm: "200px" }}
                    height={{ xs: "150px", sm: "200px" }}
                  >
                    <Avatar
                      sx={{
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
                    p="0 10px"
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
