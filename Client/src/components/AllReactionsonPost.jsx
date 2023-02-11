import { Avatar, Box, Dialog, Link, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaAngry, FaLaughSquint, FaSadCry } from "react-icons/fa";
import { Loader } from "./Loader";
import { root_url } from "../utils/url";

export const AllReactionsonPost = ({
  data,
  showAllReactions,
  handelCloseShowReactions,
}) => {
  const [reactionsData, setReactionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getLikesOnpost();
  }, []);

  const getLikesOnpost = () => {
    fetch(`${root_url}/api/likes/get/${data._id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res, "res");
        if (res.success) {
          setReactionsData(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Dialog open={showAllReactions} onClose={handelCloseShowReactions}>
        {isLoading ? (
          <Loader />
        ) : (
          <Box
            maxHeight="200px"
            overflow="scroll"
            mt="20px"
            sx={{ "&::-webkit-scrollbar": { width: "0" } }}
          >
            {reactionsData.length > 0 ? (
              <Stack direction="column" gap="10px" padding="15px">
                {reactionsData.map((el) => (
                  <Stack
                    key={el._id}
                    direction="row"
                    alignItems="center"
                    gap="15px"
                  >
                    <Avatar src={el.like_by.image} />
                    <Link
                      href={`/${el.like_by.username}`}
                      underline="none"
                      color="#000"
                    >
                      <Typography
                        fontFamily={"Dancing Script"}
                        fontSize="22px"
                        fontWeight="600"
                      >
                        {el.like_by.username}
                      </Typography>
                    </Link>
                    <Box>
                      {el.like_type === "love" && (
                        <BsSuitHeartFill
                          fontSize="25px"
                          color="red"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                      {el.like_type === "funny" && (
                        <FaLaughSquint
                          fontSize="25px"
                          color="#eb9800"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                      {el.like_type === "cry" && (
                        <FaSadCry
                          fontSize="25px"
                          color="#00baff"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                      {el.like_type === "angry" && (
                        <FaAngry
                          fontSize="25px"
                          color="#c30909"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Box
                height="100%"
                display="flex"
                p="0 5px"
                alignItems="center"
                justifyContent="center"
              >
                <Typography>No Reactions to Show</Typography>
              </Box>
            )}
          </Box>
        )}
      </Dialog>
    </>
  );
};
