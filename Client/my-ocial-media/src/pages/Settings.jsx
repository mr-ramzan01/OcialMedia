import { Alert, Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Divider, InputLabel, Paper, Slide, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { useContext, useEffect } from 'react';
import { useState } from 'react'
import { LeftSideBar } from '../components/LeftSideBar'
import { AuthContext } from '../context/AuthContext';
import validator from 'validator';
import { Loader } from '../components/Loader'

export const Settings = () => {
  const [data, setData] = useState({old_password: '', new_password: '', confirm_new_password: ''});
  const [isActive, setIsActive] = useState('edit');
  const { getUser, userData } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  useEffect(() => {
    getUser();
  },[]);
 

  const handleActive = (val) => {
    setIsActive(val);
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData({...data, [name]: value});
  }
  

  const resetPassword = () => {
    data.email = userData.email;
    fetch(`/users/reset-password`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then((res) => {
      console.log(res);
      if(res.success) {
        setMessage(res.message);
        setSeverity('success');
        setState({ ...state, open: true });
        setData({old_password: '', new_password: '', confirm_new_password: ''});
      }
      else {
        setMessage(res.message);
        setSeverity('error');
        setState({ ...state, open: true });
      }
    })
    .catch((err) => {
      console.log(err, 'error');
      setMessage("Internal Server Error");
      setSeverity('error');
      setState({ ...state, open: true });
      setData({old_password: '', new_password: '', confirm_new_password: ''});
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(data.new_password !== data.confirm_new_password) {
      setMessage("New password do not match");
      setSeverity('error');
      setState({ ...state, open: true });
    }
    else if(validator.isStrongPassword(data.new_password, {
      minLength: 4,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      resetPassword();
    }
    else {
      setMessage("Password must includes at least one lowercase, uppercase, numbers and symbols.");
      setSeverity('error');
      setState({ ...state, open: true });
    }
  }

  const handleClose = () => {
    setState({ ...state, open: false });
    setProfileOpen(false);
  };

  const handleProfileUpdate = () => {
    setProfileOpen(true);
  }

  const handleRemoveProfile = () => {
    if(userData.image === '') {
      setProfileOpen(false);
      return;
    }
    setLoading(true);
    fetch('/users/remove-profile-photo', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      getUser();
      setMessage("Profile removed successfully");
      setSeverity('success');
      setState({ ...state, open: true });
    })
    .catch((err) => {
      console.log(err, 'error');
      setMessage("Internal Server Error");
      setSeverity('error');
      setState({ ...state, open: true });
    })
    .finally(() => {
      setLoading(false);
      setProfileOpen(false);
    })
  }


  
  const handleUploadProfile = (e) => {
    const file = e.target.files[0];

    var data = new FormData();
    data.append("profile", file);
    setLoading(true);
    fetch(`/users/upload-profile-photo/`, {
      method: 'PATCH', 
      body: data,
    })
    .then(res => res.json())
    .then(res => {
      if(res.success) {
        setMessage(res.message);
        setSeverity('success');
        setState({ ...state, open: true });
        getUser();
      }
    })
    .catch((err) => {
      console.log(err, 'error');
      setMessage("Something went wrong please try later");
      setSeverity('error');
      setState({ ...state, open: true });
    })
    .finally(() => {
      setLoading(false);
      setProfileOpen(false);
    })
  }

  if(loading) {
    return <Loader />
  }

  return (
    <>
    <Stack direction={'row'}>
      <LeftSideBar/>
      <Box padding='30px' marginLeft='240px' width='100%'>
        <Paper sx={{minHeight:'90vh'}}>
          <Stack borderBottom='1px solid #d2d2d2' justifyContent={'center'} direction={'row'}>
            <Box 
              onClick={() => handleActive('edit')} 
              p='15px 0'
              mr='30px'
              sx={{
                cursor: 'pointer',
                borderTop: isActive==='edit'? '2px solid #000': '2px solid #fff'
              }}
            >
              Edit Profile
            </Box>
            <Box 
              onClick={() => handleActive('reset')} 
              p='15px 0'
              sx={{
                cursor: 'pointer',
                borderTop: isActive==='reset'? '2px solid #000': '2px solid #fff'
              }}
            >
              Reset Password
            </Box>
          </Stack>
          {
            isActive==='edit'?
            <Box border='1px solid yellow' width='50%' m='auto' mt='20px'>
              <Stack border='1px solid red' direction={'row'} gap='20px' alignItems={'center'}>
                <Avatar sx={{width: '80px', height: '80px'}} src={userData.image} />
                <Stack row='column'>
                  <Typography fontSize='20px' fontWeight={600} fontFamily="'Petrona', serif" fontStyle={'italic'} >{userData.username}</Typography>
                  <Typography onClick={handleProfileUpdate} color='#0066ff' sx={{cursor: 'pointer'}}>Change profile photo</Typography>
                </Stack>
              </Stack>
              <Dialog onClose={handleClose} open={profileOpen}>
                <DialogTitle sx={{ color: '#000', fontSize: '15px'}}>Change Profile Photo</DialogTitle>
                <Divider/>
                <InputLabel htmlFor="filePicker" sx={{ color: '#0066ff',padding: '15px 0', textAlign: 'center', '&:hover': {cursor: 'pointer'}}}>Upload Profile</InputLabel>
                <TextField onChange={handleUploadProfile}  id='filePicker' type='file'sx={{display: 'none'}} inputProps={{accept: 'image/*'}} ></TextField>
                <Divider/>
                <DialogContent onClick={handleRemoveProfile} sx={{ color: 'tomato', padding: '15px 0', textAlign: 'center', '&:hover': {cursor: 'pointer'}}}>Remove Photo</DialogContent>
                <Divider/>
                <DialogContent onClick={handleClose} sx={{textAlign: 'center', padding: '15px 0', '&:hover': {cursor: 'pointer'}}}>Cancel</DialogContent>
              </Dialog>
            </Box>:
            <Box mt='20px'>
              <Box component="form" width='40%' m='auto' onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  autoFocus
                  value={data.old_password}
                  sx={{
                    '& .MuiOutlinedInput-root': { 
                      '& fieldset': {
                        borderColor: 'transparent'
                      },
                      '&:hover fieldset': {
                          border: '#f1f1f1'
                      },
                      '&.Mui-focused fieldset': {
                          borderColor: '#a8a8a8'
                      },
                    },
                    bgcolor: '#f1f1f1',
                    borderRadius: '5px'
                  }}
                  name="old_password"
                  placeholder='Old Password'
                  type="password"
                  id="old_password"
                  autoComplete="current-password"
                  InputProps={{
                    style: {
                      height: '50px',
                    }
                  }}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  value={data.new_password}
                  sx={{
                    '& .MuiOutlinedInput-root': { 
                      '& fieldset': {
                        borderColor: 'transparent'
                      },
                      '&:hover fieldset': {
                          border: '#f1f1f1'
                      },
                      '&.Mui-focused fieldset': {
                          borderColor: '#a8a8a8'
                      },
                    },
                    bgcolor: '#f1f1f1',
                    borderRadius: '5px'
                  }}
                  name="new_password"
                  placeholder="New Password"
                  type="password"
                  id="new_password"
                  autoComplete="current-password"
                  InputProps={{
                    style: {
                      height: '50px',
                    }
                  }}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  value={data.confirm_new_password}
                  sx={{
                    '& .MuiOutlinedInput-root': { 
                      '& fieldset': {
                        borderColor: 'transparent'
                      },
                      '&:hover fieldset': {
                          border: '#f1f1f1'
                      },
                      '&.Mui-focused fieldset': {
                          borderColor: '#a8a8a8'
                      },
                    },
                    bgcolor: '#f1f1f1',
                    borderRadius: '5px'
                  }}
                  name="confirm_new_password"
                  placeholder="Confirm New Password"
                  type="password"
                  id="confirm_new_password"
                  autoComplete="current-password"
                  InputProps={{
                    style: {
                      height: '50px',
                    }
                  }}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  disabled={userData.authType === 'google'}
                  size='large'
                  variant="contained"
                  sx={{
                    borderRadius: '5px',
                    mt: 4,
                    background: '#129ffd',
                    boxShadow: 'none',
                    '&:hover': {
                      background: '#0066ff',
                      boxShadow: 'none',
                    }
                  }}
                >
                  Change Password
                </Button>
              </Box>
            </Box>
          }
        </Paper>
      </Box>
    </Stack>
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={5000}
      TransitionComponent={Slide}
      onClose={handleClose}
      key={vertical + horizontal}
    >
      <Alert icon={false} onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
    </>
  )
}
