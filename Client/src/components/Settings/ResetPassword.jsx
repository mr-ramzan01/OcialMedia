import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useContext, useState } from "react";
import validator from "validator";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { root_url } from "../../utils/url";

export const ResetPassword = () => {
  const [data, setData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const { userData, userToken } = useContext(AuthContext);
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (data.new_password !== data.confirm_new_password) {
      toast.error("New password do not match");
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
      toast.error(
        "Password must includes at least one lowercase, uppercase, numbers and symbols.",
      );
    }
  };

  const resetPassword = () => {
    setSubmitting(true);
    fetch(`${root_url}/api/users/reset-password`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          setData({
            old_password: "",
            new_password: "",
            confirm_new_password: "",
          });
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Internal Server Error");
        setData({
          old_password: "",
          new_password: "",
          confirm_new_password: "",
        });
      })
      .finally(() => setSubmitting(false));
  };
  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480 }}>
        <Stack spacing={2}>
          {userData.authType === "google" && (
            <Alert severity="info">
              You signed in with Google, so your password is managed by your
              Google account and cannot be changed here.
            </Alert>
          )}
          <TextField
            label="Current password"
            required
            fullWidth
            autoFocus
            disabled={userData.authType === "google"}
            value={data.old_password}
            name="old_password"
            type="password"
            id="old_password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <TextField
            label="New password"
            required
            fullWidth
            disabled={userData.authType === "google"}
            value={data.new_password}
            name="new_password"
            type="password"
            id="new_password"
            autoComplete="new-password"
            onChange={handleChange}
            helperText="At least one lowercase, uppercase, number and symbol."
          />
          <TextField
            label="Confirm new password"
            required
            fullWidth
            disabled={userData.authType === "google"}
            value={data.confirm_new_password}
            name="confirm_new_password"
            type="password"
            id="confirm_new_password"
            autoComplete="new-password"
            onChange={handleChange}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              disabled={userData.authType === "google"}
              loading={submitting}
              variant="contained"
            >
              Update password
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
};
