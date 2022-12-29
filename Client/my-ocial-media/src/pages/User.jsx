import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { LeftSideBar } from '../components/LeftSideBar';
import { Loader } from '../components/Loader';

export const User = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [ userNotFound, setUserNotFound] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      fetch(`/users/${username}`)
      .then((res) => res.json())
      .then((res) => {
        if(res.success) {
          setUserData(res.data);
        }
        else {
          setUserNotFound(true);
        }
        console.log(res, 'res user');
      })
      .catch((err) => {
        console.log(err, 'error');
      })
      .finally(() => {
        setIsLoading(false);
      })
    },[]);


    if(isLoading) {
      return <Loader/>
    }

    if(userNotFound) {
      return <Box height='100vh' display='flex' alignItems='center' justifyContent='center'>
        <Stack direction='column'>
          <img src="/Images/404user.gif" alt="" />
          <Typography textAlign='center' variant='h3' fontFamily={"'Dancing Script', cursive"}>User Not Found</Typography>
        </Stack>
      </Box>
    }

  return (
    <>
    <Stack direction={"row"}>
      <LeftSideBar />
      <Box border='1px solid red' marginLeft="240px" width="100%">
        user
      </Box>
    </Stack>
  </>
  )
}
