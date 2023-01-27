import { Snackbar, Slide, Alert } from '@mui/material'
import React, { useState } from 'react'

export const ShowAlert = ({message, severity, alertOpen, setAlertOpen}) => {
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    
    const { vertical, horizontal } = state;

    const handleClose = () => {
        setAlertOpen(false);
    };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={alertOpen}
      autoHideDuration={5000}
      TransitionComponent={Slide}
      onClose={handleClose}
      key={vertical + horizontal}
    >
      <Alert icon={false} onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
