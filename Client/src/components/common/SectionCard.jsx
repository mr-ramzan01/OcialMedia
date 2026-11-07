import { Paper } from "@mui/material";

/** Standard white card with the app's rounded corners and border. */
export const SectionCard = ({ children, sx, ...rest }) => (
  <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 5, ...sx }} {...rest}>
    {children}
  </Paper>
);
