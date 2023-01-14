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
import { useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import { LeftSideBar } from "../components/LeftSideBar";
import ClearIcon from "@mui/icons-material/Clear";

export const Search = () => {
  const searchRef = useRef(null);
  const [users, setUsers] = useState([]);

  const handleRemoveInput = () => {
    searchRef.current.value = "";
    SearchInput();
  };
  const SearchInput = debounce(() => {
    console.log(searchRef.current.value);
    fetch(`/users/search?q=${searchRef.current.value}`)
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
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box marginLeft="240px" width="100%">
          <Box width="50%" m="auto" border="0px solid blue">
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
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
                  maxHeight: "85vh",
                  overflowY: "scroll",
                  borderRadius: '5px',
                  mt: "10px",
                  "::-webkit-scrollbar": {
                    width: "5px",
                  },
                  "::-webkit-scrollbar-thumb": {
                    background: "#d1d1d1",
                    borderRadius: '10px'
                  }
                }}
                mt="10px"
              >
                <Box sx={{ p: "5px 10px"}}>
                  {users.map((el) => (
                    <Link href={`/${el.username}`} key={el._id} underline='none' color='#000'>
                      <Stack
                        padding="5px 10px"
                        sx={{cursor: 'pointer'}}
                        alignItems="center"
                        direction={"row"}
                      >
                        <Avatar sx={{ mr: "30px" }} src={el.image} />
                        <Box>
                          <Typography fontSize='20px' fontWeight={600} fontFamily={"'Dancing Script', cursive"}>{el.username}</Typography>
                          <Typography color='#8d929b'>{el.full_name}</Typography>
                        </Box>
                      </Stack>
                    </Link>
                  ))}
                </Box>
              </Paper>
            ) : (
              <Box height={'85vh'}  display='flex' justifyContent={'center'} alignItems='center'>
                <img src="/Images/paint.gif" alt="search gif" />
              </Box>
            )}
          </Box>
        </Box>
      </Stack>
    </>
  );
};
