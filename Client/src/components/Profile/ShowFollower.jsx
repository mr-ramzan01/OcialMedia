import { Avatar, Box, Dialog, Link, Stack, Typography } from '@mui/material'

export const ShowFollower = ({followersOpen, followersData, handleClose}) => {
  return (
    <>
    {/* It will show all follower of the user */}
<Dialog onClose={handleClose} open={followersOpen}>
<Box
  sx={{
    maxHeight: "60vh",
    width: "100%",
    overflowY: "scroll",
    borderRadius: "5px",
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
    {followersData.length > 0 ? (
      followersData.map((el) => (
        <Link
          href={`/${el.following_Id.username}`}
          key={el.following_Id._id}
          underline="none"
          color="#000"
        >
          <Stack
            padding="5px 10px"
            sx={{ cursor: "pointer" }}
            alignItems="center"
            direction={"row"}
          >
            <Avatar sx={{ mr: "30px" }} src={el.following_Id.image} />
            <Box>
              <Typography
                fontSize="20px"
                fontWeight={600}
                fontFamily={"'Dancing Script', cursive"}
              >
                {el.following_Id.username}
              </Typography>
              <Typography color="#8d929b">
                {el.following_Id.full_name}
              </Typography>
            </Box>
          </Stack>
        </Link>
      ))
    ) : (
      <Box p="10px">
        <Typography textAlign="center">No Followers to show</Typography>
      </Box>
    )}
  </Box>
</Box>
</Dialog>

    </>
  )
}
