import { Link, Typography } from "@mui/material";
import { BsSearch } from "react-icons/bs";

export const SearchIcon = () => {
  return (
    <>
      <Link
        href="/search"
        sx={{
          "&:hover": {
            backgroundColor:{xs: '', lg: "#fafafa"},
            cursor: "pointer",
            borderRadius: "20px",
          },
        }}
        m={{xs: '0', sm: "10px 0 8px 0"}}
        color={"#000"}
        p="10px"
        underline="none"
        display={{xs: 'block', lg: 'flex'}}
        alignItems={"center"}
      >
        <BsSearch fontSize={"25px"} />
        <Typography display={{ xs: "none", lg: "block" }} ml="15px">
          Search
        </Typography>
      </Link>
    </>
  );
};
