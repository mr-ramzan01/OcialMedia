import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useRef, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import ClearIcon from "@mui/icons-material/Clear";
import { Navbar } from "../components/Bars/Navbar";
import { BottomBar } from "../components/Bars/BottomBar";
import { LeftSideBar } from "../components/Bars/LeftSideBar";
import { root_url } from "../utils/url";
import { AuthContext } from "../context/AuthContext";

export const Search = () => {
  const searchRef = useRef(null);
  const [users, setUsers] = useState([]);
  const {userToken} = useContext(AuthContext);

  const handleRemoveInput = () => {
    searchRef.current.value = "";
    SearchInput();
  };
  const SearchInput = debounce(() => {
    fetch(`${root_url}/api/users/search?q=${searchRef.current.value}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        setUsers(res.data);
      });
  }, 500);

  function debounce(fn, delay) {
    let id;
    return () => {
      clearTimeout(id);
      id = setTimeout(() => {
        fn();
      }, delay);
    };
  }
  return (
    <>
      <Navbar />
      <BottomBar />
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box marginLeft={{ xs: "0", sm: "80px", lg: "240px" }} width="100%">
          <Box
            width={{
              xs: "100%",
              sm: "500px",
              md: "700px",
              lg: "600px",
              xl: "800px",
            }}
            m={{ xs: "60px auto", sm: "20px auto" }}
          >
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                m: { xs: "0 20px", sm: "0" },
                mt: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                onInput={SearchInput}
                autoFocus
                inputRef={searchRef}
                placeholder="Search in Ocial Media"
                inputProps={{ "aria-label": "Search in Ocial Media" }}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                onClick={handleRemoveInput}
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
              >
                <ClearIcon />
              </IconButton>
            </Paper>
            {users.length > 0 && searchRef.current.value.length > 0 ? (
              <Paper
                sx={{
                  maxHeight: {
                    xs: "calc(100vh - 180px)",
                    sm: "calc(100vh - 100px)",
                  },
                  overflowY: "scroll",
                  borderRadius: "5px",
                  m: { xs: "10px 20px 0 20px", sm: "10px 0 0 0" },
                  "::-webkit-scrollbar": {
                    width: "5px",
                  },
                  "::-webkit-scrollbar-thumb": {
                    background: "#d1d1d1",
                    borderRadius: "10px",
                  },
                }}
              >
                <Box sx={{ p: "5px 10px" }}>
                  {users.map((el) => (
                    <Link
                      href={`/${el.username}`}
                      key={el._id}
                      underline="none"
                      color="#000"
                    >
                      <Stack
                        padding="5px 10px"
                        sx={{ cursor: "pointer" }}
                        alignItems="center"
                        direction={"row"}
                      >
                        <Avatar sx={{ mr: "30px" }} src={el.image} />
                        <Box>
                          <Typography
                            fontSize="20px"
                            fontWeight={600}
                            fontFamily={"'Dancing Script', cursive"}
                          >
                            {el.username}
                          </Typography>
                          <Typography color="#8d929b">
                            {el.full_name}
                          </Typography>
                        </Box>
                      </Stack>
                    </Link>
                  ))}
                </Box>
              </Paper>
            ) : (
              <Box
                height={{ xs: "calc(100vh - 180px)", sm: "calc(100vh - 80px)" }}
                display="flex"
                justifyContent={"center"}
                alignItems="center"
              >
                <Box
                  width={{
                    xs: "300px",
                    sm: "300px",
                    md: "400px",
                    lg: "400px",
                    xl: "500px",
                  }}
                  height={{
                    xs: "250px",
                    sm: "250px",
                    md: "300px",
                    lg: "300px",
                    xl: "400px",
                  }}
                >
                  <Avatar
                    sx={{
                      borderRadius: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src="/Images/paint.gif"
                    alt="search gif"
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Stack>
    </>
  );
};
