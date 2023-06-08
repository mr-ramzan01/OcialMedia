import {
  Avatar,
  Box,
  Grid,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { CiSearch } from "react-icons/ci";
import { IoCallOutline, IoChevronBack } from "react-icons/io5";
import { BiVideo } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import EmojiPicker from "emoji-picker-react";
import moment from "moment";
import ScrollableFeed from "react-scrollable-feed";
import { io } from "socket.io-client";
import { UserMessages } from "../components/Messages/UserMessages";
import { LeftSideBar } from "../components/Bars/LeftSideBar";
import { Navbar } from "../components/Bars/Navbar";
import { BottomBar } from "../components/Bars/BottomBar";
import { root_url } from "../utils/url";
const ENDPOINT = "https://ocialmedia-backend.onrender.com";
const socket = io(ENDPOINT);
var selectedChatCompare;

export const Messages = () => {
  const {
    userData,
    sendMessageNotification,
    messagesNotification,
    deleteNotifications,
    userToken
  } = useContext(AuthContext);
  const [chatsData, setChatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelectedChat, setCurrentSelectedChat] = useState(undefined);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const [searchData, setSearchData] = useState([]);
  const searchRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [notify, setNotify] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("none");
  const [displayChats, setDisplayChats] = useState("block");

  useEffect(() => {
    setIsLoading(true);
    if (Object.keys(userData).length > 0) {
      getChats();
    }
  }, [userData]);

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      socket.emit("setup", userData);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  }, [userData]);

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      selectedChatCompare = currentSelectedChat;
      if (messagesNotification) {
        let haveNotifications = false;
        for (let i = 0; i < messagesNotification.length; i++) {
          if (
            messagesNotification[i].from === currentSelectedChat.users[1]._id ||
            messagesNotification[i].from === currentSelectedChat.users[0]._id
          ) {
            haveNotifications = true;
            break;
          }
        }
        if (haveNotifications) {
          {
            currentSelectedChat.users[0]._id === userData._id
              ? deleteNotifications(
                  currentSelectedChat.users[1]._id,
                  currentSelectedChat.users[0]._id
                )
              : deleteNotifications(
                  currentSelectedChat.users[0]._id,
                  currentSelectedChat.users[1]._id
                );
          }
        }
      }
    }
  }, [currentSelectedChat]);

  useEffect(() => {
    if (notify.length > 0) {
      sendMessageNotification(
        notify[notify.length - 1]._id,
        notify[notify.length - 1].sender._id
      );
    }
  }, [notify]);

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      socket.on("message received", (newMessageReceived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageReceived.chat_id._id
        ) {
          //give Notification
          if (!notify.includes(newMessageReceived)) {
            setNotify([...notify, newMessageReceived]);
          }
        } else {
          setMessages([...messages, newMessageReceived]);
        }
      });
    }
  });

  const typingHandler = (e) => {
    setMsg(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentSelectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", currentSelectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const getChats = () => {
    fetch(`${root_url}/api/chats/allchats`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setChatsData(res.data);
          if (res.data.length > 0) {
            setCurrentSelectedChat(res.data[0]);
            getAllMessages(res.data[0]);
          }
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSelectEmoji = (e) => {
    setMsg((prev) => prev + e.emoji);
  };

  const handleSendMessage = () => {
    socket.emit("stop typing", currentSelectedChat._id);
    if (msg === "") {
      return;
    }
    fetch(`${root_url}/api/messages/send`, {
      method: "POST",
      body: JSON.stringify({ message: msg, chat_id: currentSelectedChat._id }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`
      },
    })
      .then((res) => res.json())
      .then((res) => {
        socket.emit("new message", res.data);
        setMessages([...messages, res.data]);
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setShowEmojiPicker(false);
      });
    setMsg("");
  };

  const searchUsers = debounce(() => {
    fetch(`${root_url}/api/users/search?q=${searchRef.current.value}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        setSearchData(res.data);
      })
      .catch((err) => {
        console.log(err, "error");
      });
  }, 500);

  function debounce(fn, delay) {
    let id;
    return () => {
      clearTimeout(id);
      id = setTimeout(() => {
        fn();
      }, delay);
    };
  }

  const handleSelectSearchChat = (id) => {
    searchRef.current.value = "";
    setSearchData([]);
    handleAccessChat(id);
  };

  const handleChatClick = (chat) => {
    setCurrentSelectedChat(chat);
    getAllMessages(chat);
  };

  const goBackToChat = () => {
    setDisplayChats("block");
    setDisplayMessage("none");
  };

  const getAllMessages = (chat) => {
    fetch(`${root_url}/api/messages/get/${chat._id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setDisplayChats("none");
          setDisplayMessage("block");
          setMessages(res.data);
          socket.emit("join chat", chat._id);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const handleAccessChat = (user_id) => {
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
        getChats();
      });
  };

  const DateConvert = ({ date }) => {
    let newDate = moment(date).fromNow();
    const all = newDate.split(" ");
    all.splice(all.length - 1, 1);
    if (all[0] === "a" || all[0] === "an") {
      all[0] = 1;
    }
    if (all[1] === "few") {
      all[0] = "now";
      all.splice(1, 2);
    }
    if (all[1] === "second" || all[1] === "seconds") {
      all[1] = "s";
    }
    if (all[1] === "minute" || all[1] === "minutes") {
      all[1] = "m";
    }
    if (all[1] === "hour" || all[1] === "hours") {
      all[1] = "h";
    }
    if (all[1] === "day" || all[1] === "days") {
      all[1] = "d";
    }
    if (all[1] === "month" || all[1] === "months") {
      all[1] = "m";
    }
    if (all[1] === "year" || all[1] === "years") {
      all[1] = "y";
    }

    const updatedDate = all.join("");
    return <Typography fontSize="13px"> {updatedDate}</Typography>;
  };

  return (
    <>
      {isLoading && <Loader />}
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
          <Box
            m={{ xs: "60px 0", sm: "20px 0" }}
            height={{ xs: "calc(100vh - 125px)", sm: "calc(100vh - 45px)" }}
            display={"grid"}
            gridTemplateColumns={{
              xs: "calc(100vw - 40px) 100%",
              sm: "100% 100%",
              md: "40% 60%",
            }}
            width={{
              xs: "100%",
              sm: "500px",
              md: "800px",
              lg: "900px",
            }}
          >
            <Paper
              sx={{
                mr: { xs: "0", md: "20px" },
                border: "1px solid #d2d2d2",
                maxHeight: {
                  xs: "calc(100vh - 125px)",
                  sm: "calc(100vh - 45px)",
                },
                display: { xs: displayChats, md: "block" },
              }}
            >
              <Box height="100%" position="relative" zIndex="2">
                <Box>
                  <Stack
                    borderBottom="1px solid #d2d2d2"
                    p="20px 0"
                    height="30px"
                    direction="row"
                    gap="20px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Link
                      href={`/${userData.username}`}
                      underline="none"
                      color="#000"
                    >
                      <Typography
                        fontFamily={"Dancing Script"}
                        fontSize="22px"
                        fontWeight="600"
                      >
                        {userData.username}
                      </Typography>
                    </Link>
                  </Stack>
                  <TextField
                    fullWidth
                    onInput={searchUsers}
                    inputRef={searchRef}
                    placeholder="Search Users..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          border: "none",
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                      bgcolor: "transparent",
                      borderBottom: "1px solid #d2d2d2",
                    }}
                    type="text"
                    id="search"
                    autoComplete="off"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CiSearch
                            fontSize="20px"
                            style={{ cursor: "pointer" }}
                            onClick={searchUsers}
                          />
                        </InputAdornment>
                      ),
                      style: {
                        height: "40px",
                      },
                    }}
                  />
                  {searchData.length > 0 &&
                    searchRef.current.value.length > 0 && (
                      <Box
                        bgcolor="#fff"
                        zIndex="5"
                        position="absolute"
                        width="100%"
                        maxHeight="400px"
                      >
                        <Paper
                          sx={{
                            maxHeight: "200px",
                            overflowY: "scroll",
                            borderRadius: "5px",
                            mt: "10px",
                            "::-webkit-scrollbar": {
                              width: "5px",
                            },
                            "::-webkit-scrollbar-thumb": {
                              background: "#d1d1d1",
                              borderRadius: "10px",
                            },
                          }}
                          mt="10px"
                        >
                          <Box sx={{ p: "5px 10px" }}>
                            {searchData.map((el) => (
                              <Box
                                key={el._id}
                                onClick={() => handleSelectSearchChat(el._id)}
                                sx={{
                                  borderRadius: "10px",
                                  border: "1px solid #fff",
                                  "&:hover": {
                                    border: "1px solid #d2d2d2",
                                  },
                                }}
                              >
                                <Stack
                                  padding="5px 10px"
                                  sx={{ cursor: "pointer" }}
                                  alignItems="center"
                                  direction={"row"}
                                >
                                  <Avatar sx={{ mr: "30px" }} src={el.image} />
                                  <Box>
                                    <Typography
                                      fontSize="20px"
                                      fontWeight={600}
                                      fontFamily={"'Dancing Script', cursive"}
                                    >
                                      {el.username}
                                    </Typography>
                                    <Typography color="#8d929b">
                                      {el.full_name}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      </Box>
                    )}
                </Box>
                <Box
                  height="calc(100% - 135px)"
                  p="10px"
                  sx={{
                    overflowY: "scroll",
                    "::-webkit-scrollbar": {
                      width: "5px",
                    },
                    "::-webkit-scrollbar-thumb": {
                      background: "#d1d1d1",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <Stack>
                    {chatsData.length > 0 ? (
                      <Stack gap="10px">
                        {chatsData.map((el) => (
                          <Stack
                            border={
                              el._id === currentSelectedChat._id
                                ? "1px solid gray"
                                : "1px solid #fff"
                            }
                            key={el._id}
                            p="10px"
                            bgcolor="#f3f3f3"
                            direction="row"
                            borderRadius="10px"
                            boxSizing="border-box"
                            gap="20px"
                            alignItems="center"
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleChatClick(el)}
                          >
                            <Avatar
                              src={
                                el.users[0]._id === userData._id
                                  ? el.users[1].image
                                  : el.users[0].image
                              }
                              alt="userImage"
                              sx={{ height: "60px", width: "60px" }}
                            />
                            <Stack row="column" gap="5px" width="100%">
                              <Typography
                                fontFamily={"Dancing Script"}
                                fontSize="18px"
                                fontWeight="600"
                              >
                                {el.users[0]._id === userData._id
                                  ? el.users[1].full_name
                                  : el.users[0].full_name}
                              </Typography>
                              {el.latestMessage && (
                                <Stack
                                  fontSize="13px"
                                  alignItems="center"
                                  width="100%"
                                  justifyContent="space-between"
                                  direction="row"
                                >
                                  <Typography
                                    height="20px"
                                    width="100px"
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      WebkitLineClamp: 1,
                                      fontSize: "13px",
                                      display: "-webkit-box",
                                      width: "100px",
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  >
                                    {el.latestMessage.message}
                                  </Typography>
                                  <DateConvert
                                    date={el.latestMessage.createdAt}
                                  />
                                </Stack>
                              )}
                            </Stack>
                          </Stack>
                        ))}
                      </Stack>
                    ) : (
                      <Box>
                        <Box
                          display={"flex"}
                          justifyContent="center"
                          alignItems="center"
                          height="40vh"
                        >
                          <img
                            width="140px"
                            height="120px"
                            src="/Images/user.png"
                            alt=""
                          />
                        </Box>
                        <Typography
                          textAlign={"center"}
                          color="#a1a1a1"
                          fontSize="20px"
                        >
                          Search users to start the chat
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Paper>
            <Paper
              sx={{
                border: "1px solid #d2d2d2",
                maxHeight: {
                  xs: "calc(100vh - 125px)",
                  sm: "calc(100vh - 45px)",
                },
                display: { xs: displayMessage, md: "block" },
              }}
            >
              {currentSelectedChat ? (
                <Box height="100%" position="relative">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    borderBottom="1px solid #d2d2d2"
                  >
                    <Stack
                      direction="row"
                      p="20px 10px"
                      height="30px"
                      gap={{ xs: "10px", md: "20px" }}
                    >
                      <Stack gap="5px" alignItems="center" direction="row">
                        <Box display={{ xs: "block", md: "none" }}>
                          <IoChevronBack
                            onClick={goBackToChat}
                            fontSize="20px"
                            style={{ cursor: "pointer" }}
                          />
                        </Box>

                        <Avatar
                          sx={{ h: "40px", w: "40px" }}
                          src={
                            currentSelectedChat.users[0]._id === userData._id
                              ? currentSelectedChat.users[1].image
                              : currentSelectedChat.users[0].image
                          }
                          alt="userImage"
                        />
                      </Stack>
                      <Stack direction="column">
                        <Link
                          href={
                            currentSelectedChat.users[0]._id === userData._id
                              ? currentSelectedChat.users[1].username
                              : currentSelectedChat.users[0].username
                          }
                          underline="none"
                          color="#000"
                        >
                          <Typography
                            fontSize={{ xs: "15px", md: "20px" }}
                            fontWeight="500"
                          >
                            {currentSelectedChat.users[0]._id === userData._id
                              ? currentSelectedChat.users[1].full_name
                              : currentSelectedChat.users[0].full_name}
                          </Typography>
                        </Link>
                        <Typography height="25px" mt="-5px">
                          {istyping && "typing..."}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap="10px"
                      p="0 10px"
                    >
                      <IoCallOutline
                        fontSize="20px"
                        style={{ cursor: "pointer" }}
                      />
                      <BiVideo fontSize="20px" style={{ cursor: "pointer" }} />
                      <BsInfoCircle
                        fontSize="20px"
                        style={{ cursor: "pointer" }}
                      />
                    </Stack>
                  </Stack>
                  <Box
                    height={{
                      xs: "calc(100vh - 275px)",
                      sm: "calc(100vh - 195px)",
                    }}
                  >
                    <ScrollableFeed className="messageDiv">
                      <UserMessages messages={messages} />
                    </ScrollableFeed>
                  </Box>
                  <Box height="80px" display="flex" alignItems="center">
                    <Stack
                      direction="row"
                      height="40px"
                      border="1px solid gray"
                      width="100%"
                      m="0 20px"
                      pl="15px"
                      alignItems="center"
                      borderRadius="20px"
                    >
                      {showEmojiPicker ? (
                        <RxCross2
                          onClick={() => setShowEmojiPicker(false)}
                          style={{ cursor: "pointer" }}
                          color="gray"
                          fontSize="30px"
                        />
                      ) : (
                        <MdOutlineEmojiEmotions
                          fontSize="30px"
                          onClick={() => setShowEmojiPicker(true)}
                          style={{ cursor: "pointer" }}
                          color="gray"
                        />
                      )}
                      <Box
                        position="absolute"
                        width="calc(100% - 20px)"
                        bottom="80px"
                        left="10px"
                      >
                        {showEmojiPicker && (
                          <EmojiPicker
                            onEmojiClick={(e) => handleSelectEmoji(e)}
                            theme="light"
                            width={"100%"}
                            height={400}
                            emojiStyle="google"
                          />
                        )}
                      </Box>
                      <TextField
                        fullWidth
                        value={msg}
                        onChange={typingHandler}
                        placeholder="Message"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                              border: "none",
                            },
                            "&.Mui-focused fieldset": {
                              border: "none",
                            },
                          },
                          bgcolor: "transparent",
                        }}
                        type="text"
                        id="message"
                        autoComplete="off"
                        InputProps={{
                          style: {
                            height: "40px",
                          },
                        }}
                      />
                      <Box
                        onClick={handleSendMessage}
                        sx={{
                          width: "100px",
                          height: "100%",
                          display: "grid",
                          placeContent: "center",
                          borderRadius: "20px",
                          cursor: "pointer",
                          bgcolor: "#d2d2d2",
                        }}
                      >
                        <AiOutlineSend fontSize="25px" color="#676767" />
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Stack color="#a1a1a1">
                    <Grid display="grid" sx={{ placeContent: "center" }}>
                      <img
                        width="130px"
                        height="130px"
                        src="/Images/sendMessage.png"
                        alt=""
                      />
                    </Grid>
                    <Typography fontSize="20px" textAlign="center">
                      Welcome{" "}
                      <Typography
                        fontSize="25px"
                        component="span"
                        color="#0066ff"
                      >
                        {userData.full_name}
                      </Typography>
                    </Typography>
                    <Typography fontSize="20px" textAlign="center">
                      Please Select the user to show the chat
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Stack>
    </>
  );
};
