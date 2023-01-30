import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ShowAlert } from "../Alert";
import { Loader } from "../Loader";

export const EditProfile = () => {
  const { getUser, userData, editData, setEditData } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [showAlert, setShowAlert] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = () => {
    setProfileOpen(true);
  };

  const handleRemoveProfile = () => {
    if (userData.image === "") {
      setProfileOpen(false);
      return;
    }
    setProfileOpen(false);
    setLoading(true);
    fetch("/users/remove-profile-photo", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        getUser();
        setMessage("Profile removed successfully");
        setSeverity("success");
        setShowAlert(true);
      })
      .catch((err) => {
        console.log(err, "error");
        setMessage("Internal Server Error");
        setSeverity("error");
        setShowAlert(true);
      })
      .finally(() => {
        setLoading(false);
        setProfileOpen(false);
      });
  };

  const handleUploadProfile = (e) => {
    const file = e.target.files[0];

    var data = new FormData();
    data.append("profile", file);
    setProfileOpen(false);
    setLoading(true);
    fetch(`/users/upload-profile-photo/`, {
      method: "PATCH",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          setMessage(res.message);
          setSeverity("success");
          setShowAlert(true);
          getUser();
        }
      })
      .catch((err) => {
        console.log(err, "error");
        setMessage("Something went wrong please try later");
        setSeverity("error");
        setShowAlert(true);
      })
      .finally(() => {
        setLoading(false);
        setProfileOpen(false);
      });
  };

  const editDataValidation = () => {
    if (editData.full_name.length <= 1) {
      setMessage("Your name should be at least 3 characters long");
      setSeverity("error");
      setShowAlert(true);
      return false;
    }
    if (!editData.email.includes("@") || !editData.email.includes(".")) {
      setMessage("Your email address should includes '@' and '.' ");
      setSeverity("error");
      setShowAlert(true);
      return false;
    } else if (
      editData.email[editData.email.length - 1] === "." ||
      editData.email[editData.email.length - 1] === "@"
    ) {
      setMessage("Your email address should not end with '@' and '.' ");
      setSeverity("error");
      setShowAlert(true);
      return false;
    }
    if (editData.mobile_no.length > 0) {
      if (editData.mobile_no.includes(".")) {
        setMessage("Mobile no. should not include '.'");
        setSeverity("error");
        setShowAlert(true);
        return false;
      } else if (editData.mobile_no.length !== 10) {
        setMessage("Mobile no. should be 10 digits only");
        setSeverity("error");
        setShowAlert(true);
        return false;
      }
    }
    return true;
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditProfileSubmit = (event) => {
    event.preventDefault();
    const validation = editDataValidation();
    if (validation) {
      setLoading(true);
      fetch(`/users/udpate-user-profile`, {
        method: "PATCH",
        body: JSON.stringify(editData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setMessage(res.message);
            setSeverity("success");
            setShowAlert(true);
          } else {
            setMessage(res.message);
            setSeverity("error");
            setShowAlert(true);
          }
        })
        .catch((err) => {
          console.log(err, "error");
          setMessage("Something went wrong please try later");
          setSeverity("error");
          setShowAlert(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleClose = () => {
    setProfileOpen(false);
  };
  return (
    <>
      {loading && <Loader />}
      {showAlert && (
        <ShowAlert
          message={message}
          severity={severity}
          alertOpen={showAlert}
          setAlertOpen={setShowAlert}
        />
      )}
      <Box
        width={{ xs: "calc(100% - 30px)", sm: "85%", md: "70%", lg: "60%" }}
        p={{ xs: "0 15px 20px 15px", sm: "0 0 40px 0" }}
        m="auto"
        mt="20px"
        pb="40px"
      >
        <Stack
          direction={"row"}
          gap="20px"
          alignItems={"center"}
        >
          <Box>
            <Avatar
              sx={{
                width: { xs: "50px", sm: "80px" },
                height: { xs: "50px", sm: "80px" },
              }}
              src={userData.image}
            />
          </Box>
          <Stack row="column">
            <Typography
              fontSize="20px"
              fontWeight={600}
              fontFamily="'Petrona', serif"
              fontStyle={"italic"}
            >
              {userData.username}
            </Typography>
            <Typography
              onClick={handleProfileUpdate}
              color="#0066ff"
              sx={{ cursor: "pointer" }}
            >
              Change profile photo
            </Typography>
          </Stack>
        </Stack>
        <Box component="form" onSubmit={handleEditProfileSubmit}>
          <Grid container>
            <Stack
              m={"40px 0"}
              gap="20px"
              alignItems="center"
              width="100%"
              direction={"row"}
            >
              <Typography width="20%">Full Name</Typography>
              <TextField
                autoComplete="given-name"
                name="full_name"
                type="text"
                value={editData.full_name}
                required
                sx={{
                  width: "80%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      border: "#f1f1f1",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                  bgcolor: "#f1f1f1",
                  borderRadius: "5px",
                }}
                id="full_name"
                InputProps={{
                  style: {
                    height: "50px",
                  },
                }}
                onChange={handleEditChange}
              />
            </Stack>
            <Stack
              m={"20px 0"}
              gap="20px"
              alignItems="center"
              width="100%"
              direction={"row"}
            >
              <Typography width="20%">Username</Typography>
              <TextField
                autoComplete="given-username"
                name="username"
                type="text"
                value={editData.username}
                required
                sx={{
                  width: "80%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      border: "#f1f1f1",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                  bgcolor: "#f1f1f1",
                  borderRadius: "5px",
                }}
                id="username"
                InputProps={{
                  style: {
                    height: "50px",
                  },
                }}
                onChange={handleEditChange}
              />
            </Stack>
            <Stack
              m={"20px 0"}
              gap="20px"
              alignItems="center"
              width="100%"
              direction={"row"}
            >
              <Typography width="20%">Bio</Typography>
              <TextField
                autoComplete="given-bio"
                name="bio"
                type="text"
                value={editData.bio}
                multiline
                rows={4}
                sx={{
                  width: "80%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      border: "#f1f1f1",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                  bgcolor: "#f1f1f1",
                  borderRadius: "5px",
                }}
                id="bio"
                onChange={handleEditChange}
              />
            </Stack>
            <Stack
              m={"20px 0"}
              gap="20px"
              alignItems="center"
              width="100%"
              direction={"row"}
            >
              <Typography width="20%">Email</Typography>
              <TextField
                autoComplete="given-email"
                disabled={userData.authType === "google"}
                name="email"
                required
                type="email"
                value={editData.email}
                sx={{
                  width: "80%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      border: "#f1f1f1",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                  bgcolor: "#f1f1f1",
                  borderRadius: "5px",
                }}
                id="email"
                InputProps={{
                  style: {
                    height: "50px",
                  },
                }}
                onChange={handleEditChange}
              />
            </Stack>
            <Stack
              m={"20px 0"}
              gap="20px"
              alignItems="center"
              width="100%"
              direction={"row"}
            >
              <Typography width="20%">Mobile No.</Typography>
              <TextField
                autoComplete="given-number"
                name="mobile_no"
                type="number"
                value={editData.mobile_no}
                sx={{
                  width: "80%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      border: "#f1f1f1",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                  bgcolor: "#f1f1f1",
                  borderRadius: "5px",
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      display: "none",
                    },
                }}
                id="mobile_no"
                inputProps={{
                  maxLength: 10,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment sx={{ color: "black" }} position="start">
                      +91{" "}
                    </InputAdornment>
                  ),
                  style: {
                    height: "50px",
                  },
                }}
                onChange={handleEditChange}
              />
            </Stack>
          </Grid>
          <Stack gap="20px" direction="row">
            <Box width="20%"></Box>
            <Box width="80%">
              <Button
                type="submit"
                disabled={userData === editData}
                size="large"
                variant="contained"
                sx={{
                  mt: 3,
                  boxShadow: "none",
                  background: "#129ffd",
                  "&:hover": {
                    background: "#0066ff",
                    boxShadow: "none",
                  },
                }}
              >
                Update
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
      <Dialog onClose={handleClose} open={profileOpen}>
        <DialogTitle sx={{ color: "#000", fontSize: "15px" }}>
          Change Profile Photo
        </DialogTitle>
        <Divider />
        <InputLabel
          htmlFor="filePicker"
          sx={{
            color: "#0066ff",
            padding: "15px 0",
            textAlign: "center",
            "&:hover": { cursor: "pointer" },
          }}
        >
          Upload Photo
        </InputLabel>
        <TextField
          onChange={handleUploadProfile}
          onClick={(e) => (e.target.value = null)}
          id="filePicker"
          type="file"
          sx={{ display: "none" }}
          inputProps={{ accept: "image/png, image/jpg, image/jpeg" }}
        ></TextField>
        <Divider />
        <DialogContent
          onClick={handleRemoveProfile}
          sx={{
            color: "tomato",
            padding: "15px 0",
            textAlign: "center",
            "&:hover": { cursor: "pointer" },
          }}
        >
          Remove Photo
        </DialogContent>
        <Divider />
        <DialogContent
          onClick={handleClose}
          sx={{
            textAlign: "center",
            padding: "15px 0",
            "&:hover": { cursor: "pointer" },
          }}
        >
          Cancel
        </DialogContent>
      </Dialog>
    </>
  );
};
