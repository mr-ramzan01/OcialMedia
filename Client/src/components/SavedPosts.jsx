import React from "react";

export const SavedPosts = () => {
  return (
    <>
      <InfiniteScroll
        dataLength={userPosts.length}
        className={"scrollDiv"}
        next={getPosts}
        hasMore={totalPostsLength !== userPosts.length}
        useWidow={false}
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
        {userPosts.length > 0 ? (
          <Grid display="grid" gridTemplateColumns={"repeat(3,1fr)"} gap="10px">
            {userPosts.map((el) => (
              <Box
                key={el._id}
                height="280px"
                onClick={() => handleClick(el._id)}
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": {
                    opacity: "0.5",
                  },
                }}
              >
                {el.post_images.length > 1 && (
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
                  src={el.post_images[0].url}
                  loading="lazy"
                  alt=""
                />
              </Box>
            ))}
          </Grid>
        ) : (
          <Box padding="30px 0" display="grid" sx={{ placeContent: "center" }}>
            <Box>
              <Box width="200px" height="200px">
                <img
                  width="100%"
                  height="100%"
                  style={{ objectFit: "contain" }}
                  src="/Images/nopost.png"
                  alt=""
                />
              </Box>
              <Typography textAlign="center" fontSize={"30px"} color="#a1a1a1">
                No Posts Yet
              </Typography>
            </Box>
          </Box>
        )}
      </InfiniteScroll>
    </>
  );
};
