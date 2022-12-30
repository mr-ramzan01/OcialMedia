import { Snackbar } from '@mui/material'
import React, { useState } from 'react'

export const Alert = ({message, severity}) => {
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

  return (
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
  )
}
