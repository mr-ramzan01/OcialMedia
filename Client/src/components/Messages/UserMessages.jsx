import { Avatar, Box, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { EmptyState } from "../common/EmptyState";
import { clockTime } from "../../utils/time";
import { brand } from "../../theme";

export const UserMessages = ({ messages }) => {
  const { userData } = useContext(AuthContext);

  if (messages.length === 0) {
    return (
      <EmptyState
        compact
        image="/Images/sendMessage.png"
        title="Say hello"
        subtitle="Send the first message."
        sx={{ height: "100%" }}
      />
    );
  }

  return (
    <Stack spacing={1}>
      {messages.map((el) => {
        const mine = userData._id === el.sender._id;
        return (
          <Stack
            key={el._id}
            direction={mine ? "row-reverse" : "row"}
            spacing={1}
            sx={{
              alignItems: "flex-end",
              maxWidth: { xs: "88%", sm: "72%" },
              alignSelf: mine ? "flex-end" : "flex-start",
            }}
          >
            {!mine && (
              <Avatar
                src={el.sender.image}
                alt={el.sender.username}
                sx={{ width: 32, height: 32, fontSize: 14 }}
              >
                {(el.sender.username || "?").slice(0, 1).toUpperCase()}
              </Avatar>
            )}
            <Box
              sx={{
                px: 1.75,
                py: 1,
                borderRadius: "18px",
                borderBottomRightRadius: mine ? 4 : 18,
                borderBottomLeftRadius: mine ? 18 : 4,
                backgroundImage: mine ? brand.gradient : "none",
                bgcolor: mine ? "primary.main" : "background.default",
                color: mine ? "primary.contrastText" : "text.primary",
                minWidth: 0,
              }}
            >
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {el.message}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  mt: 0.25,
                  color: mine ? "inherit" : "text.secondary",
                  opacity: mine ? 0.8 : 1,
                }}
              >
                {clockTime(el.createdAt)}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
};
