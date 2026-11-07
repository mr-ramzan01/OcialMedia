import { Box, CircularProgress } from "@mui/material";
import { useCallback, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoCopyOutline } from "react-icons/io5";
import { AppShell, PageHeader } from "../components/layout/AppShell";
import { EmptyState } from "../components/common/EmptyState";
import { SmartImage } from "../components/common/SmartImage";
import { TileGridSkeleton } from "../components/common/Skeletons";
import { SinglePost } from "../components/SinglePost";
import { AuthContext } from "../context/AuthContext";
import { api } from "../utils/api";
import { EVENTS } from "../utils/events";
import { useAppEvent } from "../hooks/useAppEvent";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePaginatedList } from "../hooks/usePaginatedList";

export const Explore = () => {
  usePageTitle("Explore");
  const { showSinglePost, postData, handleClick } = useContext(AuthContext);
  const fetchPage = useCallback(async (page) => {
    const res = await api(`/api/posts/explore/data?page=${page}`);
    return res.success
      ? { items: res.data, total: res.totalData }
      : { items: [], total: 0 };
  }, []);
  const {
    items: exploreData,
    isLoading,
    hasMore,
    next: fetchExploreData,
    reload,
    setItems,
  } = usePaginatedList(fetchPage);

  const onPostDeleted = useCallback(
    (detail) => {
      const id = detail && detail.id;
      if (!id) return;
      setItems((prev) => prev.filter((el) => el._id !== id));
    },
    [setItems],
  );
  useAppEvent(EVENTS.POST_DELETED, onPostDeleted);

  const onPostCreated = useCallback(() => {
    reload();
  }, [reload]);
  useAppEvent(EVENTS.POST_CREATED, onPostCreated);

  return (
    <AppShell width="wide">
      {showSinglePost && <SinglePost id={postData._id} />}
      <PageHeader title="Explore" subtitle="Discover what people are sharing" />
      {isLoading ? (
        <TileGridSkeleton count={9} />
      ) : exploreData.length > 0 ? (
        <InfiniteScroll
          dataLength={exploreData.length}
          className="scrollDiv"
          next={fetchExploreData}
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
            {exploreData.map((el) => (
              <Box
                key={el._id}
                onClick={() => handleClick(el._id)}
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
                  src={el.post_images[0].url}
                  alt=""
                  ratio="1 / 1"
                  sx={{ width: "100%", height: "100%" }}
                />
                {el.post_images.length > 1 && (
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
          title="Nothing here yet"
          subtitle="New posts from the community will show up here."
        />
      )}
    </AppShell>
  );
};
