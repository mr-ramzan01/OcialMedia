import { Box, CircularProgress } from "@mui/material";
import { useCallback, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoCopyOutline } from "react-icons/io5";
import { AuthContext } from "../../context/AuthContext";
import { EmptyState } from "../common/EmptyState";
import { SmartImage } from "../common/SmartImage";
import { TileGridSkeleton } from "../common/Skeletons";
import { api } from "../../utils/api";
import { EVENTS } from "../../utils/events";
import { useAppEvent } from "../../hooks/useAppEvent";
import { usePaginatedList } from "../../hooks/usePaginatedList";

export const SavedPosts = ({ id }) => {
  const { handleClick } = useContext(AuthContext);
  const fetchPage = useCallback(
    async (page) => {
      const res = await api(`/api/savedposts/get/all/${id}?page=${page}`);
      return res.success
        ? { items: res.data, total: res.totalLength }
        : { items: [], total: 0 };
    },
    [id],
  );
  const {
    items: savedPosts,
    isLoading,
    hasMore,
    next: getSavedPosts,
    setItems,
  } = usePaginatedList(fetchPage);

  const onPostDeleted = useCallback(
    (detail) => {
      const postId = detail && detail.id;
      if (!postId) return;
      setItems((prev) =>
        prev.filter((el) => !el.post_id || el.post_id._id !== postId),
      );
    },
    [setItems],
  );
  useAppEvent(EVENTS.POST_DELETED, onPostDeleted);

  if (isLoading) {
    return <TileGridSkeleton count={6} />;
  }

  return savedPosts.length > 0 ? (
    <InfiniteScroll
      dataLength={savedPosts.length}
      className="scrollDiv"
      next={getSavedPosts}
      hasMore={hasMore}
      loader={
        <Box sx={{ display: "grid", placeContent: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: { xs: 1, md: 1.5 },
        }}
      >
        {savedPosts.map((el) => (
          <Box
            key={el._id}
            onClick={() => handleClick(el.post_id._id)}
            role="button"
            tabIndex={0}
            sx={{
              position: "relative",
              aspectRatio: "1 / 1",
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              bgcolor: "action.hover",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                bgcolor: "common.black",
                opacity: 0,
                transition: "opacity 150ms",
              },
              "&:hover::after": { opacity: 0.18 },
            }}
          >
            <SmartImage
              src={el.post_id.post_images[0].url}
              alt=""
              ratio="1 / 1"
              sx={{ width: "100%", height: "100%" }}
            />
            {el.post_id.post_images.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  display: "flex",
                  color: "common.white",
                }}
              >
                <IoCopyOutline size={18} />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </InfiniteScroll>
  ) : (
    <EmptyState
      image="/Images/nopost.png"
      title="No saved posts yet"
      subtitle="Tap the bookmark on a post to keep it here."
      compact
    />
  );
};
