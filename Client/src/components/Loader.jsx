import { Backdrop, CircularProgress, Box } from '@mui/material'
import { useState } from 'react'

export const Loader = () => {
    const [open, setOpen] = useState(true);
  return (
    <Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}
