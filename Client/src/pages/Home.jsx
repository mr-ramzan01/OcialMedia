import {
  Avatar,
  Box,
  CircularProgress,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { Carousel } from "react-responsive-carousel";
import { RecentPostsComments } from "../components/RecentPostsComments";
import { PostsActions } from "../components/PostsActions";
import { Loader } from "../components/Loader";
import { Stories } from "../components/Stories";
import { BottomBar } from "../components/Bars/BottomBar";
import { Navbar } from "../components/Bars/Navbar";
import { LeftSideBar } from "../components/Bars/LeftSideBar";

export const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalLength, setTotalLength] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = () => {
    setPage((prev) => prev + 1);

    fetch(`/api/posts/recent/post?page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setRecentPosts(() => [...recentPosts, ...res.data]);
          setTotalLength(res.totalData);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const DateConvert = ({ date }) => {
    let newDate = moment(date).fromNow();
    const all = newDate.split(" ");
    all.splice(all.length - 1, 1);
    if (all[0] === "a" || all[0] === "an") {
      all[0] = 1;
    }
    if (all[1] === "few") {
      all[0] = "now";
      all.splice(1, 2);
    }
    if (all[1] === "second" || all[1] === "seconds") {
      all[1] = "s";
    }
    if (all[1] === "minute" || all[1] === "minutes") {
      all[1] = "m";
    }
    if (all[1] === "hour" || all[1] === "hours") {
      all[1] = "h";
    }
    if (all[1] === "day" || all[1] === "days") {
      all[1] = "d";
    }
    if (all[1] === "month" || all[1] === "months") {
      all[1] = "m";
    }
    if (all[1] === "year" || all[1] === "years") {
      all[1] = "y";
    }

    const updatedDate = all.join("");
    return (
      <Typography fontSize="15px" component="span">
        {" "}
        {updatedDate}
      </Typography>
    );
  };

  return (
    <>
      <Navbar />
      <BottomBar />
      {isLoading ? (
        <Loader />
      ) : (
        <Stack direction={"row"}>
          <LeftSideBar />
          <Box marginLeft={{ xs: "0", sm: "80px", lg: "240px" }} width="100%">
            <Box
              width={{ xs: "100%", sm: "450px", md: "600px" }}
              sx={{ minHeight: "90vh", m: "40px auto" }}
              p={{ xs: "20px", sm: "0" }}
            >
              <Stories />
              {recentPosts.length > 0 ? (
                <InfiniteScroll
                  dataLength={recentPosts.length}
                  className={"scrollDiv"}
                  next={fetchRecentPosts}
                  hasMore={totalLength !== recentPosts.length}
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
                  {recentPosts.map((el) => (
                    <Paper
                      key={el._id}
                      sx={{
                        p: { xs: "5px 10px", sm: "15px 10px" },
                        mb: "10px",
                        border: "1px solid #d1d1d1",
                      }}
                    >
                      <Stack direction="row" p="10px 0" alignItems="center">
                        <Avatar
                          sx={{ marginRight: "20px" }}
                          src={el.user_id.image}
                        />
                        <Stack direction="row" gap="10px" alignItems="center">
                          <Link
                            href={`/${el.user_id.username}`}
                            underline="none"
                            color="#000"
                          >
                            <Typography
                              fontFamily={"Dancing Script"}
                              fontSize="22px"
                              fontWeight="600"
                            >
                              {el.user_id.username}
                            </Typography>
                          </Link>
                          <Typography mt="5px">
                            <DateConvert date={el.createdAt} />
                          </Typography>
                        </Stack>
                      </Stack>
                      <Carousel
                        showStatus={false}
                        showIndicators={el.post_images.length > 1}
                        showThumbs={false}
                      >
                        {el.post_images.map((el) => (
                          <Avatar
                            sx={{
                              objectFit: "contain",
                              borderRadius: "0",
                              width: "100%",
                              height: { xs: "350px", sm: "400px", md: "485px" },
                            }}
                            key={el}
                            width="100%"
                            height="485px"
                            src={el.url}
                            alt=""
                          />
                        ))}
                      </Carousel>
                      <PostsActions el={el} />
                      <Stack direction="row" key={el._id} gap="10px">
                        <Link
                          href={`/${el.user_id.username}`}
                          underline="none"
                          color="#000"
                        >
                          <Typography
                            fontFamily={"Dancing Script"}
                            fontSize="22px"
                            fontWeight="600"
                          >
                            {el.user_id.username}
                          </Typography>
                        </Link>
                        <Typography mt="5px" fontSize="15px">
                          <Typography component="span">
                            {el.caption}{" "}
                          </Typography>
                          {el.tags.map((elem, ind) => (
                            <Typography
                              sx={{ cursor: "pointer" }}
                              component="span"
                              color="#0066ff"
                              key={ind}
                            >
                              #{elem}{" "}
                            </Typography>
                          ))}
                        </Typography>
                      </Stack>
                      <RecentPostsComments el={el} />
                    </Paper>
                  ))}
                </InfiniteScroll>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "90vh",
                  }}
                >
                  <Typography color="#bbbbbb" fontSize="25px">
                    Be the first to create a post
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      )}
    </>
  );
};
