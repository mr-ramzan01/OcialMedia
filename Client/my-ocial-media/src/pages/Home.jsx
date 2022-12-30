import { Box, Stack } from '@mui/material'
import { LeftSideBar } from '../components/LeftSideBar'
import { useEffect } from 'react'

export const Home = () => {

  useEffect(() => {
    // fetch('/users/loggedInUser')
    // .then((res) => res.json()) 
    // .then((res) => {
    //     if(res.success) {
    //       console.log('ers',res)
    //     }
    // })
    // .catch((err) => {
    //     console.log(err, 'err');
    // })
  },[]);

  

  return (
    <>
    <Stack direction={'row'} border='1px solid red'>
      <LeftSideBar/>
      <Box border='1px solid green' marginLeft='240px' width='100%'  height='200vh'>
        home
      </Box>
    </Stack>
    </>
  )
}
