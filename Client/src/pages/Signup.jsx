import {
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import validator from "validator";
import { AuthContext } from "../context/AuthContext";
import { AuthLayout } from "../components/layout/AuthLayout";
import { api } from "../utils/api";
import { usePageTitle } from "../hooks/usePageTitle";
import { useToast } from "../context/ToastContext";

export const Signup = () => {
  usePageTitle("Sign up");
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
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
  const { login, googleRequest, googleEnabled } = useContext(AuthContext);
  const navigate = useNavigate();

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
      // 3-30 characters: letters, numbers, dots, underscores or hyphens (no spaces)
      if (!/^[a-zA-Z0-9._-]{3,30}$/.test(value)) {
        setUsernameError({
          ...usernameError,
          error: true,
          text: "Use 3-30 letters, numbers, dots, underscores or hyphens (no spaces)",
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
      setSubmitting(true);
      api("/api/users/signup", { method: "POST", body: data, token: null })
        .then((res) => {
          if (res.success) {
            login(res.token);
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
            toast.error(res.message);
          } else {
            toast.error("Internal server error, Please try again later!!");
          }
        })
        .catch((err) => {
          console.log(err, "response error");
          toast.error("Something went wrong! Internal server error");
        })
        .finally(() => setSubmitting(false));
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Ocial Media and start sharing moments with friends."
      footer={
        <Typography variant="body2">
          Have an account?{" "}
          <Link component={RouterLink} to="/accounts/login">
            Log in
          </Link>
        </Typography>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            required
            fullWidth
            id="full_name"
            label="Full name"
            name="full_name"
            autoComplete="name"
            autoFocus
            value={data.full_name}
            onChange={handleChange}
            slotProps={{ htmlInput: { minLength: 2 } }}
          />
          <TextField
            required
            fullWidth
            id="email"
            label="Email address"
            name="email"
            autoComplete="email"
            value={data.email}
            onChange={handleChange}
            error={emailError.error}
            helperText={emailError.text}
          />
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={data.username}
            onChange={handleChange}
            error={usernameError.error}
            helperText={usernameError.text}
          />
          <TextField
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type={passwordVisibility ? "text" : "password"}
            autoComplete="new-password"
            value={data.password}
            onChange={handleChange}
            error={passwordError.error}
            helperText={passwordError.text}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    size="small"
                    onClick={() => setPasswordVisibility((v) => !v)}
                    aria-label="Toggle password visibility"
                    edge="end"
                  >
                    {passwordVisibility ? (
                      <MdVisibilityOff />
                    ) : (
                      <MdVisibility />
                    )}
                  </IconButton>
                ),
              },
              htmlInput: { minLength: 8 },
            }}
          />
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            loading={submitting}
          >
            Sign up
          </Button>
          {googleEnabled && (
            <>
              <Divider>
                <Typography variant="caption">or</Typography>
              </Divider>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                color="inherit"
                onClick={googleRequest}
                startIcon={<FcGoogle />}
              >
                Continue with Google
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </AuthLayout>
  );
};
