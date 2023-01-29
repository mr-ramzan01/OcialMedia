import { Link, Typography } from "@mui/material";
import { MdOutlineExplore } from "react-icons/md";

export const ExploreIcon = () => {
  return (
    <>
      <Link
        href="/explore"
        sx={{
          "&:hover": {
            backgroundColor: "#fafafa",
            cursor: "pointer",
            borderRadius: "20px",
          },
        }}
        m="10px 0 8px 0"
        color={"#000"}
        p="10px"
        underline="none"
        display={"flex"}
        alignItems={"center"}
      >
        <MdOutlineExplore fontSize={"25px"} />
        <Typography display={{ xs: "none", lg: "block" }} ml="15px">
          Explore
        </Typography>
      </Link>
    </>
  );
};
