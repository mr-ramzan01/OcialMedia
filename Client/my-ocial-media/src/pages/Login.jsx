import { Box, Button, Container, CssBaseline, Checkbox, FormControlLabel, Grid,Link, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import { useState } from 'react';
import { useNavigate } from 'react-router';

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
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => res.json())
      .then((res) => {
        if(res.success) {
          alert(res.message);
          navigate('/')
        }
        else {
          setEmailOrUsername({...emailOrUsername, error: true, text: 'Invalid email'})
          setPasswordError({...passwordError, error: true, text: 'Invalid password'})
        }
      }).catch((err) => {
        console.log(err, 'res err');
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
              id="email"
              label="Username or email"
              name="emailorusername"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
              error={emailOrUsername.error}
              helperText={emailOrUsername.text}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
              error={passwordError.error}
              helperText={passwordError.text}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={<Typography fontSize={15}>Remember me</Typography>}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 4 }}
            >
              Log In
            </Button>
            <Grid marginBottom={1} justifyContent='center' container>
              <Grid item>
                <Link href="/accounts/forgotpassword" color='#000' underline='none' fontSize={13}>
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
