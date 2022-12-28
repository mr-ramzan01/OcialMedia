import { Avatar, Badge, Box, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import { AiFillHome, AiOutlineMessage } from "react-icons/ai";
import { BsSearch, BsSuitHeart } from "react-icons/bs";
import { MdOutlineExplore } from "react-icons/md";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";



export const LeftSideBar = () => {
  return (
    <Box padding='0 20px' width='200px' bgcolor={'#fff'} zIndex={'100'} border='1px solid blue'  color='#000000' minHeight='100vh' position={'fixed'}>
        <Typography variant='h4' mt='40px' component={'h1'} fontFamily="'Dancing Script', cursive">Ocial Media</Typography>
        <Stack direction={'column'} >
            <Link 
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
                <Badge color="secondary" badgeContent={1}>
                    <AiOutlineMessage fontSize={'25px'}/>
                </Badge>
                <Typography ml='15px'>Messages</Typography>
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
                // border='1px solid red'
            >
                <Badge color="secondary" variant='dot' invisible={false}>
                    <BsSuitHeart fontSize={'25px'}/>
                </Badge>
                <Typography ml='15px'>Notifications</Typography>
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
                // border='1px solid red'
            >
                <Avatar src='' sx={{width:'25px', height:'25px'}}/>
                <Typography ml='15px'>Profile</Typography>
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
                // border='1px solid red'
            >
                <IoLogOutOutline fontSize={'25px'}/>
                <Typography ml='15px'>Logout</Typography>
            </Link>
            
        </Stack>
    </Box>
  )
}
