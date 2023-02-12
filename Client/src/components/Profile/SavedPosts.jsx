import { CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { HiRectangleStack } from "react-icons/hi2";
import { AuthContext } from "../../context/AuthContext";
import { Loader } from "../Loader";
import { root_url } from "../../utils/url";

export const SavedPosts = ({ id }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalSavedPostsLength, setTotalSavedPostsLength] = useState(0);
  const { handleClick, userToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getSavedPosts();
  }, []);

  const getSavedPosts = () => {
    setPage((prev) => prev + 1);
    fetch(`${root_url}/api/savedposts/get/all/${id}?page=${page}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setSavedPosts([...savedPosts, ...res.data]);
          setTotalSavedPostsLength(res.totalLength);
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
      {isLoading && <Loader />}
      {savedPosts.length > 0 ? (
        <InfiniteScroll
          dataLength={savedPosts.length}
          className={"scrollDiv"}
          next={getSavedPosts}
          hasMore={totalSavedPostsLength !== savedPosts.length}
          loader={
            <div
              style={{
                display: "grid",
                placeContent: "center",
                padding: "30px 0",
              }}
            >
              <CircularProgress sx={{ color: "#bbbbbb" }} />
            </div>
          }
        >
          <Grid display="grid" gridTemplateColumns={"repeat(3,1fr)"} gap="10px">
            {savedPosts.map((el) => (
              <Box
                key={el._id}
                height={{ xs: "130px", sm: "170px", md: "280px" }}
                onClick={() => handleClick(el.post_id._id)}
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": {
                    opacity: "0.5",
                  },
                }}
              >
                {el.post_id.post_images.length > 1 && (
                  <HiRectangleStack
                    style={{
                      color: "#ffffff",
                      fontSize: "30px",
                      top: "2px",
                      position: "absolute",
                      right: "0",
                      transform: "rotate(90deg)",
                    }}
                  />
                )}
                <img
                  height="100%"
                  width="100%"
                  src={el.post_id.post_images[0].url}
                  loading="lazy"
                  alt=""
                />
              </Box>
            ))}
          </Grid>
        </InfiniteScroll>
      ) : (
        <Box
          padding="30px 0"
          display="flex"
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
        >
          <Box width="200px" height="200px">
            <img
              width="100%"
              height="100%"
              style={{ objectFit: "contain" }}
              src="/Images/nopost.png"
              alt=""
            />
          </Box>
          <Typography fontSize={"30px"} color="#a1a1a1">
            No Saved Posts Yet
          </Typography>
        </Box>
      )}
    </>
  );
};
