import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

export const NotFound = () => {
  return (
    <Box height='100vh' display='flex' alignItems='center' justifyContent='center'>
        <Stack direction='column'>
          <img src="/Images/404user.gif" alt="404 user" />
          <Typography textAlign='center' variant='h3' fontFamily={"'Dancing Script', cursive"}>Page Not Found</Typography>
        </Stack>
      </Box>
  )
}
