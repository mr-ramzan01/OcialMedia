import { Avatar, Box, Dialog, Link, Stack, Typography } from '@mui/material'

export const ShowFollowing = ({followingOpen, followingData, handleClose}) => {
  return (
    <>
    {/* It will show all following of the user */}
    <Dialog onClose={handleClose} open={followingOpen}>
        <Box
          sx={{
            maxHeight: "60vh",
            width: "30vw",
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
            {followingData.length > 0 ? (
              followingData.map((el) => (
                <Link
                  href={`/${el.follower_Id.username}`}
                  key={el.follower_Id._id}
                  underline="none"
                  color="#000"
                >
                  <Stack
                    padding="5px 10px"
                    sx={{ cursor: "pointer" }}
                    alignItems="center"
                    direction={"row"}
                  >
                    <Avatar sx={{ mr: "30px" }} src={el.follower_Id.image} />
                    <Box>
                      <Typography
                        fontSize="20px"
                        fontWeight={600}
                        fontFamily={"'Dancing Script', cursive"}
                      >
                        {el.follower_Id.username}
                      </Typography>
                      <Typography color="#8d929b">
                        {el.follower_Id.full_name}
                      </Typography>
                    </Box>
                  </Stack>
                </Link>
              ))
            ) : (
              <Box p="10px">
                <Typography textAlign="center">No Following to show</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

