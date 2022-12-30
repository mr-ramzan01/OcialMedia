import { Avatar, Badge, Box, Button, Dialog, DialogActions, DialogTitle, Link, Stack, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AiFillHome, AiOutlineMessage } from "react-icons/ai";
import { BsSearch, BsSuitHeart } from "react-icons/bs";
import { MdOutlineExplore } from "react-icons/md";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { AuthContext } from '../context/AuthContext';



export const LeftSideBar = () => {
    const [open, setOpen] = useState(false);
    const { userData, getUser } = useContext(AuthContext);

    const logout = () => {
        setOpen(false);
        fetch('/users/loggedOutUser')
        .then((res) => res.json())
        .then((res) => {
            window.location.reload();
          console.log('res', res);
        })
    }
    const handleLogout = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getUser();
    },[]);

  return (
    <>
    <Box padding='0 20px' width='200px' bgcolor={'#fff'} borderRight='1px solid #d2d2d2' zIndex={'100'} color='#000000' minHeight='100vh' position={'fixed'}>
        <Typography variant='h4' mt='40px' component={'h1'} fontFamily="'Dancing Script', cursive">Ocial Media</Typography>
        <Stack direction={'column'} >
            <Link 
                href='/'
                sx={{
                    '&:hover': {
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        borderRadius: '20px'
                    }
                }} 
                m='20px 0 8px 0' 
                color={'#000'} 
                p='10px' 
                underline='none' 
                display={'flex'} 
                alignItems={'center'}
                // border='1px solid red'
            >
                <AiFillHome fontSize={'25px'}/>
                <Typography ml='15px'>Home</Typography>
            </Link>
            <Link 
                href='/search'
                sx={{
                    '&:hover': {
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        borderRadius: '20px'
                    }
                }} 
                m='10px 0 8px 0' 
                color={'#000'} 
                p='10px' 
                underline='none' 
                display={'flex'} 
                alignItems={'center'}
                // border='1px solid red'
            >
                <BsSearch fontSize={'25px'}/>
                <Typography ml='15px'>Search</Typography>
            </Link>
            <Link 
                href='/explore'
                sx={{
                    '&:hover': {
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        borderRadius: '20px'
                    }
                }} 
                m='10px 0 8px 0' 
                color={'#000'} 
                p='10px' 
                underline='none' 
                display={'flex'} 
                alignItems={'center'}
                // border='1px solid red'
            >
                <MdOutlineExplore fontSize={'25px'}/>
                <Typography ml='15px'>Explore</Typography>
            </Link>
            <Link 
                href='/messages'
                sx={{
                    '&:hover': {
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        borderRadius: '20px'
                    }
                }} 
                m='10px 0 8px 0' 
                color={'#000'} 
                p='10px' 
                underline='none' 
                display={'flex'} 
                alignItems={'center'}
                // border='1px solid red'
            >
                <Badge  
                    sx={{"& .MuiBadge-badge": {
                            color: "#fff",
                            backgroundColor: "red"
                        }
                    }} 
                    badgeContent={1}
                    overlap='circular'
                >
                    <AiOutlineMessage fontSize={'25px'}/>
                </Badge>
                <Typography ml='15px'>Messages</Typography>
            </Link>
            <Link 
                href='/notifications'
                sx={{
                    '&:hover': {
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        borderRadius: '20px'
                    }
                }} 
                m='10px 0 8px 0' 
                color={'#000'} 
                p='10px' 
                underline='none' 
                display={'flex'} 
                alignItems={'center'}
                // border='1px solid red'
            >
                <Badge 
                    sx={{
                        "& .MuiBadge-badge": {
                            color: "#fff",
                            backgroundColor: "red"
                            
                        }
                    }}
                    variant='dot'
                    invisible={false}
                    overlap='circular'
                >
                    <BsSuitHeart fontSize={'25px'}/>
                </Badge>
                <Typography ml='15px'>Notifications</Typography>
            </Link>
            <Link 
                href='/profile'
                sx={{
                    '&:hover': {
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        borderRadius: '20px'
                    }
                }} 
                m='10px 0 8px 0' 
                color={'#000'} 
                p='10px' 
                underline='none' 
                display={'flex'} 
                alignItems={'center'}
                // border='1px solid red'
            >
                <Avatar src={userData.image} sx={{width:'25px', height:'25px'}}/>
                <Typography ml='15px'>Profile</Typography>
            </Link>
            <Link 
                href='/settings'
                sx={{
                    '&:hover': {
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        borderRadius: '20px'
                    }
                }} 
                m='10px 0 8px 0' 
                color={'#000'} 
                p='10px' 
                underline='none' 
                display={'flex'} 
                alignItems={'center'}
                // border='1px solid red'
            >
                <IoSettingsOutline fontSize={'25px'}/>
                <Typography ml='15px'>Settings</Typography>
            </Link>
            <Link 
                sx={{
                    '&:hover': {
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        borderRadius: '20px'
                    }
                }} 
                m='10px 0 8px 0' 
                color={'#000'} 
                p='10px' 
                underline='none' 
                display={'flex'} 
                alignItems={'center'}
                onClick={handleLogout}
                // border='1px solid red'
            >
                <IoLogOutOutline fontSize={'25px'}/>
                <Typography ml='15px'>Logout</Typography>
            </Link>
            
        </Stack>
    </Box>
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle fontSize={'15px'} id="alert-dialog-title">
          {"Are you sure you want to logout?"}
        </DialogTitle>
        <DialogActions sx={{padding: '10px 20px'}}>
          <Button sx={{fontSize: '12px', color: 'gray', '&:hover': {background: 'none'}}} size='small' onClick={handleClose}>Cancel</Button>
          <Button sx={{fontSize: '12px', color: '#000', '&:hover': {background: 'none'}}} size='small' color='error' onClick={logout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  )
}
