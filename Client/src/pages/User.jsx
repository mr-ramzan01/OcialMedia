import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoChatbubbleEllipsesOutline, IoCopyOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { SinglePost } from "../components/SinglePost";
import { SavedPosts } from "../components/Profile/SavedPosts";
import { ShowFollowing } from "../components/Profile/ShowFollowing";
import { ShowFollower } from "../components/Profile/ShowFollower";
import { AppShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/common/EmptyState";
import { SectionCard } from "../components/common/SectionCard";
import { SmartImage } from "../components/common/SmartImage";
import {
  ProfileHeaderSkeleton,
  TileGridSkeleton,
} from "../components/common/Skeletons";
import { useToast } from "../context/ToastContext";
import { api } from "../utils/api";
import { EVENTS } from "../utils/events";
import { useAppEvent } from "../hooks/useAppEvent";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePaginatedList } from "../hooks/usePaginatedList";

const ProfileStat = ({ value, label, onClick }) => (
  <Box
    component={onClick ? "button" : "div"}
    type={onClick ? "button" : undefined}
    onClick={onClick}
    sx={{
      border: 0,
      p: 0,
      background: "none",
      font: "inherit",
      color: "inherit",
      textAlign: { xs: "center", md: "left" },
      cursor: onClick ? "pointer" : "default",
      transition: "color 150ms",
      "&:hover": onClick ? { color: "primary.main" } : undefined,
    }}
  >
    <Typography
      variant="h6"
      component="span"
      sx={{ display: "block", lineHeight: 1.2 }}
    >
      {value ?? 0}
    </Typography>
    <Typography variant="caption">{label}</Typography>
  </Box>
);

export const User = () => {
  const { username } = useParams();
  usePageTitle(username ? `@${username}` : "Profile");
  const toast = useToast();
  const [oneUserData, setOneUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [unfollowOpen, setUnfollowOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [unfollowLoading, setUnfollowLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const {
    showSinglePost,
    postData,
    handleClick,
    userData: loginUserData,
  } = useContext(AuthContext);
  const [selected, setSelected] = useState("post");
  const navigate = useNavigate();

  // Profile posts (paginated)
  const fetchPostsPage = useCallback(
    async (page) => {
      const res = await api(
        `/api/posts/${encodeURIComponent(username)}?page=${page}`,
      );
      return res.success
        ? { items: res.data, total: res.totalPosts }
        : { items: [], total: 0 };
    },
    [username],
  );
  const {
    items: userPosts,
    isLoading: postsLoading,
    hasMore: hasMorePosts,
    next: getPosts,
    reload: reloadPosts,
    setItems: setUserPosts,
  } = usePaginatedList(fetchPostsPage);

  // Profile header + follow state
  const fetchData = useCallback(async () => {
    if (!loginUserData._id) return;
    try {
      const user = await api(`/api/users/${encodeURIComponent(username)}`);
      if (!user.success) {
        setUserNotFound(true);
        return;
      }
      setUserNotFound(false);
      setOneUserData(user.data);

      if (user.data._id !== loginUserData._id) {
        const following = await api(
          `/api/follows/isfollowing?followerID=${user.data._id}&followingID=${loginUserData._id}`,
        );
        setIsFollowing(Boolean(following.success));
      }
    } catch (err) {
      console.log(err, "error");
    } finally {
      setIsLoading(false);
    }
  }, [username, loginUserData._id]);

  useEffect(() => {
    setSelected("post");
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  const isOwnProfile = loginUserData._id === oneUserData._id;

  // Keep the profile in sync with app-wide changes (no page reloads)
  const onPostDeleted = useCallback(
    (detail) => {
      const id = detail && detail.id;
      if (!id) return;
      setUserPosts((prev) => prev.filter((el) => el._id !== id));
      if (isOwnProfile) {
        setOneUserData((u) => ({
          ...u,
          postsCount: Math.max(0, (u.postsCount || 0) - 1),
        }));
      }
    },
    [setUserPosts, isOwnProfile],
  );
  useAppEvent(EVENTS.POST_DELETED, onPostDeleted);

  const onPostCreated = useCallback(() => {
    reloadPosts();
    fetchData();
  }, [reloadPosts, fetchData]);
  useAppEvent(EVENTS.POST_CREATED, onPostCreated);

  useAppEvent(EVENTS.PROFILE_UPDATED, fetchData);

  const followRequest = () => {
    setFollowLoading(true);
    api("/api/follows/followRequest", {
      method: "POST",
      body: { following_Id: loginUserData._id, follower_Id: oneUserData._id },
    })
      .then((res) => {
        if (!res.success) toast.error(res.message || "Something went wrong");
        return fetchData();
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err, "following error");
      })
      .finally(() => setFollowLoading(false));
  };

  const handleFollow = () => {
    if (!isFollowing) {
      followRequest();
    } else {
      setUnfollowOpen(true);
    }
  };

  const handleUnFollow = () => {
    setUnfollowOpen(false);
    setUnfollowLoading(true);
    api("/api/follows/unfollowRequest", {
      method: "DELETE",
      body: { following_Id: loginUserData._id, follower_Id: oneUserData._id },
    })
      .then((res) => {
        if (!res.success) toast.error(res.message || "Something went wrong");
        return fetchData();
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err, "unfollow error");
      })
      .finally(() => setUnfollowLoading(false));
  };

  const handleClose = () => {
    setUnfollowOpen(false);
    setFollowersOpen(false);
    setFollowingOpen(false);
  };

  const getFollowers = () => {
    api(`/api/follows/getFollowers?userID=${oneUserData._id}`)
      .then((res) => {
        if (res.success) {
          setFollowersData(res.data);
          setFollowersOpen(true);
        } else {
          toast.error(res.message || "Something went wrong");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err, "error");
      });
  };

  const getFollowing = () => {
    api(`/api/follows/getFollowing?userID=${oneUserData._id}`)
      .then((res) => {
        if (res.success) {
          setFollowingData(res.data);
          setFollowingOpen(true);
        } else {
          toast.error(res.message || "Something went wrong");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err, "error");
      });
  };

  const handleMessageClick = (user_id) => {
    setMessageLoading(true);
    api("/api/chats/create", { method: "POST", body: { userId: user_id } })
      .catch((err) => console.log(err, "error"))
      .finally(() => {
        setMessageLoading(false);
        navigate("/messages");
      });
  };

  if (isLoading) {
    return (
      <AppShell width="wide">
        <Stack spacing={3}>
          <SectionCard>
            <ProfileHeaderSkeleton />
          </SectionCard>
          <SectionCard sx={{ p: { xs: 1, sm: 2 } }}>
            <TileGridSkeleton count={6} />
          </SectionCard>
        </Stack>
      </AppShell>
    );
  }

  if (userNotFound) {
    return (
      <AppShell width="wide">
        <EmptyState
          image="/Images/404user.gif"
          title="User not found"
          subtitle="The profile you are looking for does not exist or may have been removed."
          action={
            <Button variant="contained" component={RouterLink} to="/">
              Back to home
            </Button>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell width="wide">
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

      <Stack spacing={3}>
        {/* Profile header */}
        <SectionCard>
          <Stack
            sx={{ alignItems: { xs: "center", md: "flex-start" } }}
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 4 }}
          >
            <Avatar
              src={oneUserData.image}
              alt={oneUserData.username}
              sx={{
                width: { xs: 84, md: 140 },
                height: { xs: 84, md: 140 },
                fontSize: { xs: 34, md: 56 },
                flexShrink: 0,
              }}
            >
              {(oneUserData.username || "?")[0].toUpperCase()}
            </Avatar>

            <Stack
              spacing={2}
              sx={{
                flex: 1,
                minWidth: 0,
                width: "100%",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="h3"
                  component="h1"
                  noWrap
                  sx={{ maxWidth: "100%" }}
                >
                  {oneUserData.username}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {isOwnProfile ? (
                    <Button
                      variant="outlined"
                      component={RouterLink}
                      to="/settings"
                    >
                      Edit profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant={isFollowing ? "outlined" : "contained"}
                        onClick={handleFollow}
                        loading={followLoading || unfollowLoading}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<IoChatbubbleEllipsesOutline />}
                        onClick={() => handleMessageClick(oneUserData._id)}
                        loading={messageLoading}
                      >
                        Message
                      </Button>
                    </>
                  )}
                </Stack>
              </Stack>

              <Stack direction="row" spacing={{ xs: 3, sm: 4 }}>
                <ProfileStat value={oneUserData.postsCount} label="posts" />
                <ProfileStat
                  value={oneUserData.followerCount}
                  label="followers"
                  onClick={getFollowers}
                />
                <ProfileStat
                  value={oneUserData.followingCount}
                  label="following"
                  onClick={getFollowing}
                />
              </Stack>

              <Box
                sx={{ textAlign: { xs: "center", md: "left" }, maxWidth: 480 }}
              >
                <Typography variant="subtitle1">
                  {oneUserData.full_name}
                </Typography>
                {oneUserData.bio && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, whiteSpace: "pre-line" }}
                  >
                    {oneUserData.bio}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Stack>
        </SectionCard>

        {/* Posts / Saved */}
        <SectionCard sx={{ p: 0, overflow: "hidden" }}>
          <Tabs
            value={selected}
            onChange={(event, value) => setSelected(value)}
            textColor="primary"
            indicatorColor="primary"
            centered
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Tab value="post" label="Posts" />
            {isOwnProfile && <Tab value="saved" label="Saved" />}
          </Tabs>

          <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {selected === "post" ? (
              postsLoading ? (
                <TileGridSkeleton count={6} />
              ) : userPosts.length > 0 ? (
                <InfiniteScroll
                  dataLength={userPosts.length}
                  className="scrollDiv"
                  next={getPosts}
                  hasMore={hasMorePosts}
                  loader={
                    <Box
                      sx={{ display: "grid", placeContent: "center", py: 3 }}
                    >
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
                    {userPosts.map((el) => (
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
                  title="No posts yet"
                  subtitle={
                    isOwnProfile
                      ? "Share your first moment from the Create menu."
                      : "This user hasn't posted anything yet."
                  }
                  compact
                />
              )
            ) : (
              <SavedPosts id={oneUserData._id} />
            )}
          </Box>
        </SectionCard>
      </Stack>

      {/* Unfollow confirmation */}
      <Dialog maxWidth="xs" onClose={handleClose} open={unfollowOpen} fullWidth>
        <DialogTitle>Unfollow @{oneUserData.username}?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Their posts will no longer appear in your feed. You can follow them
            again at any time.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleUnFollow}
            loading={unfollowLoading}
          >
            Unfollow
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
};
