import {
  Avatar,
  Box,
  Container,
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
import { LeftSideBar } from "../components/LeftSideBar";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { CiSearch } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import { BiVideo } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import EmojiPicker from "emoji-picker-react";
import moment from "moment";

export const Messages = () => {
  const { userData } = useContext(AuthContext);
  const [chatsData, setChatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelectedChat, setCurrentSelectedChat] = useState(undefined);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const [showSearchData, setShowSearchData] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const searchRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    if (Object.keys(userData).length > 0) {
      getChats();
    }
  }, [userData]);

  const getChats = () => {
    fetch(`/chats/allchats`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setChatsData(res.data);
          if (res.data.length > 0) {
            setCurrentSelectedChat(res.data[0]);
            getAllMessages(res.data[0]);
          }
          console.log(res, "result");
        } else {
          console.log(res, "re");
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
    console.log(msg, "msg");
    if (msg === "") {
      return;
    }
    fetch(`/messages/send`, {
      method: "POST",
      body: JSON.stringify({ message: msg, chat_id: currentSelectedChat._id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        showEmojiPicker(false);
      });
    setMsg("");
  };

  const searchUsers = debounce(() => {
    console.log(searchRef.current.value);
    fetch(`/users/search?q=${searchRef.current.value}`)
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

  const getAllMessages = (chat) => {
    fetch(`/messages/get/${chat._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setMessages(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        handleScroll();
      })
  };

  const handleAccessChat = (user_id) => {
    fetch(`/chats/create`, {
      method: "POST",
      body: JSON.stringify({ userId: user_id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
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

  const handleScroll = () => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  // handleScroll();

  return (
    <>
      {isLoading && <Loader />}
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box
          marginLeft="240px"
          width="100%"
          display="grid"
          justifyContent="center"
        >
          <Box
            m="20px 0"
            height="90vh"
            display={"grid"}
            gridTemplateColumns="40% 60%"
            width="900px"
          >
            <Paper
              sx={{
                mr: "20px",
                border: "1px solid #d2d2d2",
                maxHeight: "90vh",
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
                            className={`${
                              currentSelectedChat &&
                              el._id === currentSelectedChat._id
                                ? "selected"
                                : "non"
                            }`}
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
                              src={el.users[1].image}
                              alt="userImage"
                              sx={{ height: "60px", width: "60px" }}
                            />
                            <Stack row="column" gap="5px" width="100%">
                              <Typography
                                fontFamily={"Dancing Script"}
                                fontSize="18px"
                                fontWeight="600"
                              >
                                {el.users[1].full_name}
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
            <Paper sx={{ border: "1px solid #d2d2d2", maxHeight: "90vh" }}>
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
                      gap="20px"
                      alignItems="center"
                    >
                      <Avatar
                        sx={{ h: "40px", w: "40px" }}
                        src={currentSelectedChat.users[1].image}
                        alt="userImage"
                      />
                      <Link
                        href={currentSelectedChat.users[1].username}
                        underline="none"
                        color="#000"
                      >
                        <Typography fontSize="20px" fontWeight="500">
                          {currentSelectedChat.users[1].full_name}
                        </Typography>
                      </Link>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap="10px"
                      p="0 10px"
                    >
                      <IoCallOutline
                        fontSize="25px"
                        style={{ cursor: "pointer" }}
                      />
                      <BiVideo fontSize="25px" style={{ cursor: "pointer" }} />
                      <BsInfoCircle
                        fontSize="25px"
                        style={{ cursor: "pointer" }}
                      />
                    </Stack>
                  </Stack>
                  <Box
                    ref={scrollRef}
                    sx={{
                      overflowY: "scroll",
                      "::-webkit-scrollbar": {
                        width: "5px",
                      },
                      "::-webkit-scrollbar-thumb": {
                        background: "#d1d1d1",
                        borderRadius: "10px",
                      },
                      p: "10px 10px 0 10px",
                    }}
                    height="calc(100% - 150px)"
                  >
                    {messages.length > 0 ? (
                      <Stack gap='10px'>
                        {messages.map((el) => (
                          <Box
                            marginLeft={userData._id === el.sender._id && "30%"}
                            width="70%"
                            key={el._id}
                          >
                            <Stack
                              direction={
                                userData._id === el.sender._id
                                  ? "row-reverse"
                                  : "row"
                              }
                              gap="10px"
                            >
                              <Avatar
                                sx={{ h: "40px", w: "40px" }}
                                src={el.sender.image}
                                alt="userImage"
                              />
                              <Box
                                sx={{
                                  p: "5px 8px",
                                  borderRadius: "10px",
                                  bgcolor: "#f1f1f1",
                                }}
                              >
                                <Typography>{el.message}</Typography>
                                <Typography fontSize="12px" textAlign="right">
                                  {el.createdAt.substring(11, 16)}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Stack justifyContent='center' alignItems='center' height='100%'>
                        <img src="/Images/sendMessage.png" style={{height: '100px', width: '100px'}} alt="" />
                        <Typography>Type message to start the chat</Typography>
                      </Stack>
                    )}
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
                      <Box position="absolute" bottom="80px" left="20px">
                        {showEmojiPicker && (
                          <EmojiPicker
                            onEmojiClick={(e) => handleSelectEmoji(e)}
                            theme="light"
                            width={495}
                            height={350}
                            emojiStyle="google"
                          />
                        )}
                      </Box>
                      <TextField
                        fullWidth
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
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
