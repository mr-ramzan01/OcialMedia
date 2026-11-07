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
import { AuthContext } from "../context/AuthContext";
import { AuthLayout } from "../components/layout/AuthLayout";
import { api } from "../utils/api";
import { usePageTitle } from "../hooks/usePageTitle";

export const Login = () => {
  usePageTitle("Log in");
  const [data, setData] = useState({ emailorusername: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, googleRequest, googleEnabled } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    api("/api/users/login", { method: "POST", body: data, token: null })
      .then((res) => {
        if (res.success) {
          login(res.token);
          navigate("/");
        } else {
          setError(res.message || "Invalid username or password");
        }
      })
      .catch((err) => {
        console.log(err, "response error");
        setError("Something went wrong. Please try again.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see what your friends are sharing."
      footer={
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link component={RouterLink} to="/accounts/signup">
            Sign up
          </Link>
        </Typography>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            required
            fullWidth
            id="email"
            label="Username or email"
            name="emailorusername"
            autoComplete="username"
            autoFocus
            value={data.emailorusername}
            onChange={handleChange}
            error={Boolean(error)}
          />
          <TextField
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={data.password}
            onChange={handleChange}
            error={Boolean(error)}
            helperText={error}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                    edge="end"
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                ),
              },
            }}
          />
          <Box sx={{ textAlign: "right", mt: -1 }}>
            <Link
              component={RouterLink}
              to="/accounts/forgot-password"
              variant="body2"
            >
              Forgot password?
            </Link>
          </Box>
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            loading={submitting}
          >
            Log in
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
