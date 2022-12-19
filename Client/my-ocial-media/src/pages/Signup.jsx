import { Avatar, Box, Button, Container, CssBaseline, FormControl, Checkbox, FormControlLabel, FormHelperText, Grid, Input, InputLabel, Link, TextField, ThemeProvider, Typography, createTheme, Alert, AlertTitle } from '@mui/material'
import { Stack } from '@mui/system';
import validator from ''
import { useState } from 'react';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="#000" href="/">
        Ocail Media
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme(); 

export const Signup = () => {
  const [data, setData] = useState({full_name: '', email: '', username: '', password: ''});
  const [submitError, setSubmitError] = useState(false);
  const [emailError, setEmailError]  = useState({error: false, text: ''});
  const [usernameError, setUsernameError] = useState({error: false, text: ''});
  const [passwordError, setPasswordError] = useState({error: false, text: ''});

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData({...data, [name]: value});
    dataValidation();
  }

  const dataValidation = () => {
    if(data.email.length > 0) {
      if(!data.email.includes('@') || !data.email.includes(".")) {
        setEmailError({...emailError, error: true, text: "Your email address should includes '@' and '.' "})
        return false;
      }
      else if(data.email[data.email.length-1] === '.' || data.email[data.email.length-1] === '@') {
        setEmailError({...emailError, error: true, text: "Your email address should not end with '@' and '.' "})
      }
      else {
        setEmailError({...emailError, error: false, text: ''})
      }
    }
    if(data.username.length > 0) {
      if(!data.username.includes('-') && !data.username.includes('_') ) {
        setUsernameError({...usernameError, error: true, text: "username should contain '-' and '_' "})
        return false;
      }
      else {
        setUsernameError({...usernameError, error: false, text: ''})
      }
    }
    if(data.password.length > 0) {
      
    }
    return true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError(true);
    console.log(data, 'data');
    let validate = dataValidation();
    if(validate) {
      console.log("validation Success");
    }
    // fetch('http://localhost:8080/users/signup', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     "full_name": "Ramzan2",
    //     "email": "aa@.com",
    //     "password": "true",
    //     "username": "ramzan01"
    // }),
    // headers: {
    //   'Content-Type': 'application/json'
    // }
    // }).then((res) => res.json())
    // .then((res) => {
    //   console.log(res, 'res data');
    // }).catch((err) => {
    //   console.log(err, 'res err');
    // })
  };
  return (
    <Box border='1px solid red'>
     <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
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
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  autoComplete="given-name"
                  name="full_name"
                  required
                  fullWidth
                  id="full_name"
                  label="Full Name"
                  autoFocus
                  inputProps={{minLength: 2}}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  error={emailError.error}
                  helperText={emailError.text}
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="family-name"
                  onChange={handleChange}
                  error={usernameError.error}
                  helperText={usernameError.text}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  inputProps={{minLength: 8}}
                  error={passwordError.error}
                  helperText={passwordError.text}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox required color="primary" />}
                  label={<Typography fontSize={14}>I have read all the Terms & Conditions, Privacy Policy, and Cookie Settings</Typography>}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 4 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid fontSize={14} item>
                {'Have an account? '}
                <Link href="/accounts/login" underline='hover' variant="body2">
                  Log In
                </Link>
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
