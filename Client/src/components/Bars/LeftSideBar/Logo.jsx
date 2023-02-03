import { Avatar, Typography } from "@mui/material";

export const Logo = () => {
  return (
    <>
      <Typography
        variant='h4'
        mt={{xs: '0', sm: '40px'}}
        fontSize={{xs: '25px', sm: '30px'}}
        fontWeight='500'
        fontFamily="'Dancing Script', cursive"
        display={{ xs: "block", sm: 'none', lg: "block" }}
      >
        Ocial Media
      </Typography>
      <Avatar
        sx={{
          borderRadius: "0",
          ml: '-5px',
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
