import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Loader } from "../Loader";
import { root_url } from "../../utils/url";
import { emit, EVENTS } from "../../utils/events";

export const EditProfile = () => {
  const { getUser, userData, editData, setEditData, userToken } =
    useContext(AuthContext);
  const toast = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleProfileUpdate = () => {
    setProfileOpen(true);
  };

  const handleRemoveProfile = () => {
    if (userData.image === "") {
      setProfileOpen(false);
      return;
    }
    setProfileOpen(false);
    setUploading(true);
    fetch(`${root_url}/api/users/remove-profile-photo`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        getUser();
        emit(EVENTS.PROFILE_UPDATED);
        toast.success("Profile removed successfully");
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Internal Server Error");
      })
      .finally(() => {
        setUploading(false);
        setProfileOpen(false);
      });
  };

  const handleUploadProfile = (e) => {
    const file = e.target.files[0];

    var data = new FormData();
    data.append("profile", file);
    setProfileOpen(false);
    setUploading(true);
    fetch(`${root_url}/api/users/upload-profile-photo/`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          toast.success(res.message);
          getUser();
          emit(EVENTS.PROFILE_UPDATED);
        }
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong please try later");
      })
      .finally(() => {
        setUploading(false);
        setProfileOpen(false);
      });
  };

  const editDataValidation = () => {
    if (editData.full_name.length <= 1) {
      toast.error("Your name should be at least 3 characters long");
      return false;
    }
    if (!editData.email.includes("@") || !editData.email.includes(".")) {
      toast.error("Your email address should includes '@' and '.' ");
      return false;
    } else if (
      editData.email[editData.email.length - 1] === "." ||
      editData.email[editData.email.length - 1] === "@"
    ) {
      toast.error("Your email address should not end with '@' and '.' ");
      return false;
    }
    if (editData.mobile_no.length > 0) {
      if (editData.mobile_no.includes(".")) {
        toast.error("Mobile no. should not include '.'");
        return false;
      } else if (editData.mobile_no.length !== 10) {
        toast.error("Mobile no. should be 10 digits only");
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
      fetch(`${root_url}/api/users/udpate-user-profile`, {
        method: "PATCH",
        body: JSON.stringify(editData),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userToken}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            toast.success(res.message);
            emit(EVENTS.PROFILE_UPDATED);
          } else {
            toast.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err, "error");
          toast.error("Something went wrong please try later");
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
      {uploading && <Loader overlay label="Uploading photo…" />}
      <Stack spacing={3}>
        <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
          <Avatar
            src={userData.image}
            alt={userData.username}
            sx={{ width: 80, height: 80, fontSize: 32 }}
          >
            {(userData.username || "?").slice(0, 1).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>
              {userData.username}
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={handleProfileUpdate}
              sx={{ ml: -1.5 }}
            >
              Change photo
            </Button>
          </Box>
        </Stack>

        <Box component="form" onSubmit={handleEditProfileSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Full name"
                autoComplete="given-name"
                name="full_name"
                type="text"
                value={editData.full_name}
                required
                id="full_name"
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Username"
                autoComplete="given-username"
                name="username"
                type="text"
                value={editData.username}
                required
                id="username"
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Bio"
                autoComplete="given-bio"
                name="bio"
                type="text"
                value={editData.bio}
                multiline
                minRows={3}
                maxRows={6}
                id="bio"
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                autoComplete="given-email"
                disabled={userData.authType === "google"}
                name="email"
                required
                type="email"
                value={editData.email}
                id="email"
                onChange={handleEditChange}
                helperText={
                  userData.authType === "google"
                    ? "Your email is managed by your Google account."
                    : undefined
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mobile number"
                autoComplete="given-number"
                name="mobile_no"
                type="number"
                value={editData.mobile_no}
                id="mobile_no"
                onChange={handleEditChange}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    { display: "none" },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    ),
                  },
                  htmlInput: { maxLength: 10 },
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              disabled={userData === editData}
              loading={loading}
              variant="contained"
            >
              Save changes
            </Button>
          </Box>
        </Box>
      </Stack>

      <Dialog maxWidth="xs" onClose={handleClose} open={profileOpen} fullWidth>
        <DialogTitle>Profile photo</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Stack spacing={1}>
            <Button
              component="label"
              htmlFor="filePicker"
              variant="contained"
              fullWidth
            >
              Upload photo
            </Button>
            <TextField
              onChange={handleUploadProfile}
              onClick={(e) => (e.target.value = null)}
              id="filePicker"
              type="file"
              sx={{ display: "none" }}
              slotProps={{
                htmlInput: { accept: "image/png, image/jpg, image/jpeg" },
              }}
            ></TextField>
            <Button
              onClick={handleRemoveProfile}
              variant="outlined"
              color="error"
              fullWidth
            >
              Remove photo
            </Button>
            <Button onClick={handleClose} variant="text" fullWidth>
              Cancel
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
