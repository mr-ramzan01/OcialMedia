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
import React, { useState } from "react";
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

export const Messages = () => {
  const { userData } = useContext(AuthContext);
  const [usersForMessage, setUsersForMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelectedUser, setCurrentSelectedUser] = useState(undefined);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setIsLoading(true);
    if (Object.keys(userData).length > 0) {
      getFollowing();
    }
  }, [userData]);

  const getFollowing = () => {
    fetch(`/follows/getFollowing?userID=${userData._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUsersForMessage(res.data);
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
    console.log(msg, "msg");
    setMsg("");
  };

  const handleChatClick = (val) => {
    setCurrentSelectedUser(val);
  };

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
              <Box height="100%">
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
                          />
                        </InputAdornment>
                      ),
                      style: {
                        height: "40px",
                      },
                    }}
                  />
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
                    {usersForMessage.length > 0 ? (
                      <Stack gap="10px">
                        {usersForMessage.map((el) => (
                          <Stack
                            // border="1px solid gray"
                            key={el._id}
                            p="10px"
                            bgcolor="#f3f3f3"
                            direction="row"
                            borderRadius="10px"
                            gap="20px"
                            alignItems="center"
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleChatClick(el.follower_Id)}
                          >
                            <Avatar
                              src={el.follower_Id.image}
                              alt="userImage"
                              sx={{ height: "60px", width: "60px" }}
                            />
                            <Typography
                              fontFamily={"Dancing Script"}
                              fontSize="18px"
                              fontWeight="600"
                            >
                              {el.follower_Id.full_name}
                            </Typography>
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
              {currentSelectedUser ? (
                <Box
                  height="100%"
                  position="relative"
                >
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
                        src={currentSelectedUser.image}
                        alt="userImage"
                      />
                      <Link
                        href={currentSelectedUser.username}
                        underline="none"
                        color="#000"
                      >
                        <Typography fontSize="20px" fontWeight="500">
                          {currentSelectedUser.full_name}
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
                    sx={{
                      overflowY: "scroll",
                      "::-webkit-scrollbar": {
                        width: "5px",
                      },
                      "::-webkit-scrollbar-thumb": {
                        background: "#d1d1d1",
                        borderRadius: "10px",
                      },
                      p: '0 10px'
                    }}
                    height="calc(100% - 150px)"
                  >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Harum dolores autem adipisci at corporis impedit, minus
                    officiis, facere blanditiis nemo cumque ullam suscipit
                    nihil. Corporis ratione nisi velit placeat. Sequi. Quidem ut
                    esse et debitis quos hic alias! Obcaecati quaerat architecto
                    enim, provident maiores corporis alias? Voluptates, vitae
                    voluptatibus quos quibusdam consectetur adipisci similique
                    reprehenderit vero assumenda exercitationem repellendus
                    nesciunt. Saepe recusandae nostrum natus aperiam earum ad
                    nihil iusto quaerat quia soluta, veniam reprehenderit porro
                    impedit dicta officia perspiciatis placeat vel, maiores nam
                    dolores voluptatibus et harum. Aut, omnis ab? Doloribus
                    itaque tempore ex vero dolorum, repellendus blanditiis quis
                    praesentium eum necessitatibus, porro veritatis fugiat
                    maxime, unde temporibus alias autem a libero! Doloribus
                    accusantium veniam commodi at repudiandae fugit sed. Eum
                    quos delectus ipsum vel velit quibusdam aliquam nesciunt
                    accusamus, quo, nulla laboriosam. Rem unde repellat, nostrum
                    in quia saepe earum maiores quisquam ipsam sequi!
                    Repellendus provident sequi ipsa fugiat! Nesciunt ipsa eius
                    dicta aspernatur suscipit? Unde deserunt, sequi molestias
                    fugit blanditiis autem quibusdam omnis. Libero sed aperiam
                    eaque consequatur omnis eius, blanditiis maiores veniam quos
                    illum molestiae numquam totam! Quaerat rem delectus ab
                    pariatur molestias nesciunt sint? Minus, iusto placeat.
                    Harum est, vel culpa veniam facere dolore ut ipsam soluta
                    nisi, illum ad nihil illo repellat tenetur magnam veritatis.
                    Architecto vel dolore earum sequi fugiat totam id dolorem
                    quasi culpa at quisquam autem maxime cum atque cumque
                    officiis dolores animi sed neque minima aliquid quod,
                    voluptatibus magni. Nesciunt, qui! Harum, alias. Repudiandae
                    possimus, minima soluta quos modi suscipit debitis odio,
                    sequi distinctio mollitia maxime inventore asperiores autem
                    id quidem cum architecto dignissimos? Sint porro numquam cum
                    exercitationem perspiciatis assumenda! Cumque, iusto! Totam
                    at, non possimus, dignissimos corrupti laborum officiis
                    natus aliquam reiciendis eaque autem deleniti modi odio
                    consequatur alias minima dicta atque quis veniam commodi
                    eveniet, sit rerum? Voluptas?
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
                      {
                        showEmojiPicker ? <RxCross2
                        onClick={() => setShowEmojiPicker(false)}
                        style={{ cursor: "pointer" }}
                        color="gray"
                        fontSize="30px"
                        /> :
                        <MdOutlineEmojiEmotions
                        fontSize="30px"
                        onClick={() => setShowEmojiPicker(true)}
                        style={{ cursor: "pointer" }}
                        color="gray"
                      />
                      }
                      <Box position="absolute" bottom="80px" left='20px'>
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
                        <AiOutlineSend fontSize="25px" color='#676767' />
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
