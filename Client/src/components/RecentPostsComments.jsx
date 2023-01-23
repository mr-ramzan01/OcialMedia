import {
  Avatar,
  Box,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import { SinglePost } from "./SinglePost";

export const RecentPostsComments = ({ el }) => {
  const [commentsData, setCommentsData] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSinglePostFromRecent, setShowSinglePostFromRecent] =
    useState(false);

  const getComments = () => {
    setIsLoading(true);
    fetch(`/comments/recent/get/${el._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTotalComments(res.totalComments);
          setCommentsData(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getComments();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "grid", placeContent: "center" }}>
        <CircularProgress sx={{ color: "#bbbbbb" }} />
      </div>
    );
  }
  return (
    <>
      {showSinglePostFromRecent && (
        <SinglePost
          data={el}
          setShowSinglePostFromRecent={setShowSinglePostFromRecent}
        />
      )}
      {commentsData.length > 0 ? (
        <Box>
          <Stack direction="column" gap="10px">
            {commentsData.map((el) => (
              <Stack
                direction="row"
                key={el._id}
                alignItems="center"
                gap="10px"
              >
                <Link
                  href={`/${el.comment_by.username}`}
                  underline="none"
                  color="#000"
                >
                  <Typography
                    fontFamily={"Dancing Script"}
                    fontSize="22px"
                    fontWeight="600"
                  >
                    {el.comment_by.username}
                  </Typography>
                </Link>
                <Typography mt="5px" fontSize="15px">
                  {el.title}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Typography
            sx={{ cursor: "pointer", mt: "5px" }}
            onClick={() => setShowSinglePostFromRecent(true)}
          >
            {totalComments > 1 && "See all comments"}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography textAlign="center" fontSize={"20px"} p='10px 0' color="#a1a1a1">
            Be the first to make a comment
          </Typography>
        </Box>
      )}
    </>
  );
};
