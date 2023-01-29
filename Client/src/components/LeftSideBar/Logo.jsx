import { Avatar, Typography } from "@mui/material";

export const Logo = () => {
  return (
    <>
      <Typography
        variant="h4"
        mt="40px"
        component={"h1"}
        fontFamily="'Dancing Script', cursive"
        display={{ xs: "none", lg: "block" }}
      >
        Ocial Media
      </Typography>
      <Avatar
        sx={{
          borderRadius: "0",
          display: { xs: "none", sm: "block", lg: 'none' },
          mt: "40px",
          height: "40px",
          width: "50px",
        }}
        src="/Images/OMLight.png"
        alt=""
      />
    </>
  );
};
