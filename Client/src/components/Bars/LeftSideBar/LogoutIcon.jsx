import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Link,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";

export const LogoutIcon = () => {
  const [open, setOpen] = useState(false);

  const logout = () => {
    setOpen(false);
    fetch(`api/users/loggedOutUser`)
      .then((res) => res.json())
      .then((res) => {
        window.location.reload();
        console.log("res", res);
      });
  };
  const handleLogout = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Link
        sx={{
          "&:hover": {
            backgroundColor:{xs: '', lg: "#fafafa"},
            cursor: "pointer",
            borderRadius: "20px",
          },
        }}
        m={{xs: '0', sm: "10px 0 8px 0"}}
        color={"#000"}
        p="10px"
        underline="none"
        display={{ xs: "block", lg: "flex" }}
        alignItems={"center"}
        onClick={handleLogout}
      >
        <IoLogOutOutline fontSize={"25px"} />
        <Typography display={{ xs: "none", lg: "block" }} ml="15px">
          Logout
        </Typography>
      </Link>
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle fontSize={"15px"} id="alert-dialog-title">
            {"Are you sure you want to logout?"}
          </DialogTitle>
          <DialogActions sx={{ padding: "10px 20px" }}>
            <Button
              sx={{
                fontSize: "12px",
                color: "gray",
                "&:hover": { background: "none" },
              }}
              size="small"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              sx={{
                fontSize: "12px",
                color: "#000",
                fontWeight: "600",
                "&:hover": { background: "none" },
              }}
              size="small"
              onClick={logout}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
