import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { LeftSideBar } from "../components/LeftSideBar";
import { HiRectangleStack } from "react-icons/hi2";
import { Loader } from "../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { SinglePost } from "../components/SinglePost";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { BottomBar } from "../components/BottomBar";

export const Explore = () => {
  const [exploreData, setExploreData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalLength, setTotalLength] = useState(0);
  const {showSinglePost, postData, handleClick} = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
    fetchExploreData();
  }, []);


  const fetchExploreData = () => {
    setPage((prev) => prev+1);

    fetch(`/posts/explore/data?page=${page}`)
    .then((res) => res.json())
    .then((res) => {
      if(res.success) {
        setExploreData(() => [...exploreData, ...res.data]);
        setTotalLength(res.totalData);
      }
    })
    .catch((err) => {
      console.log(err, "error");
    })
    .finally(() => {
      setIsLoading(false);
    })
  };


  return (
    <>
    <Navbar />
    <BottomBar />
      {showSinglePost && <SinglePost id={postData._id}/>}
      {isLoading ? <Loader /> :
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box
          marginLeft={{xs: '0', sm: '80px', lg: "240px"}}
          width="100%"
          display="grid"
          justifyContent="center"
        >
          <Box p={{xs: '70px 20px', sm: '30px 0'}} width={{xs: 'calc(100% - 40px)', sm: '500px', md: "800px", lg: '900px'}} >
            {exploreData.length > 0 ? (
              <InfiniteScroll
                dataLength={exploreData.length}
                className={'scrollDiv'}
                next={fetchExploreData}
                hasMore={totalLength !== exploreData.length}
                loader={<div style={{display: 'grid', placeContent: 'center', padding: '30px 0'}}>
                  <CircularProgress sx={{color: '#bbbbbb'}}/>
                </div>}
              >
                <Grid
                  display="grid"
                  gridTemplateColumns={"repeat(3,1fr)"}
                  gap="10px"
                >
                  {exploreData.map((el) => (
                    <Box
                      key={el._id}
                      height={{xs: '150px', sm: '200px', md: "280px"}}
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
              </InfiniteScroll>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                height="100vh"
                justifyContent="center"
              >
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
                  <Typography
                    textAlign="center"
                    fontSize={"30px"}
                    color="#a1a1a1"
                  >
                    Nothing here
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Stack>
}
    </>
  );
};
