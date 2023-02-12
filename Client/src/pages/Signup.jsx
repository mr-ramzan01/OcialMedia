import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { MdVisibilityOff } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import validator from "validator";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import Cookies from 'universal-cookie';
import { root_url } from "../utils/url";

// Bottom Copyright
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="#000" href="/">
        Ocail Media
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme({
  box: {
    background: "#f1f1f1",
    "&:hover": {
      background: "#000",
    },
  },
});

export const Signup = () => {
  const [data, setData] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    authType: "email-password",
  });
  const [emailError, setEmailError] = useState({ error: false, text: "" });
  const [usernameError, setUsernameError] = useState({
    error: false,
    text: "",
  });
  const [passwordError, setPasswordError] = useState({
    error: false,
    text: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const { setIsAuth, googleRequest } = useContext(AuthContext);
  const navigate = useNavigate();
  const cookies = new Cookies();

  // Storing the data on every input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dataValidation(name, value);
  };

  // Validation for all input fields
  const dataValidation = (name, value) => {
    if (name === "email" && value.length > 0) {
      if (!value.includes("@") || !value.includes(".")) {
        setEmailError({
          ...emailError,
          error: true,
          text: "Your email address should includes '@' and '.' ",
        });
        return false;
      } else if (
        value[value.length - 1] === "." ||
        value[value.length - 1] === "@"
      ) {
        setEmailError({
          ...emailError,
          error: true,
          text: "Your email address should not end with '@' and '.' ",
        });
      } else {
        setEmailError({ ...emailError, error: false, text: "" });
      }
    } else {
      setEmailError({ ...emailError, error: false, text: "" });
    }
    if (name === "username" && value.length > 0) {
      if (!value.includes("-") && !value.includes("_")) {
        setUsernameError({
          ...usernameError,
          error: true,
          text: "username should contain '-' and '_' ",
        });
        return false;
      } else {
        setUsernameError({ ...usernameError, error: false, text: "" });
      }
    } else {
      setUsernameError({ ...usernameError, error: false, text: "" });
    }
    if (name === "password" && value.length > 0) {
      if (
        validator.isStrongPassword(value, {
          minLength: 4,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        setPasswordError({ ...passwordError, error: false, text: "" });
      } else {
        setPasswordError({
          ...passwordError,
          error: true,
          text: "Password must includes at least one lowercase, uppercase, numbers and symbols.",
        });
        return false;
      }
    } else {
      setPasswordError({ ...passwordError, error: false, text: "" });
    }
    return true;
  };

  // Submit the form
  const handleSubmit = (event) => {
    event.preventDefault();
    let validate = dataValidation();

    // If all input fields are valid
    if (validate) {
      fetch(`${root_url}/api/users/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setIsAuth(true);
            cookies.set('ocialMedia_token', res.token, { path: '/' });
            navigate("/");
          } else if (res.message === "Username already taken") {
            setUsernameError({
              ...usernameError,
              error: true,
              text: res.message,
            });
          } else if (res.message === "User already exists") {
            setEmailError({ ...emailError, error: true, text: res.message });
          } else if (
            res.message ===
            "User has already signed up try to continue with google."
          ) {
            alert(res.message);
          } else {
            alert("Internal server error, Please try again later!!");
          }
        })
        .catch((err) => {
          console.log(err, "response error");
          alert("Someting went wrong! Internal server error");
        });
    }
  };
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
              Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="full_name"
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
                    id="full_name"
                    label="Full Name"
                    InputProps={{
                      style: {
                        height: "50px",
                      },
                    }}
                    autoFocus
                    inputProps={{ minLength: 2 }}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
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
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    InputProps={{
                      style: {
                        height: "50px",
                      },
                    }}
                    onChange={handleChange}
                    error={emailError.error}
                    helperText={emailError.text}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
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
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="family-name"
                    InputProps={{
                      style: {
                        height: "50px",
                      },
                    }}
                    onChange={handleChange}
                    error={usernameError.error}
                    helperText={usernameError.text}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
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
                    name="password"
                    label="Password"
                    type={passwordVisibility ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    inputProps={{ minLength: 8 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            color="primary"
                            onClick={() =>
                              setPasswordVisibility(!passwordVisibility)
                            }
                          >
                            {passwordVisibility ? (
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
                    error={passwordError.error}
                    helperText={passwordError.text}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  mt: 4,
                  background: "#129ffd",
                  "&:hover": {
                    background: "#0066ff",
                  },
                }}
              >
                Sign Up
              </Button>
              <Divider sx={{ mt: 2, mb: 2 }}>or</Divider>
              <Box
                sx={{
                  mt: 2,
                  mb: 4,
                  "&:hover": {
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 1px 3px",
                    cursor: "pointer",
                    border: "none",
                  },
                }}
                height="45px"
                onClick={googleRequest}
                borderRadius={"3px"}
                display="flex"
                alignItems={"center"}
                justifyContent="center"
                border="1px solid #ccc3b7"
              >
                <Box display="flex" alignItems={"center"}>
                  <FcGoogle fontSize={"20px"} />
                  <Typography ml="20px">Continue with Google</Typography>
                </Box>
              </Box>
              <Grid container justifyContent="center">
                <Grid fontSize={14} item>
                  {"Have an account? "}
                  <Link
                    href="/accounts/login"
                    underline="hover"
                    variant="body2"
                  >
                    Log In
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 4, mb: 2 }} />
        </Container>
      </ThemeProvider>
    </Box>
  );
};
