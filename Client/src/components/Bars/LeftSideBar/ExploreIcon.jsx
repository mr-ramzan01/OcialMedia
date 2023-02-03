import { Link, Typography } from '@mui/material'
import { MdOutlineExplore } from "react-icons/md";

export const ExploreIcon = () => {
  return (
    <>
      <Link
        href="/explore"
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
        <MdOutlineExplore  fontSize={"25px"} />
        <Typography display={{ xs: "none", lg: "block" }} ml="15px">
          Explore
        </Typography>
      </Link>
    </>
  )
}
