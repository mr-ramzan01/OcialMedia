import { Box, Button, Container, CssBaseline, Grid,Link, Divider, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { FcGoogle } from "react-icons/fc";

// Bottom copyright
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="#000" href="/">
        Ocial Media
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme(); 

export const Login = () => {
  const [data, setData] = useState({emailorusername: '', password: ''});
  const [passwordError, setPasswordError] = useState({error: false, text: ''});
  const [emailOrUsername, setEmailOrUsername]  = useState({error: false, text: ''});
  const {setIsAuth, googleRequest} = useContext(AuthContext);
  const navigate = useNavigate();

  // Storing the data on input change
  const handleChange = (e) => {
    const {name, value} = e.target;
    setData({...data, [name]: value});
  }

  // Submitting the data of user
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/users/login', {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => res.json())
      .then((res) => {
        if(res.success) {
          setIsAuth(true);
          alert(res.message);
          navigate('/')
        }
        else {
          setEmailOrUsername({...emailOrUsername, error: true, text: 'Invalid email'})
          setPasswordError({...passwordError, error: true, text: 'Invalid password'})
        }
      }).catch((err) => {
        console.log(err, 'response error');
        alert('Something went wrong! Internal server error');
      })
  };

  return (
    <Box>
      <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            padding: '20px',
            bgcolor: '#fff',
            borderRadius: '10px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography fontFamily="'Dancing Script', cursive" component='h1' variant='h3'>Ocial Media</Typography>
          <Typography sx={{mt: 2}} component="h1" variant="h5">
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': { 
                  '&:hover fieldset': {
                      borderColor: '#0066ff', 
                  },
                  '&.Mui-focused fieldset': {
                      borderColor: '#129ffd',
                  },
                },
              }}
              id="email"
              label="Username or email"
              name="emailorusername"
              autoComplete="email"
              InputProps={{
                style: {
                  height: '50px',
                }
              }}
              autoFocus
              onChange={handleChange}
              error={emailOrUsername.error}
              helperText={emailOrUsername.text}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': { 
                  '&:hover fieldset': {
                      borderColor: '#0066ff', 
                  },
                  '&.Mui-focused fieldset': {
                      borderColor: '#129ffd',
                  },
                },
              }}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                style: {
                  height: '50px',
                }
              }}
              onChange={handleChange}
              error={passwordError.error}
              helperText={passwordError.text}
            />
            <Button
              type="submit"
              fullWidth
              size='large'
              variant="contained"
              sx={{
                mt: 4,
                background: '#129ffd',
                '&:hover': {
                  background: '#0066ff'
                }
              }}
            >
              Log In
            </Button>
            <Divider sx={{ mt: 2, mb: 2}}>or</Divider>
            <Box 
              sx={{ 
                mt: 2,
                mb: 4, 
                '&:hover': {
                  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 3px',
                  cursor: 'pointer',
                  border: 'none'
                }
              }}  
              height='45px'
              onClick={googleRequest} 
              borderRadius={'3px'} 
              display='flex' 
              alignItems={'center'} 
              justifyContent='center' 
              border='1px solid #ccc3b7'
            >
              <Box display='flex' alignItems={'center'}>
                <FcGoogle fontSize={'20px'} />
                <Typography ml='20px'>Continue with Google</Typography>
              </Box>
            </Box>
            <Grid marginBottom={1} justifyContent='center' container>
              <Grid item>
                <Link href="/accounts/forgot-password" color='#000' underline='none' fontSize={13}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Grid justifyContent='center' container>
              <Grid item>
                <Typography fontSize={13} >{"Don't have an account? "}
                <Link href="/accounts/signup" underline='hover' fontSize={13}>
                  {" Sign Up"}
                </Link></Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4, mb: 2 }} />
      </Container>
    </ThemeProvider>
    </Box>
  )
}
