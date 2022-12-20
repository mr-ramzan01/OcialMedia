import { Box, Button, Container, CssBaseline, Grid,Link, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import { useState } from 'react';
import emailjs from '@emailjs/browser'

// Bottom Copyright 
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
export const ForgotPassword = () => {
  const [data, setData] = useState({email: '',});
  const [emailError, setEmailError]  = useState({error: false, text: ''});
  const [sentInvitationLink, setSentInvitationLink] = useState(false);

  // Storing email on very input change
  const handleChange = (e) => {
    const {name, value} = e.target;
    setData({...data, [name]: value});
  }

  // Submiting the email and checking the response 
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.success) {
        console.log(res);
        // Seding Email to registered user email
        emailjs.send("service_t8tkdmq","template_z78wv9c",{
          user_name: res.full_name,
          link: `http://localhost:3000/accounts/forgot-password/create-new-password`,
          reply_to: data.email,
          },"CYyDb5GDuo6dEEiox")
          .then(() => {
            setSentInvitationLink(true);
          }).catch(() => {
            alert("Someting went wrong while sending email!")
        })
      }

      // if entered email does not present in the database
      else if(res.message==='Invalid email') {
        setEmailError({...emailError, error: true, text: res.message })
      }
    })
    .catch((err) => {
      console.log(err, 'error');
      alert('Something went wrong! Internal server error');
    })
  }
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
            Change Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {sentInvitationLink?<Box m='20px 0'>
              <Typography textAlign='center' as='h6'>An email has been sent to your registered email addresss, please confirm and set new password there.</Typography>
            </Box>:
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Enter email address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleChange}
                  error={emailError.error}
                  helperText={emailError.text}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 4, mb: 4 }}
                >
                  Confirm
                </Button>
              </>
            }
            <Grid marginBottom={1} justifyContent='center' container>
              <Grid item>
                <Link href="/accounts/signup" color='#000' underline='none' fontSize={13}>
                  create new account
                </Link>
              </Grid>
            </Grid>
            <Grid justifyContent='center' container>
              <Grid item>
                <Link href="/accounts/login" underline='hover' fontSize={13}>
                  {"Back to Login"}
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
