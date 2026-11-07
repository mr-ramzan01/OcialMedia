import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  IoChevronBack,
  IoClose,
  IoHappyOutline,
  IoSearchOutline,
  IoSend,
} from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import ScrollableFeed from "react-scrollable-feed";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { AppShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/common/EmptyState";
import { UserListItem } from "../components/common/UserListItem";
import {
  MessagesSkeleton,
  UserRowSkeleton,
} from "../components/common/Skeletons";
import { UserMessages } from "../components/Messages/UserMessages";
import { usePageTitle } from "../hooks/usePageTitle";
import { root_url } from "../utils/url";
import { api } from "../utils/api";
import { timeAgo } from "../utils/time";
const TYPING_TIMEOUT_MS = 2000;

/** Returns the other participant of a 1:1 chat. */
const otherUser = (chat, me) =>
  chat && chat.users
    ? chat.users.find((u) => u._id !== me._id) || chat.users[0]
    : undefined;

export const Messages = () => {
  usePageTitle("Messages");
  const toast = useToast();
  const {
    userData,
    sendMessageNotification,
    messagesNotification,
    deleteNotifications,
    userToken,
  } = useContext(AuthContext);
  const [chatsData, setChatsData] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentSelectedChat, setCurrentSelectedChat] = useState(undefined);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const [searchData, setSearchData] = useState([]);
  const searchRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("none");
  const [displayChats, setDisplayChats] = useState("block");

  // One socket per page visit, disconnected on unmount.
  const socketRef = useRef(null);
  const selectedChatRef = useRef(undefined);
  const typingRef = useRef(false);
  const typingTimerRef = useRef(null);
  const searchTimerRef = useRef(null);

  const hasUser = Boolean(userData && userData._id);

  useEffect(() => {
    selectedChatRef.current = currentSelectedChat;
  }, [currentSelectedChat]);

  const getAllMessages = useCallback((chat) => {
    setLoadingMessages(true);
    api(`/api/messages/get/${chat._id}`)
      .then((res) => {
        if (res.success) {
          setDisplayChats("none");
          setDisplayMessage("block");
          setMessages(res.data);
          if (socketRef.current) socketRef.current.emit("join chat", chat._id);
        }
      })
      .catch((err) => console.log(err, "error"))
      .finally(() => setLoadingMessages(false));
  }, []);

  const getChats = useCallback(
    (selectChatId) => {
      api("/api/chats/allchats")
        .then((res) => {
          if (res.success) {
            setChatsData(res.data);
            if (res.data.length > 0) {
              const chat =
                (selectChatId &&
                  res.data.find((c) => c._id === selectChatId)) ||
                res.data[0];
              setCurrentSelectedChat(chat);
              getAllMessages(chat);
            }
          } else {
            toast.error(res.message || "Something went wrong");
          }
        })
        .catch((err) => {
          toast.error("Something went wrong");
          console.log(err, "error");
        })
        .finally(() => setLoadingChats(false));
    },
    [getAllMessages, toast],
  );

  // Load chats once the logged-in user is known
  useEffect(() => {
    if (!hasUser) return;
    setLoadingChats(true);
    getChats();
  }, [hasUser, getChats]);

  // Socket lifecycle
  useEffect(() => {
    if (!hasUser) return undefined;

    const socket = io(root_url, { auth: { token: userToken } });
    socketRef.current = socket;

    socket.emit("setup", { _id: userData._id });
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("message received", (newMessageReceived) => {
      const selected = selectedChatRef.current;
      const chatId =
        newMessageReceived.chat_id &&
        (newMessageReceived.chat_id._id || newMessageReceived.chat_id);
      if (!selected || selected._id !== chatId) {
        sendMessageNotification(
          newMessageReceived._id,
          newMessageReceived.sender._id,
        );
      } else {
        setMessages((prev) =>
          prev.some((m) => m._id === newMessageReceived._id)
            ? prev
            : [...prev, newMessageReceived],
        );
      }
      // Keep the chat list's "latest message" fresh
      setChatsData((prev) =>
        prev.map((c) =>
          c._id === chatId ? { ...c, latestMessage: newMessageReceived } : c,
        ),
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUser, userData._id, userToken]);

  // Clear message notifications from the user whose chat is open
  useEffect(() => {
    if (!hasUser || !currentSelectedChat) return;
    const other = otherUser(currentSelectedChat, userData);
    if (!other) return;
    const hasNotifications = messagesNotification.some(
      (n) => n.from === other._id,
    );
    if (hasNotifications) deleteNotifications(other._id, userData._id);
  }, [
    currentSelectedChat,
    messagesNotification,
    hasUser,
    userData,
    deleteNotifications,
  ]);

  const typingHandler = (e) => {
    setMsg(e.target.value);
    if (!socketConnected || !currentSelectedChat || !socketRef.current) return;

    if (!typingRef.current) {
      typingRef.current = true;
      socketRef.current.emit("typing", currentSelectedChat._id);
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      if (socketRef.current)
        socketRef.current.emit("stop typing", currentSelectedChat._id);
      typingRef.current = false;
    }, TYPING_TIMEOUT_MS);
  };

  const handleSelectEmoji = (e) => {
    setMsg((prev) => prev + e.emoji);
  };

  const handleSendMessage = () => {
    if (!currentSelectedChat) return;
    const text = msg.trim();
    if (text === "") return;

    if (socketRef.current)
      socketRef.current.emit("stop typing", currentSelectedChat._id);
    typingRef.current = false;
    setMsg("");
    setShowEmojiPicker(false);
    setSending(true);

    api("/api/messages/send", {
      method: "POST",
      body: { message: text, chat_id: currentSelectedChat._id },
    })
      .then((res) => {
        if (!res.success || !res.data) {
          toast.error(res.message || "Message could not be sent");
          return;
        }
        if (socketRef.current) socketRef.current.emit("new message", res.data);
        setMessages((prev) => [...prev, res.data]);
        setChatsData((prev) =>
          prev.map((c) =>
            c._id === currentSelectedChat._id
              ? { ...c, latestMessage: res.data }
              : c,
          ),
        );
      })
      .catch((err) => console.log(err, "error"))
      .finally(() => setSending(false));
  };

  const searchUsers = () => {
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const q = searchRef.current ? searchRef.current.value.trim() : "";
      if (!q) {
        setSearchData([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      api(`/api/users/search?q=${encodeURIComponent(q)}`)
        .then((res) =>
          setSearchData(
            res.success ? res.data.filter((u) => u._id !== userData._id) : [],
          ),
        )
        .catch((err) => console.log(err, "error"))
        .finally(() => setSearching(false));
    }, 400);
  };

  const handleSelectSearchChat = (id) => {
    if (searchRef.current) searchRef.current.value = "";
    setSearchData([]);
    api("/api/chats/create", { method: "POST", body: { userId: id } })
      .then((res) => getChats(res.data && res.data._id))
      .catch((err) => {
        console.log(err, "error");
        getChats();
      });
  };

  const handleChatClick = (chat) => {
    setCurrentSelectedChat(chat);
    getAllMessages(chat);
  };

  const goBackToChat = () => {
    setDisplayChats("block");
    setDisplayMessage("none");
  };

  const DateConvert = ({ date }) => (
    <Typography sx={{ fontSize: "13px" }}> {timeAgo(date)}</Typography>
  );

  // Avoid re-computing the search dropdown visibility on every keystroke render
  const showSearchResults = useMemo(
    () =>
      searchData.length > 0 &&
      searchRef.current &&
      searchRef.current.value.length > 0,
    [searchData],
  );
  const other = otherUser(currentSelectedChat, userData);
  const profileLink = (sx) =>
    other
      ? {
          component: RouterLink,
          to: `/${other.username}`,
          sx: { textDecoration: "none", ...sx },
        }
      : { sx };

  return (
    <AppShell width="full">
      <Paper
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr", lg: "360px 1fr" },
          height: { xs: "calc(100vh - 160px)", sm: "calc(100vh - 120px)" },
          overflow: "hidden",
        }}
      >
        {/* Conversations */}
        <Box
          sx={{
            display: {
              xs: displayChats === "none" ? "none" : "flex",
              md: "flex",
            },
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            minWidth: 0,
            borderRight: { md: "1px solid" },
            borderColor: { md: "divider" },
          }}
        >
          <Box
            sx={{
              px: 2,
              pt: 2,
              pb: 1.5,
              position: "relative",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h5" component="h1" sx={{ mb: 1.5 }}>
              Messages
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="search"
              autoComplete="off"
              placeholder="Search people"
              onInput={searchUsers}
              inputRef={searchRef}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoSearchOutline />
                    </InputAdornment>
                  ),
                },
              }}
            />
            {(searching || showSearchResults) && (
              <Paper
                sx={{
                  position: "absolute",
                  left: 16,
                  right: 16,
                  top: "100%",
                  zIndex: 5,
                  maxHeight: 280,
                  overflowY: "auto",
                  p: 0.75,
                  boxShadow: 4,
                }}
              >
                {searching ? (
                  <UserRowSkeleton count={3} dense />
                ) : (
                  searchData.map((el) => (
                    <UserListItem
                      key={el._id}
                      user={el}
                      dense
                      onClick={() => handleSelectSearchChat(el._id)}
                    />
                  ))
                )}
              </Paper>
            )}
          </Box>

          <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 1, py: 1 }}>
            {loadingChats ? (
              <UserRowSkeleton count={5} />
            ) : chatsData.length > 0 ? (
              <Stack spacing={0.25}>
                {chatsData.map((el) => (
                  <UserListItem
                    key={el._id}
                    user={otherUser(el, userData)}
                    secondary={
                      el.latestMessage ? el.latestMessage.message : "Say hello"
                    }
                    trailing={
                      el.latestMessage ? (
                        <Box sx={{ color: "text.secondary", flexShrink: 0 }}>
                          <DateConvert date={el.latestMessage.createdAt} />
                        </Box>
                      ) : null
                    }
                    selected={Boolean(
                      currentSelectedChat && el._id === currentSelectedChat._id,
                    )}
                    onClick={() => handleChatClick(el)}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyState
                compact
                image="/Images/user.png"
                title="No conversations yet"
                subtitle="Search for someone to start chatting."
              />
            )}
          </Box>
        </Box>

        {/* Conversation */}
        <Box
          sx={{
            display: {
              xs: displayMessage === "none" ? "none" : "flex",
              md: "flex",
            },
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            minWidth: 0,
            position: "relative",
          }}
        >
          {currentSelectedChat && other ? (
            <>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  px: { xs: 1.5, sm: 2 },
                  py: 1.25,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <IconButton
                  aria-label="Back to conversations"
                  onClick={goBackToChat}
                  edge="start"
                  sx={{ display: { xs: "inline-flex", md: "none" } }}
                >
                  <IoChevronBack />
                </IconButton>
                <Avatar
                  {...profileLink()}
                  src={other.image}
                  alt={other.username}
                >
                  {(other.username || "?").slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    noWrap
                    {...profileLink({
                      display: "block",
                      color: "text.primary",
                      "&:hover": { color: "primary.main" },
                    })}
                  >
                    {other.full_name || other.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      display: "block",
                      color: istyping ? "primary.main" : "text.secondary",
                    }}
                  >
                    {istyping ? "typing…" : `@${other.username}`}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  "& > div": { flex: 1, minHeight: 0 },
                }}
              >
                {loadingMessages ? (
                  <MessagesSkeleton />
                ) : (
                  <ScrollableFeed className="messageDiv">
                    <UserMessages messages={messages} />
                  </ScrollableFeed>
                )}
              </Box>

              {showEmojiPicker && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 76,
                    zIndex: 5,
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={(e) => handleSelectEmoji(e)}
                    theme="light"
                    width={"100%"}
                    height={400}
                    emojiStyle="google"
                  />
                </Box>
              )}

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  px: { xs: 1.5, sm: 2 },
                  py: 1.5,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <IconButton
                  aria-label={
                    showEmojiPicker ? "Close emoji picker" : "Add emoji"
                  }
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  color={showEmojiPicker ? "primary" : "default"}
                >
                  {showEmojiPicker ? <IoClose /> : <IoHappyOutline />}
                </IconButton>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  id="message"
                  autoComplete="off"
                  placeholder="Message…"
                  value={msg}
                  onChange={typingHandler}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <IconButton
                  aria-label="Send message"
                  onClick={handleSendMessage}
                  disabled={msg.trim() === "" || sending}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { bgcolor: "primary.dark" },
                    "&.Mui-disabled": {
                      bgcolor: "action.selected",
                      color: "text.secondary",
                    },
                  }}
                >
                  {sending ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <IoSend />
                  )}
                </IconButton>
              </Stack>
            </>
          ) : (
            <EmptyState
              image="/Images/sendMessage.png"
              title="Your messages"
              subtitle="Pick a conversation or search for someone to start chatting"
              sx={{ height: "100%" }}
            />
          )}
        </Box>
      </Paper>
    </AppShell>
  );
};
