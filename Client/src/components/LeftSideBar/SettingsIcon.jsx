import { Link, Typography } from '@mui/material'
import { IoSettingsOutline } from "react-icons/io5";

export const SettingsIcon = () => {
  return (
    <>
    <Link
              href="/settings"
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  borderRadius: "20px",
                },
              }}
              m="10px 0 8px 0"
              color={"#000"}
              p="10px"
              underline="none"
              display={"flex"}
              alignItems={"center"}
            >
              <IoSettingsOutline fontSize={"25px"} />
              <Typography display={{ xs: "none", lg: "block" }} ml="15px">Settings</Typography>
            </Link>
    </>
  )
}
