import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  Link,
  TextField,
  Typography,
  Stack,
  Avatar,
  DialogActions
} from "@mui/material";
import { useContext, useState } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { AuthContext } from "../../context/AuthContext";
import { Loader } from "../Loader";
import { Carousel } from "react-responsive-carousel";
import { ShowAlert } from "../Alert";

export const CreateIcon = () => {
  const [postsOption, setPostsOption] = useState(false);
  const [postFiles, setPostFiles] = useState([]);
  const [previewOption, setPreviewOption] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [tagsInput, setTagsInput] = useState("");
  const [postData, setPostData] = useState({ caption: "", location: "" });
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [loading, setLoading] = useState(false);
  const { userData, getUser } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);



  const handleCreatePost = (e) => {
    const files = Array.from(e.target.files);
    setPostFiles(files);

    if (files.length > 5) {
      setMessage("You cannot select more than 5 files");
      setSeverity("error");
      setShowAlert(true);
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

  const handleClose = () => {
    setPostsOption(false);
    setPreviewOption(false);
    setTags([]);
    setPostData({ caption: "", location: "" });
    setPostFiles([]);
  };

  const handleSharePost = async () => {

    if(postData.caption === '') {
      setMessage("Please write a caption");
      setSeverity("error");
      setShowAlert(true);
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
  setShowAlert(true);
        getUser();
        window.location.reload();
      }
      else {
        setMessage("Something went wrong");
        setSeverity("error");
  setShowAlert(true);
      }
    })
    .catch(err => {
      console.log(err, 'error');
      setMessage("Internal Server Error");
      setSeverity("error");
      setShowAlert(true);
    })
    .finally(() => {
      setLoading(false);
      handleClose();
    })
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
  return (
    <>
     {loading && <Loader/>}
     {showAlert && (
        <ShowAlert
          message={message}
          severity={severity}
          alertOpen={showAlert}
          setAlertOpen={setShowAlert}
        />
      )}
      <Link
        onClick={() => setPostsOption(true)}
        sx={{
          "&:hover": {
            backgroundColor:{xs: '', lg: "#fafafa"},
            cursor: "pointer",
            borderRadius: "20px",
          },
        }}
        m={{xs: '0', sm: "10px 0 8px 0"}}
        color={"#000"}
        p="10px"
        underline="none"
        display={{xs: 'block', lg: 'flex'}}
        alignItems={"center"}
      >
        <AiOutlinePlusSquare fontSize={"25px"} />
        <Typography display={{ xs: "none", lg: "block" }} ml="15px">
          Create
        </Typography>
      </Link>
      {/* <Box> */}
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
      {/* </Box> */}
      {/* <Box> */}
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
      {/* </Box> */}
    </>
  );
};
