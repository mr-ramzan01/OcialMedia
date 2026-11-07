import { Box, CircularProgress, Divider, Stack } from "@mui/material";
import React, { useCallback, useContext, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { NotificationMessage } from "../components/Notifications/NotificationMessage";
import { LikeNotifications } from "../components/Notifications/LikeNotifications";
import { CommentNotifications } from "../components/Notifications/CommentNotifications";
import { AuthContext } from "../context/AuthContext";
import { AppShell, PageHeader } from "../components/layout/AppShell";
import { EmptyState } from "../components/common/EmptyState";
import { SectionCard } from "../components/common/SectionCard";
import { NotificationRowSkeleton } from "../components/common/Skeletons";
import { api } from "../utils/api";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePaginatedList } from "../hooks/usePaginatedList";

export const Notifications = () => {
  usePageTitle("Notifications");
  const { setGeneralNotifications } = useContext(AuthContext);

  const fetchPage = useCallback(async (page) => {
    const res = await api(`/api/notifications/get/all?page=${page}`);
    return res.success
      ? { items: res.data, total: res.totalLength }
      : { items: [], total: 0 };
  }, []);
  const {
    items: notifications,
    isLoading,
    hasMore,
    next: getGeneralNotifications,
  } = usePaginatedList(fetchPage);

  // Mark everything as seen when the page opens
  useEffect(() => {
    api("/api/notifications/has/seen", { method: "PATCH" })
      .then((res) => {
        if (res.success) setGeneralNotifications(true);
      })
      .catch((err) => console.log(err, "error"));
  }, [setGeneralNotifications]);

  return (
    <AppShell width="feed">
      <PageHeader title="Notifications" />
      {isLoading ? (
        <SectionCard sx={{ p: { xs: 1, sm: 1.5 } }}>
          <NotificationRowSkeleton count={6} />
        </SectionCard>
      ) : notifications.length > 0 ? (
        <SectionCard sx={{ p: { xs: 1, sm: 1.5 } }}>
          <InfiniteScroll
            dataLength={notifications.length}
            className={"scrollDiv"}
            next={getGeneralNotifications}
            hasMore={hasMore}
            loader={
              <Box sx={{ display: "grid", placeContent: "center", py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            }
          >
            <Stack
              divider={<Divider component="li" sx={{ listStyle: "none" }} />}
              component="ul"
              sx={{ m: 0, p: 0, listStyle: "none" }}
            >
              {notifications.map((el) => (
                <Box component="li" key={el._id} sx={{ listStyle: "none" }}>
                  {el.type === "like" && el.from._id !== el.to && (
                    <LikeNotifications el={el} />
                  )}
                  {el.type === "comment" && el.from._id !== el.to && (
                    <CommentNotifications el={el} />
                  )}
                  {el.type === "follow" && el.from._id !== el.to && (
                    <NotificationMessage el={el} type={el.type} />
                  )}
                </Box>
              ))}
            </Stack>
          </InfiniteScroll>
        </SectionCard>
      ) : (
        <SectionCard>
          <EmptyState
            image="/Images/notifications.png"
            title="You're all caught up"
            subtitle="Likes, comments and new followers will show up here."
          />
        </SectionCard>
      )}
    </AppShell>
  );
};
