import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

export const GoogleOauth = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);



    useEffect(() => {
        fetch(`/users/google_Oauth?code=${params.get('code')}`)
        .then((res) => res.json())
        .then((res) => {
            console.log(res, 'google res')
            if(res.success) {
                navigate('/');
            }
            else if(res.message === 'User already exists with email and password') {
                alert(res.message);
                navigate('/accounts/login');
            }
            else {
                alert("Internal Error, please try again later!");
                navigate('/accounts/login');
            }
        })
        .catch((err) => {
            console.log(err, 'err');
            alert("Internal Error, please try again later!")
            navigate('/accounts/login');
        })
    },[])
  return (
    <Box height='100vh'  display={'flex'} alignItems='center' justifyContent={'center'} >
      <CircularProgress sx={{color: '#000000'}} size={80}/>
    </Box>
  )
}
