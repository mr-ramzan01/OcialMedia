import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import validator from "validator";
import { MdVisibilityOff } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import { root_url } from "../utils/url";

export const CreateNewPassword = () => {
  const [data, setData] = useState({ password1: "", password2: "" });
  const [passwordError1, setPasswordError1] = useState({
    error: false,
    text: "",
  });
  const [passwordError2, setPasswordError2] = useState({
    error: false,
    text: "",
  });
  const [passwordVisibility1, setPasswordVisibility1] = useState(false);
  const [passwordVisibility2, setPasswordVisibility2] = useState(false);
  const navigate = useNavigate();

  const { token } = useParams();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    passwordValidation(name, value);
  };

  const changePassword = () => {
    fetch(`${root_url}/api/users/forgot-password/set-new-password`, {
      method: "POST",
      body: JSON.stringify({ password: data.password1 }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert(res.message);
          navigate("/accounts/login");
        } else if (
          res.message ===
          "Somthing went wrong, Please reset your password again."
        ) {
          alert(res.message);
          navigate("/accounts/forgot-password");
        } else if (res.message === "jwt expired") {
          alert("Session has been expired try again");
          navigate("/accounts/login");
        }
      })
      .catch((err) => {
        console.log(err, "error");
        alert("Something went wrong! Internal server error");
      });
  };

  const passwordValidation = (name, value) => {
    if (name === "password1" && value.length > 0) {
      if (
        validator.isStrongPassword(value, {
          minLength: 4,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        setPasswordError1({ ...passwordError1, error: false, text: "" });
      } else {
        setPasswordError1({
          ...passwordError1,
          error: true,
          text: "Password must includes at least one lowercase, uppercase, numbers and symbols.",
        });
        return false;
      }
    }
    if (name === "password2" && value.length > 0) {
      if (
        validator.isStrongPassword(value, {
          minLength: 4,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        setPasswordError2({ ...passwordError2, error: false, text: "" });
      } else {
        setPasswordError2({
          ...passwordError2,
          error: true,
          text: "Password must includes at least one lowercase, uppercase, numbers and symbols.",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (data.password1 !== data.password2) {
      setPasswordError1({
        ...passwordError1,
        error: true,
        text: "Password didn't match",
      });
      setPasswordError2({
        ...passwordError2,
        error: true,
        text: "Password didn't match",
      });
    } else {
      changePassword();
    }
  };
  const theme = createTheme();
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              padding: "20px",
              bgcolor: "#fff",
              borderRadius: "10px",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              fontFamily="'Dancing Script', cursive"
              component="h1"
              variant="h3"
            >
              Ocial Media
            </Typography>
            <Typography sx={{ mt: 2 }} component="h1" variant="h5">
              Set New Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#0066ff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#129ffd",
                    },
                  },
                }}
                name="password1"
                label="Set Password"
                type={passwordVisibility1 ? "text" : "password"}
                id="password1"
                autoComplete="current-password"
                onChange={handleChange}
                inputProps={{
                  minLength: 8,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() =>
                          setPasswordVisibility1(!passwordVisibility1)
                        }
                      >
                        {passwordVisibility1 ? (
                          <MdVisibility />
                        ) : (
                          <MdVisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    height: "50px",
                  },
                }}
                error={passwordError1.error}
                helperText={passwordError1.text}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#0066ff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#129ffd",
                    },
                  },
                }}
                name="password2"
                label="Confirm Password"
                type={passwordVisibility2 ? "text" : "password"}
                id="password2"
                autoComplete="current-password"
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() =>
                          setPasswordVisibility2(!passwordVisibility2)
                        }
                      >
                        {passwordVisibility2 ? (
                          <MdVisibility />
                        ) : (
                          <MdVisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    height: "50px",
                  },
                }}
                inputProps={{
                  minLength: 8,
                }}
                error={passwordError2.error}
                helperText={passwordError2.text}
              />
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  mt: 4,
                  mb: 4,
                  background: "#129ffd",
                  "&:hover": {
                    background: "#0066ff",
                  },
                }}
              >
                Change password
              </Button>
            </Box>
          </Box>
          {/* <Copyright sx={{ mt: 4, mb: 2 }} /> */}
        </Container>
      </ThemeProvider>
    </Box>
  );
};
