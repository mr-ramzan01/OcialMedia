import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { NavItem } from "./NavItem";

export const LogoutIcon = ({ variant = "side" }) => {
  const [open, setOpen] = useState(false);
  const { logout: signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    setOpen(false);
    signOut();
    navigate("/accounts/login", { replace: true });
  };

  return (
    <>
      <NavItem
        variant={variant}
        icon={IoLogOutOutline}
        label="Logout"
        onClick={() => setOpen(true)}
      />
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
      >
        <DialogTitle>Log out of Ocial Media?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            You can always log back in with your username or email.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="text" color="inherit" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={logout}>
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
