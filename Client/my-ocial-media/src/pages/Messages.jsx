import { Box, Stack } from '@mui/material'
import React from 'react'
import { LeftSideBar } from '../components/LeftSideBar'

export const Messages = () => {
  return (
    <>
    <Stack direction={'row'} border='1px solid red'>
      <LeftSideBar/>
      <Box border='1px solid green' marginLeft='240px' width='100%'  height='200vh'>
        Messages
      </Box>
    </Stack>
    </>
  )
}
