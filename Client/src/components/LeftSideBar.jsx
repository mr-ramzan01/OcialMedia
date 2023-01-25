import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Slide,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  AiFillHome,
  AiOutlineMessage,
  AiOutlinePlusSquare,
} from "react-icons/ai";
import { BsSearch, BsSuitHeart } from "react-icons/bs";
import { MdOutlineExplore } from "react-icons/md";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Loader } from "./Loader";

export const LeftSideBar = () => {
  const [open, setOpen] = useState(false);
  const [postsOption, setPostsOption] = useState(false);
  const [previewOption, setPreviewOption] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const { userData, getUser, messagesNotification, hasGeneralNotifications, generalNotifications } = useContext(AuthContext);
  const [tagsInput, setTagsInput] = useState("");
  const [postData, setPostData] = useState({ caption: "", location: "" });
  const [postFiles, setPostFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    statusOpen: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, statusOpen } = state;
  
  useEffect(() => {
    getUser();
    // if(generalNotifications) {
      hasGeneralNotifications();
    // }
  }, []);

  const logout = () => {
    setOpen(false);
    fetch("/users/loggedOutUser")
      .then((res) => res.json())
      .then((res) => {
        window.location.reload();
        console.log("res", res);
      });
  };
  const handleLogout = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPostsOption(false);
    setPreviewOption(false);
    setTags([]);
    setPostData({ caption: "", location: "" });
    setPostFiles([]);
  };

  const handleStatusClose = () => {
    setState({ ...state, statusOpen: false });
  };

  const handleCreatePost = (e) => {
    const files = Array.from(e.target.files);
    setPostFiles(files);

    if (files.length > 5) {
      setMessage("You cannot select more than 5 files");
      setSeverity("error");
      setState({ ...state, statusOpen: true });
      return;
    }

    setPreviewImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
    setPostsOption(false);
    setPreviewOption(true);
  };

  const handleTags = (e) => {
    if (e.key === " ") {
      const newInput = e.target.value.substring(0, e.target.value.length - 1);
      setTagsInput(newInput);
    }
    if (e.key === "Enter") {
      setTags((prev) => [...prev, e.target.value]);
      setTagsInput("");
    }
  };

  const handleRemoveTag = (val) => {
    const newTags = [...tags];
    let index = newTags.indexOf(val);
    newTags.splice(index, 1);
    setTags(newTags);
  }


  const handleSharePost = async () => {

    if(postData.caption === '') {
      setMessage("Please write a caption");
      setSeverity("error");
      setState({ ...state, statusOpen: true });
      return;
    }
    setLoading(true);
    setPreviewOption(false);
    let postImages = [];
    for(let i=0; i<postFiles.length; i++) {
      var formDatafile = new FormData();
      formDatafile.append("posts", postFiles[i]);
      await fetch('/posts/upload-poston-cloudinary', {
        method: 'POST',
        body: formDatafile,
      })
      .then(res => res.json())
      .then(res => {
        console.log(res, 'result');
        const data = {
          public_id: res.data.public_id,
          url: res.data.secure_url
        };
        postImages.push(data);
      })
      .catch(err => {
        console.log(err, 'error');
      })
    }
    // console.log(postImages, 'imgs');

    const data = {...postData, tags: tags, post_images: postImages};
    // console.log(data, 'data');

    fetch('/posts/create', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.success) {
        setMessage(res.message);
        setSeverity("success");
        setState({ ...state, statusOpen: true });
        getUser();
        window.location.reload();
      }
      else {
        setMessage("Something went wrong");
        setSeverity("error");
        setState({ ...state, statusOpen: true });
      }
    })
    .catch(err => {
      console.log(err, 'error');
      setMessage("Internal Server Error");
      setSeverity("error");
      setState({ ...state, statusOpen: true });
    })
    .finally(() => {
      setLoading(false);
      handleClose();
    })
  };




  return (
    <>
    {loading?<Loader/>:<Box></Box>}
      <Box
        overflow={"scroll"}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
        padding="0 20px"
        width="200px"
        bgcolor={"#fff"}
        borderRight="1px solid #d2d2d2"
        zIndex={"100"}
        color="#000000"
        height="100vh"
        position={"fixed"}
      >
        <Box>
          <Typography
            variant="h4"
            mt="40px"
            component={"h1"}
            fontFamily="'Dancing Script', cursive"
          >
            Ocial Media
          </Typography>
          <Stack direction={"column"}>
            <Link
              href="/"
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="20px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
            >
              <AiFillHome fontSize={"25px"} />
              <Typography ml="15px">Home</Typography>
            </Link>
            <Link
              href="/search"
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="10px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
            >
              <BsSearch fontSize={"25px"} />
              <Typography ml="15px">Search</Typography>
            </Link>
            <Link
              href="/explore"
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="10px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
            >
              <MdOutlineExplore fontSize={"25px"} />
              <Typography ml="15px">Explore</Typography>
            </Link>
            <Link
              href="/messages"
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="10px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
            >
              <Badge
                sx={{
                  "& .MuiBadge-badge": {
                    color: "#fff",
                    backgroundColor: "red",
                  },
                }}
                badgeContent={messagesNotification.length}
                overlap="circular"
              >
                <AiOutlineMessage fontSize={"25px"} />
              </Badge>
              <Typography ml="15px">Messages</Typography>
            </Link>
            <Link
              href="/notifications"
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="10px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
            >
              <Badge
                sx={{
                  "& .MuiBadge-badge": {
                    color: "#fff",
                    backgroundColor: "red",
                  },
                }}
                variant="dot"
                invisible={generalNotifications}
                overlap="circular"
              >
                <BsSuitHeart fontSize={"25px"} />
              </Badge>
              <Typography ml="15px">Notifications</Typography>
            </Link>
            <Link
              onClick={() => setPostsOption(true)}
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="10px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
            >
              <AiOutlinePlusSquare fontSize={"25px"} />
              <Typography ml="15px">Create</Typography>
            </Link>
            <Link
              href={`/${userData.username}`}
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="10px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
            >
              <Avatar
                src={userData.image}
                sx={{ width: "27px", height: "27px" }}
              />
              <Typography ml="15px">Profile</Typography>
            </Link>
            <Link
              href="/settings"
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="10px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
            >
              <IoSettingsOutline fontSize={"25px"} />
              <Typography ml="15px">Settings</Typography>
            </Link>
            <Link
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="10px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
              onClick={handleLogout}
            >
              <IoLogOutOutline fontSize={"25px"} />
              <Typography ml="15px">Logout</Typography>
            </Link>
          </Stack>
        </Box>
      </Box>
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle fontSize={"15px"} id="alert-dialog-title">
            {"Are you sure you want to logout?"}
          </DialogTitle>
          <DialogActions sx={{ padding: "10px 20px" }}>
            <Button
              sx={{
                fontSize: "12px",
                color: "gray",
                "&:hover": { background: "none" },
              }}
              size="small"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              sx={{
                fontSize: "12px",
                color: "#000",
                fontWeight: "600",
                "&:hover": { background: "none" },
              }}
              size="small"
              onClick={logout}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog open={postsOption} onClose={handleClose}>
          <Box width="300px">
            <DialogTitle
              borderBottom={"1px solid gray"}
              textAlign="center"
              sx={{ padding: "7px 0" }}
              color="#000"
              fontSize="18px"
              id="alert-dialog-title"
            >
              {"Create new post"}
            </DialogTitle>
            <DialogContent sx={{ paddingBottom: "50px" }}>
              <Grid
                display={"grid"}
                sx={{ placeContent: "center", padding: "70px 0" }}
              >
                <Box>
                  <img
                    width="80px"
                    height="60px"
                    src="/Images/photo-icon.png"
                    style={{ position: "relative", zIndex: "5" }}
                    alt=""
                  />
                  <img
                    width="80px"
                    height="60px"
                    style={{
                      position: "relative",
                      marginLeft: "-60px",
                      marginBottom: "8px",
                      transform: "rotate(10deg)",
                      zIndex: "3",
                    }}
                    src="/Images/photo-icon.png"
                    alt=""
                  />
                </Box>
              </Grid>
              <Grid>
                <InputLabel
                  htmlFor="postcreate"
                  sx={{
                    width: "180px",
                    margin: "auto",
                    color: "#fff",
                    borderRadius: "5px",
                    padding: "10px 0",
                    bgcolor: "#0099ff",
                    textAlign: "center",
                    "&:hover": { cursor: "pointer" },
                  }}
                >
                  Upload from library
                </InputLabel>
                <TextField
                  onChange={handleCreatePost}
                  id="postcreate"
                  type="file"
                  sx={{ display: "none" }}
                  inputProps={{
                    accept: "image/png, image/jpg, image/jpeg",
                    multiple: true,
                  }}
                ></TextField>
              </Grid>
            </DialogContent>
          </Box>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          fullWidth
          maxWidth="md"
          open={previewOption}
          onClose={handleClose}
        >
          <DialogActions
            sx={{ padding: "10px 20px 5px 0", borderBottom: "1px solid gray" }}
          >
            <Typography
              onClick={handleClose}
              color="gray"
              sx={{ cursor: "pointer", mr: "20px" }}
            >
              Cancel
            </Typography>
            <Typography
              onClick={handleSharePost}
              color="#0066ff"
              sx={{ cursor: "pointer" }}
            >
              Share
            </Typography>
          </DialogActions>
          <DialogContent>
            <Stack direction="row" gap="20px">
              <Box overflow="hidden" borderRadius="10px" width="50%">
                <Carousel
                  showStatus={false}
                  showIndicators={previewImages.length > 1}
                  showThumbs={false}
                >
                  {previewImages.map((el) => (
                    <img key={el} style={{objectFit: 'contain'}} width="100%" height="300px" src={el} alt="" />
                  ))}
                </Carousel>
              </Box>
              <Box width="50%">
                <Stack direction="column">
                  <Stack direction="row" alignItems="flex-end">
                    <Avatar sx={{ marginRight: "20px" }} src={userData.image} />
                    <Typography
                      fontFamily={"Dancing Script"}
                      fontSize="25px"
                      fontWeight="600"
                    >
                      {userData.username}
                    </Typography>
                  </Stack>
                  <Box>
                    <TextField
                      placeholder="Write your caption..."
                      type="text"
                      fullWidth
                      autoFocus
                      onChange={(e) =>
                        setPostData({ ...postData, caption: e.target.value })
                      }
                      margin="normal"
                      sx={{
                        border: "1px solid blue",
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
                        bgcolor: "#fff",
                        borderRadius: "5px",
                        border: "1px solid gray",
                      }}
                      inputProps={{
                        maxLength: 70,
                      }}
                      name="caption"
                      id="caption"
                      InputProps={{
                        style: {
                          height: "30px",
                        },
                      }}
                    />
                    <TextField
                      placeholder="Add location"
                      type="text"
                      fullWidth
                      onChange={(e) =>
                        setPostData({ ...postData, location: e.target.value })
                      }
                      margin="normal"
                      sx={{
                        border: "1px solid blue",
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
                        bgcolor: "#fff",
                        borderRadius: "5px",
                        border: "1px solid gray",
                      }}
                      inputProps={{
                        maxLength: 50,
                      }}
                      name="tags"
                      id="tags"
                      InputProps={{
                        style: {
                          height: "30px",
                        },
                      }}
                    />
                    <TextField
                      placeholder="Add your tags..."
                      type="text"
                      fullWidth
                      disabled={tags.length === 5}
                      onKeyUp={handleTags}
                      onChange={(e) => setTagsInput(e.target.value)}
                      value={tagsInput}
                      margin="normal"
                      sx={{
                        border: "1px solid blue",
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
                        bgcolor: "#fff",
                        borderRadius: "5px",
                        border: "1px solid gray",
                      }}
                      name="tags"
                      id="tags"
                      inputProps={{
                        maxLength: 25,
                      }}
                      InputProps={{
                        style: {
                          height: "30px",
                        },
                      }}
                    />
                    <Box mt="20px">
                      <Typography>
                        {tags.length > 0 &&
                          tags.map((tag, i) => (
                            <Typography
                              onClick={() => handleRemoveTag(tag)}
                              component="span"
                              sx={{
                                color: "#0066ff",
                                cursor: "pointer",
                                "&:hover": { color: "red" },
                              }}
                              key={i}
                            >
                              {" "}
                              #{tag}{" "}
                            </Typography>
                          ))}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
        </Dialog>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={statusOpen}
        autoHideDuration={5000}
        TransitionComponent={Slide}
        onClose={handleStatusClose}
        key={vertical + horizontal}
      >
        <Alert
          icon={false}
          onClose={handleStatusClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
