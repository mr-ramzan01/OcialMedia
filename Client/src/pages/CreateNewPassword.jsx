import {
  Box,
  Button,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import validator from "validator";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { AuthLayout } from "../components/layout/AuthLayout";
import { api } from "../utils/api";
import { usePageTitle } from "../hooks/usePageTitle";
import { useToast } from "../context/ToastContext";

export const CreateNewPassword = () => {
  usePageTitle("New password");
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
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
    setSubmitting(true);
    api("/api/users/forgot-password/set-new-password", {
      method: "POST",
      body: { password: data.password1 },
      token,
    })
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          navigate("/accounts/login");
        } else if (
          res.message ===
          "Something went wrong, Please reset your password again."
        ) {
          toast.error(res.message);
          navigate("/accounts/forgot-password");
        } else if (res.message === "jwt expired") {
          toast.error("Session has been expired try again");
          navigate("/accounts/forgot-password");
        } else {
          toast.error(
            res.message ||
              "Something went wrong, Please reset your password again.",
          );
          navigate("/accounts/forgot-password");
        }
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong! Internal server error");
      })
      .finally(() => setSubmitting(false));
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

  const visibilityToggle = (visible, toggle, label) => (
    <IconButton size="small" onClick={toggle} aria-label={label} edge="end">
      {visible ? <MdVisibilityOff /> : <MdVisibility />}
    </IconButton>
  );

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <Typography variant="body2">
          Remembered it?{" "}
          <Link component={RouterLink} to="/accounts/login">
            Back to log in
          </Link>
        </Typography>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            required
            fullWidth
            id="password1"
            label="New password"
            name="password1"
            type={passwordVisibility1 ? "text" : "password"}
            autoComplete="new-password"
            autoFocus
            value={data.password1}
            onChange={handleChange}
            error={passwordError1.error}
            helperText={passwordError1.text}
            slotProps={{
              input: {
                endAdornment: visibilityToggle(
                  passwordVisibility1,
                  () => setPasswordVisibility1((v) => !v),
                  "Toggle new password visibility",
                ),
              },
              htmlInput: { minLength: 8 },
            }}
          />
          <TextField
            required
            fullWidth
            id="password2"
            label="Confirm password"
            name="password2"
            type={passwordVisibility2 ? "text" : "password"}
            autoComplete="new-password"
            value={data.password2}
            onChange={handleChange}
            error={passwordError2.error}
            helperText={passwordError2.text}
            slotProps={{
              input: {
                endAdornment: visibilityToggle(
                  passwordVisibility2,
                  () => setPasswordVisibility2((v) => !v),
                  "Toggle confirm password visibility",
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
            Change password
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
};
