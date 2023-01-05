import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { LeftSideBar } from "../components/LeftSideBar";
import { HiRectangleStack } from "react-icons/hi2";
import { Loader } from "../components/Loader";

export const Explore = () => {
  const [exploreData, setExploreData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExploreData();
  }, []);

  const fetchExploreData = () => {
    setIsLoading(true);
    fetch("/posts/explore/data")
      .then((res) => res.json())
      .then((res) => {
        console.log(res, "res");
        setExploreData(res.data);
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      })
  };

  if(isLoading) {
    return <Loader/>
  }
  function srcset(image, size, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }
  return (
    <>
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box
          border="1px solid green"
          marginLeft="240px"
          width="100%"
          display="grid"
          justifyContent="center"
        >
          <Box padding='30px 0' width="900px">
            {exploreData.length > 0 ? (
              <Grid
                display="grid"
                gridTemplateColumns={"repeat(3,1fr)"}
                gap="10px"
              >
                {exploreData.map((el) => (
                  <Box
                    key={el._id}
                    height="280px"
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
    </>
  );
};
