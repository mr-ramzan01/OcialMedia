import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { IoMailOutline } from "react-icons/io5";
import { client_url, emailjs_config } from "../utils/url";
import { AuthLayout } from "../components/layout/AuthLayout";
import { api } from "../utils/api";
import { usePageTitle } from "../hooks/usePageTitle";
import { useToast } from "../context/ToastContext";

export const ForgotPassword = () => {
  usePageTitle("Reset password");
  const toast = useToast();
  const [sending, setSending] = useState(false);
  const [data, setData] = useState({ email: "" });
  const [emailError, setEmailError] = useState({ error: false, text: "" });
  const [sentInvitationLink, setSentInvitationLink] = useState(false);
  const [resetLink, setResetLink] = useState("");

  // Storing email on very input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Submiting the email and checking the response
  const handleSubmit = (event) => {
    event.preventDefault();
    setSending(true);
    api("/api/users/forgot-password", {
      method: "POST",
      body: data,
      token: null,
    })
      .then((res) => {
        if (res.success) {
          const link = `${client_url}/accounts/forgot-password/create-new-password/${res.token}`;

          // EmailJS is optional: without it (local development) the link is shown on screen.
          if (
            !emailjs_config.serviceId ||
            !emailjs_config.templateId ||
            !emailjs_config.publicKey
          ) {
            setResetLink(link);
            setSentInvitationLink(true);
            setSending(false);
            return;
          }

          // Sending Email to registered user email
          emailjs
            .send(
              emailjs_config.serviceId,
              emailjs_config.templateId,
              {
                user_name: res.full_name,
                link,
                reply_to: data.email,
              },
              { publicKey: emailjs_config.publicKey },
            )
            .then(() => {
              setSentInvitationLink(true);
            })
            .catch(() => {
              toast.error("Something went wrong while sending email!");
            })
            .finally(() => setSending(false));
          return;
        }

        // account not found / Google account / any other server-side rejection
        else {
          setEmailError({
            ...emailError,
            error: true,
            text: res.message || "Something went wrong, please try again.",
          });
        }
        setSending(false);
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error("Something went wrong! Internal server error");
        setSending(false);
      });
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        sentInvitationLink
          ? undefined
          : "Enter the email you signed up with and we'll send you a link to set a new password."
      }
      footer={
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link component={RouterLink} to="/accounts/signup">
            Sign up
          </Link>
        </Typography>
      }
    >
      {sentInvitationLink ? (
        <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "30%",
              display: "grid",
              placeItems: "center",
              bgcolor: "action.selected",
              color: "primary.main",
              "& svg": { fontSize: 30 },
            }}
          >
            <IoMailOutline />
          </Box>
          <Typography variant="h6">Check your inbox</Typography>
          <Typography color="text.secondary">
            An email has been sent to your registered email address. Open it and
            follow the link to set a new password.
          </Typography>
          {resetLink && (
            <Box
              sx={{
                width: "100%",
                p: 1.5,
                borderRadius: 3,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.default",
                textAlign: "left",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                component="p"
              >
                Email is not configured in this environment. Use this link
                instead:
              </Typography>
              <Link
                component={RouterLink}
                to={resetLink}
                variant="body2"
                sx={{ wordBreak: "break-all" }}
              >
                {resetLink}
              </Link>
            </Box>
          )}
          <Button
            component={RouterLink}
            to="/accounts/login"
            variant="text"
            sx={{ mt: 1 }}
          >
            Back to log in
          </Button>
        </Stack>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={data.email}
              onChange={handleChange}
              error={emailError.error}
              helperText={emailError.text}
            />
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              loading={sending}
            >
              Send reset link
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Link component={RouterLink} to="/accounts/login" variant="body2">
                Back to log in
              </Link>
            </Box>
          </Stack>
        </Box>
      )}
    </AuthLayout>
  );
};
