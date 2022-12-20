import {  Box, Button, Container, CssBaseline, Checkbox, FormControlLabel, Grid, Link, TextField, ThemeProvider, Typography, createTheme, InputAdornment, IconButton } from '@mui/material'
import {MdVisibilityOff} from 'react-icons/md';
import {MdVisibility} from 'react-icons/md';
import validator from 'validator'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

// Bottom Copyright
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
  const [emailError, setEmailError]  = useState({error: false, text: ''});
  const [usernameError, setUsernameError] = useState({error: false, text: ''});
  const [passwordError, setPasswordError] = useState({error: false, text: ''});
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const navigate = useNavigate();

  // Storing the data on every input change
  const handleChange = (e) => {
    const {name, value} = e.target;
    setData({...data, [name]: value});
    dataValidation(name, value);
  }

  // Validation for all input fields
  const dataValidation = (name, value) => {
    if(name === 'email' && value.length > 0) {
      if(!value.includes('@') || !value.includes(".")) {
        setEmailError({...emailError, error: true, text: "Your email address should includes '@' and '.' "})
        return false;
      }
      else if(value[value.length-1] === '.' || value[value.length-1] === '@') {
        setEmailError({...emailError, error: true, text: "Your email address should not end with '@' and '.' "})
      }
      else {
        setEmailError({...emailError, error: false, text: ''})
      }
    }
    if(name === 'username' && value.length > 0) {
      if(!value.includes('-') && !value.includes('_') ) {
        setUsernameError({...usernameError, error: true, text: "username should contain '-' and '_' "})
        return false;
      }
      else {
        setUsernameError({...usernameError, error: false, text: ''})
      }
    }
    if(name === 'password' && value.length > 0) {
      if(validator.isStrongPassword(value, {
        minLength: 4,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })) {
        setPasswordError({...passwordError, error: false, text: ''})
      }
      else {
        setPasswordError({...passwordError, error: true, text: 'Password must includes at least one lowercase, uppercase, numbers and symbols.'})
        return false;
      }
    }
    return true;
  }

  // Submit the form 
  const handleSubmit = (event) => {
    event.preventDefault();
    let validate = dataValidation();

    // If all input fields are valid
    if(validate) {
      fetch('/users/signup', {
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
        if(res.message==='Username already taken') {
          setUsernameError({...usernameError, error: true, text: res.message});
        }
        if(res.message==='User already exists') {
          setEmailError({...emailError, error: true, text: res.message});
        }
      }).catch((err) => {
        console.log(err, 'res err');
        alert("Someting went wrong!! Internal server error");
      })
    }
  };
  return (
    <Box>
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
                  type={passwordVisibility?"text":"password"}
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  inputProps={{minLength: 8,}}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" color="primary" onClick={() => setPasswordVisibility(!passwordVisibility)}>
                          {passwordVisibility?<MdVisibility />: <MdVisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={passwordError.error}
                  helperText={passwordError.text}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox required color="primary" />}
                  label={<Typography fontSize={14} color='#8d929b'>I have read all the Terms & Conditions, Privacy Policy, and Cookie Settings.</Typography>}
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
