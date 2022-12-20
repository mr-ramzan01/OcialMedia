import { Box, Button, Container, CssBaseline, Checkbox, FormControlLabel, Grid,Link, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import { useState } from 'react';


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

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData({...data, [name]: value});
  }

  const handleSubmit = (event) => {
    event.preventDefault();
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
              Send Login Link
            </Button>
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
