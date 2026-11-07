import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { SinglePost } from "./SinglePost";
import { UserName } from "./common/UserListItem";
import { TextLineSkeleton } from "./common/Skeletons";

export const RecentPostsComments = ({ el }) => {
  const [commentsData, setCommentsData] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSinglePostFromRecent, setShowSinglePostFromRecent] =
    useState(false);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    api(`/api/comments/recent/get/${el._id}`)
      .then((res) => {
        if (!ignore && res.success) {
          setTotalComments(res.totalComments);
          setCommentsData(res.data);
        }
      })
      .catch((err) => console.log(err, "error"))
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [el._id, el.commentCount]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", mt: 1, minHeight: 24 }}>
        <TextLineSkeleton width="50%" />
      </Box>
    );
  }
  return (
    <>
      {showSinglePostFromRecent && (
        <SinglePost
          id={el._id}
          setShowSinglePostFromRecent={setShowSinglePostFromRecent}
        />
      )}
      {commentsData.length > 0 ? (
        <Stack spacing={0.5} sx={{ mt: 1 }}>
          {commentsData.map((c) => (
            <Typography
              key={c._id}
              variant="body2"
              sx={{ wordBreak: "break-word" }}
            >
              <UserName
                user={c.comment_by}
                sx={{ mr: 0.75, fontSize: "inherit" }}
              />
              {c.title}
            </Typography>
          ))}
          {totalComments > 1 && (
            <Typography
              component="button"
              type="button"
              variant="body2"
              onClick={() => setShowSinglePostFromRecent(true)}
              sx={{
                alignSelf: "flex-start",
                border: 0,
                background: "none",
                p: 0,
                cursor: "pointer",
                font: "inherit",
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              View all {totalComments} comments
            </Typography>
          )}
        </Stack>
      ) : (
        <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
          No comments yet
        </Typography>
      )}
    </>
  );
};
