import { Box, CircularProgress, Stack } from "@mui/material";
import { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoImagesOutline } from "react-icons/io5";
import { AppShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/common/EmptyState";
import { FeedSkeleton } from "../components/common/Skeletons";
import { PostCard } from "../components/PostCard";
import { Stories } from "../components/Stories";
import { api } from "../utils/api";
import { EVENTS } from "../utils/events";
import { usePaginatedList } from "../hooks/usePaginatedList";
import { useAppEvent } from "../hooks/useAppEvent";
import { usePageTitle } from "../hooks/usePageTitle";

export const Home = () => {
  usePageTitle("Home");

  const fetchPage = useCallback(async (page) => {
    const res = await api(`/api/posts/recent/post?page=${page}`);
    return res.success
      ? { items: res.data, total: res.totalData }
      : { items: [], total: 0 };
  }, []);
  const {
    items: recentPosts,
    isLoading,
    hasMore,
    next: fetchRecentPosts,
    reload,
    setItems,
  } = usePaginatedList(fetchPage);

  // Keep the feed in sync with posts created / deleted elsewhere in the app
  const onPostCreated = useCallback(() => {
    reload();
  }, [reload]);
  useAppEvent(EVENTS.POST_CREATED, onPostCreated);

  const onPostDeleted = useCallback(
    ({ id } = {}) => {
      setItems((prev) => prev.filter((p) => p._id !== id));
    },
    [setItems],
  );
  useAppEvent(EVENTS.POST_DELETED, onPostDeleted);

  return (
    <AppShell width="feed">
      <Stories />
      {isLoading ? (
        <FeedSkeleton />
      ) : recentPosts.length > 0 ? (
        <InfiniteScroll
          dataLength={recentPosts.length}
          className="scrollDiv"
          next={fetchRecentPosts}
          hasMore={hasMore}
          loader={
            <Box sx={{ display: "grid", placeContent: "center", py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          }
        >
          <Stack spacing={3}>
            {recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Stack>
        </InfiniteScroll>
      ) : (
        <EmptyState
          icon={<IoImagesOutline />}
          title="No posts yet"
          subtitle="Be the first to share a moment. Use Create in the menu to post your first photo."
        />
      )}
    </AppShell>
  );
};
