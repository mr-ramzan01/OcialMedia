import React from 'react'
import { Box, Stack } from '@mui/material'
import { LeftSideBar } from '../components/LeftSideBar'

export const Home = () => {

  const logout = () => {
    fetch('/users/loggedOutUser')
    .then((res) => res.json())
    .then((res) => {
      console.log('res', res);
    })
  }
  return (
    <>
    <Stack direction={'row'} border='1px solid red'>
      <LeftSideBar/>
      <Box border='1px solid green' marginLeft='240px' width='100%'  height='200vh'></Box>
    </Stack>
    </>
  )
}
