import { Link, Typography } from "@mui/material";
import { AiFillHome } from "react-icons/ai";

export const HomeIcon = () => {
  return (
    <>
      <Link
        href="/"
        sx={{
          "&:hover": {
            backgroundColor:{xs: '', lg: "#fafafa"},
            cursor: "pointer",
            borderRadius: "20px",
          },
        }}
        m={{xs: '0', sm: "20px 0 8px 0"}}
        color={"#000"}
        p="10px"
        underline="none"
        display={{xs: 'block', lg: 'flex'}}
        alignItems={"center"}
    
      >
        <AiFillHome fontSize={"25px"} />
        <Typography display={{xs: "none", lg: 'block' }} ml="15px">Home</Typography>
      </Link>
    </>
  );
};
