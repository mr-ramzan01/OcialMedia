import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import validator from "validator";
import { AuthContext } from "../../context/AuthContext";
import { ShowAlert } from "../Alert";

export const ResetPassword = () => {
  const [data, setData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const { userData } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (data.new_password !== data.confirm_new_password) {
      setMessage("New password do not match");
      setSeverity("error");
      setShowAlert(true);
    } else if (
      validator.isStrongPassword(data.new_password, {
        minLength: 4,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      resetPassword();
    } else {
      setMessage(
        "Password must includes at least one lowercase, uppercase, numbers and symbols."
      );
      setSeverity("error");
      setShowAlert(true);
    }
  };

  const resetPassword = () => {
    fetch(`/api/users/reset-password`, {
      method: "PATCH",
      body: JSON.stringify(data),
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
          setData({
            old_password: "",
            new_password: "",
            confirm_new_password: "",
          });
        } else {
          setMessage(res.message);
          setSeverity("error");
          setShowAlert(true);
        }
      })
      .catch((err) => {
        console.log(err, "error");
        setMessage("Internal Server Error");
        setSeverity("error");
        setShowAlert(true);
        setData({
          old_password: "",
          new_password: "",
          confirm_new_password: "",
        });
      });
  };
  return (
    <>
      {showAlert && (
        <ShowAlert
          message={message}
          severity={severity}
          alertOpen={showAlert}
          setAlertOpen={setShowAlert}
        />
      )}
      <Box mt="20px" pb="20px">
        <Box
          component="form"
          width={{ xs: "calc(100% - 40px)", sm: "85%", md: "70%", lg: "60%" }}
          m="auto"
          onSubmit={handleSubmit}
        >
          <Stack
            m={"40px 0"}
            gap="20px"
            alignItems="center"
            width="100%"
            direction={"row"}
          >
            <Typography width="20%">Old Password</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              autoFocus
              value={data.old_password}
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
                bgcolor: "#f1f1f1",
                borderRadius: "5px",
                border: "1px solid gray",
              }}
              name="old_password"
              type="password"
              id="old_password"
              autoComplete="current-password"
              InputProps={{
                style: {
                  height: "50px",
                },
              }}
              onChange={handleChange}
            />
          </Stack>
          <Stack
            m={"40px 0"}
            gap="20px"
            alignItems="center"
            width="100%"
            direction={"row"}
          >
            <Typography width="20%">New Password</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              value={data.new_password}
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
                bgcolor: "#f1f1f1",
                borderRadius: "5px",
                border: "1px solid gray",
              }}
              name="new_password"
              type="password"
              id="new_password"
              autoComplete="current-password"
              InputProps={{
                style: {
                  height: "50px",
                },
              }}
              onChange={handleChange}
            />
          </Stack>
          <Stack
            m={"40px 0"}
            gap="20px"
            alignItems="center"
            width="100%"
            direction={"row"}
          >
            <Typography width="20%">Confirm New Password</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              value={data.confirm_new_password}
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
                bgcolor: "#f1f1f1",
                borderRadius: "5px",
                border: "1px solid gray",
              }}
              name="confirm_new_password"
              type="password"
              id="confirm_new_password"
              autoComplete="current-password"
              InputProps={{
                style: {
                  height: "50px",
                },
              }}
              onChange={handleChange}
            />
          </Stack>
          <Stack direction="row">
            <Box width="20%"></Box>
            <Box width="80%">
              <Button
                type="submit"
                disabled={userData.authType === "google"}
                size="large"
                variant="contained"
                sx={{
                  borderRadius: "5px",
                  // mt: 4,
                  background: "#129ffd",
                  boxShadow: "none",
                  "&:hover": {
                    background: "#0066ff",
                    boxShadow: "none",
                  },
                }}
              >
                Change Password
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
