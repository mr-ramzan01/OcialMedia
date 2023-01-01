import { Alert, Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, InputAdornment, InputLabel, Paper, Slide, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { useContext, useEffect } from 'react';
import { useState } from 'react'
import { LeftSideBar } from '../components/LeftSideBar'
import { AuthContext } from '../context/AuthContext';
import validator from 'validator';
import { Loader } from '../components/Loader'

export const Settings = () => {
  const [data, setData] = useState({old_password: '', new_password: '', confirm_new_password: ''});
  const [isActive, setIsActive] = useState('edit');
  const { getUser, userData, editData, setEditData } = useContext(AuthContext);
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
    fetch(`/users/reset-password`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then((res) => {
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

  const editDataValidation = () => {
    if(editData.full_name.length<=1) {
      setMessage("Your name should be at least 3 characters long");
      setSeverity('error');
      setState({ ...state, open: true });
      return false;
    }
    if(!editData.email.includes('@') || !editData.email.includes(".")) {
      setMessage("Your email address should includes '@' and '.' ");
      setSeverity('error');
      setState({ ...state, open: true });
      return false;
    }
    else if(editData.email[editData.email.length-1] === '.' || editData.email[editData.email.length-1] === '@') {
      setMessage("Your email address should not end with '@' and '.' ");
      setSeverity('error');
      setState({ ...state, open: true });
      return false;
    }
    if(editData.mobile_no.length > 0) {
      if(editData.mobile_no.includes('.')) {
        setMessage("Mobile no. should not include '.'");
        setSeverity('error');
        setState({ ...state, open: true });
        return false;
      }
      else if(editData.mobile_no.length != 10) {
        setMessage("Mobile no. should be 10 digits only");
        setSeverity('error');
        setState({ ...state, open: true });
        return false;
      }
    }
    return true;
  }

  const handleEditChange = (e) => {
    const {name, value} = e.target;
    setEditData({...editData, [name]: value});
  }

  const handleEditProfileSubmit = (event) => {
    event.preventDefault();
    const validation = editDataValidation();
    if(validation) {
      setLoading(true);
      fetch(`/users/udpate-user-profile`, {
        method: 'PATCH',
        body: JSON.stringify(editData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => {
        if(res.success) {
          setMessage(res.message);
          setSeverity('success');
          setState({ ...state, open: true });
        }
        else {
          setMessage(res.message);
          setSeverity('error');
          setState({ ...state, open: true });
        }
      })
      .catch(err => {
        console.log(err, 'error');
        setMessage("Something went wrong please try later");
        setSeverity('error');
        setState({ ...state, open: true });
      })
      .finally(() => {
        setLoading(false);
      })
    }
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
            <Box width='50%' m='auto' mt='20px' pb='40px'>
              <Stack direction={'row'} gap='20px' alignItems={'center'}>
                <Box width='20%'>
                  <Avatar sx={{width: '80px', height: '80px'}} src={userData.image} />
                </Box>
                <Stack width='80%' row='column'>
                  <Typography fontSize='20px' fontWeight={600} fontFamily="'Petrona', serif" fontStyle={'italic'} >{userData.username}</Typography>
                  <Typography onClick={handleProfileUpdate} color='#0066ff' sx={{cursor: 'pointer'}}>Change profile photo</Typography>
                </Stack>
              </Stack>
              <Dialog onClose={handleClose} open={profileOpen}>
                <DialogTitle sx={{ color: '#000', fontSize: '15px'}}>Change Profile Photo</DialogTitle>
                <Divider/>
                <InputLabel htmlFor="filePicker" sx={{ color: '#0066ff',padding: '15px 0', textAlign: 'center', '&:hover': {cursor: 'pointer'}}}>Upload Photo</InputLabel>
                <TextField onChange={handleUploadProfile}  id='filePicker' type='file'sx={{display: 'none'}} inputProps={{accept: 'image/*'}} ></TextField>
                <Divider/>
                <DialogContent onClick={handleRemoveProfile} sx={{ color: 'tomato', padding: '15px 0', textAlign: 'center', '&:hover': {cursor: 'pointer'}}}>Remove Photo</DialogContent>
                <Divider/>
                <DialogContent onClick={handleClose} sx={{textAlign: 'center', padding: '15px 0', '&:hover': {cursor: 'pointer'}}}>Cancel</DialogContent>
              </Dialog>

              <Box component='form' onSubmit={handleEditProfileSubmit}>
              <Grid container>
                <Stack m={'40px 0'} gap='20px' alignItems='center' width='100%' direction={'row'}>
                  <Typography width='20%' >Full Name</Typography>
                  <TextField
                    autoComplete="given-name"
                    name="full_name"
                    type='text'
                    value={editData.full_name}
                    required
                    sx={{
                      width: '80%',
                      '& .MuiOutlinedInput-root': { 
                        '& fieldset': {
                          borderColor: 'transparent'
                        },
                        '&:hover fieldset': {
                            border: '#f1f1f1'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'transparent'
                        },
                      },
                      bgcolor: '#f1f1f1',
                      borderRadius: '5px'
                    }}
                    id="full_name"
                    InputProps={{
                      style: {
                        height: '50px',
                      }
                    }}
                    onChange={handleEditChange}
                  />
                </Stack>
                <Stack m={'20px 0'} gap='20px' alignItems='center' width='100%' direction={'row'}>
                   <Typography width='20%' >Username</Typography>
                    <TextField
                      autoComplete="given-username"
                      name="username"
                      type='text'
                      value={editData.username}
                      required
                      sx={{
                        width: '80%',
                        '& .MuiOutlinedInput-root': { 
                          '& fieldset': {
                            borderColor: 'transparent'
                          },
                          '&:hover fieldset': {
                              border: '#f1f1f1'
                          },
                          '&.Mui-focused fieldset': {
                              borderColor: 'transparent'
                          },
                        },
                        bgcolor: '#f1f1f1',
                        borderRadius: '5px'
                      }}
                      id="username"
                      InputProps={{
                        style: {
                          height: '50px',
                        }
                      }}
                      onChange={handleEditChange}
                    />
                  </Stack>
                  <Stack m={'20px 0'} gap='20px' alignItems='center' width='100%' direction={'row'}>
                   <Typography width='20%' >Bio</Typography>
                    <TextField
                      autoComplete="given-bio"
                      name="bio"
                      type='text'
                      value={editData.bio}
                      multiline
                      rows={4}
                      sx={{
                        width: '80%',
                        '& .MuiOutlinedInput-root': { 
                          '& fieldset': {
                            borderColor: 'transparent'
                          },
                          '&:hover fieldset': {
                              border: '#f1f1f1'
                          },
                          '&.Mui-focused fieldset': {
                              borderColor: 'transparent'
                          },
                        },
                        bgcolor: '#f1f1f1',
                        borderRadius: '5px'
                      }}
                      id="bio"
                      onChange={handleEditChange}
                    />
                  </Stack>
                  <Stack m={'20px 0'} gap='20px' alignItems='center' width='100%' direction={'row'}>
                   <Typography width='20%' >Email</Typography>
                    <TextField
                      autoComplete="given-email"
                      disabled={userData.authType=='google'}
                      name="email"
                      required
                      type='email'
                      value={editData.email}
                      sx={{
                        width: '80%',
                        '& .MuiOutlinedInput-root': { 
                          '& fieldset': {
                            borderColor: 'transparent'
                          },
                          '&:hover fieldset': {
                              border: '#f1f1f1'
                          },
                          '&.Mui-focused fieldset': {
                              borderColor: 'transparent'
                          },
                        },
                        bgcolor: '#f1f1f1',
                        borderRadius: '5px'
                      }}
                      id="email"
                      InputProps={{
                        style: {
                          height: '50px',
                        }
                      }}
                      onChange={handleEditChange}
                    />
                  </Stack>
                  <Stack m={'20px 0'} gap='20px' alignItems='center' width='100%' direction={'row'}>
                   <Typography width='20%' >Mobile No.</Typography>
                    <TextField
                      autoComplete="given-number"
                      name="mobile_no"
                      type='number'
                      value={editData.mobile_no}
                      sx={{
                        width: '80%',
                        '& .MuiOutlinedInput-root': { 
                          '& fieldset': {
                            borderColor: 'transparent'
                          },
                          '&:hover fieldset': {
                              border: '#f1f1f1'
                          },
                          '&.Mui-focused fieldset': {
                              borderColor: 'transparent'
                          },
                        },
                        bgcolor: '#f1f1f1',
                        borderRadius: '5px'
                      }}
                      id="mobile_no"
                      inputProps={{
                        maxLength: 10
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment sx={{color: 'black'}} position="start">+91 </InputAdornment>,
                        style: {
                          height: '50px',
                          '& ::WebkitOuterSpinButton': {
                            '-webkitAppearance': 'none',
                            margin: 0
                          },
                          '& ::WebkitInnerSpinButton': {
                            '-webkitAppearance': 'none',
                            margin: 0
                          },
                        },
                      }}
                      onChange={handleEditChange}
                    />
                  </Stack>
              </Grid>
              <Stack gap="20px" direction='row'>
                <Box width='20%'></Box>
                <Box width='80%'>
                  <Button
                    type="submit"
                    disabled={userData === editData}
                    size='large'
                    variant="contained"
                    sx={{ 
                      mt: 3,
                      boxShadow: 'none',
                      background: '#129ffd',
                      '&:hover': {
                        background: '#0066ff',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Update
                  </Button>
                </Box>
              </Stack>








              </Box>
            </Box>:
            <Box mt='20px'>
              <Box component="form" width='50%' m='auto' onSubmit={handleSubmit}>
                <Stack m={'40px 0'} gap='20px' alignItems='center' width='100%' direction={'row'}>
                  <Typography width='20%' >Old Password</Typography>
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
                          border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                          border: 'none'
                      },
                    },
                    bgcolor: '#f1f1f1',
                    borderRadius: '5px',
                    border:'1px solid gray'
                  }}
                  name="old_password"
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
                </Stack>
                <Stack m={'40px 0'} gap='20px' alignItems='center' width='100%' direction={'row'}>
                  <Typography width='20%' >New Password</Typography>
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
                          border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                          border: 'none'
                      },
                    },
                    bgcolor: '#f1f1f1',
                    borderRadius: '5px',
                    border:'1px solid gray'
                  }}
                  name="new_password"
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
                </Stack>
                <Stack m={'40px 0'} gap='20px' alignItems='center' width='100%' direction={'row'}>
                  <Typography width='20%' >Confirm New Password</Typography>
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
                          border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                          border: 'none'
                      },
                    },
                    bgcolor: '#f1f1f1',
                    borderRadius: '5px',
                    border:'1px solid gray'
                  }}
                  name="confirm_new_password"
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
                </Stack>
                <Stack direction='row'>
                  <Box width='20%'></Box>
                  <Box width='80%'>
                    <Button
                      type="submit"
                      disabled={userData.authType === 'google'}
                      size='large'
                      variant="contained"
                      sx={{
                        borderRadius: '5px',
                        // mt: 4,
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
                </Stack>
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
