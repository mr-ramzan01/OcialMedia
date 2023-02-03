import { Box, Paper, Stack } from "@mui/material";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ResetPassword } from "../components/Settings/ResetPassword";
import { EditProfile } from "../components/Settings/EditProfile";
import { Navbar } from "../components/Bars/Navbar";
import { BottomBar } from "../components/Bars/BottomBar";
import { LeftSideBar } from "../components/Bars/LeftSideBar";

export const Settings = () => {
  const [isActive, setIsActive] = useState("edit");
  const { getUser } = useContext(AuthContext);

  useEffect(() => {
    getUser();
  }, []);

  const handleActive = (val) => {
    setIsActive(val);
  };

  return (
    <>
      <Navbar />
      <BottomBar />
      <Stack direction={"row"}>
        <LeftSideBar />
        <Box marginLeft={{ xs: "0", sm: "80px", lg: "240px" }} width="100%">
          <Paper
            sx={{
              border: "1px solid #d1d1d1",
              minHeight: {
                xs: "calc(100vh - 145px)",
                sm: "calc(100vh - 65px)",
              },
              width: {
                xs: "calc(100% - 40px)",
                sm: "500px",
                md: "700px",
                lg: "900px",
              },
              margin: { xs: "70px 20px", sm: "30px auto" },
            }}
          >
            <Stack
              borderBottom="1px solid #d2d2d2"
              justifyContent={"center"}
              direction={"row"}
            >
              <Box
                onClick={() => handleActive("edit")}
                p="15px 0"
                mr="30px"
                sx={{
                  cursor: "pointer",
                  borderTop:
                    isActive === "edit" ? "2px solid #000" : "2px solid #fff",
                }}
              >
                Edit Profile
              </Box>
              <Box
                onClick={() => handleActive("reset")}
                p="15px 0"
                sx={{
                  cursor: "pointer",
                  borderTop:
                    isActive === "reset" ? "2px solid #000" : "2px solid #fff",
                }}
              >
                Reset Password
              </Box>
            </Stack>
            {isActive === "edit" ? <EditProfile /> : <ResetPassword />}
          </Paper>
        </Box>
      </Stack>
    </>
  );
};
