import { Box, Tab, Tabs } from "@mui/material";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ResetPassword } from "../components/Settings/ResetPassword";
import { EditProfile } from "../components/Settings/EditProfile";
import { AppShell, PageHeader } from "../components/layout/AppShell";
import { SectionCard } from "../components/common/SectionCard";
import { usePageTitle } from "../hooks/usePageTitle";

export const Settings = () => {
  usePageTitle("Settings");
  const [isActive, setIsActive] = useState("edit");
  const { getUser } = useContext(AuthContext);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleActive = (val) => {
    setIsActive(val);
  };

  return (
    <AppShell width="wide">
      <PageHeader title="Settings" />
      <SectionCard sx={{ p: 0, overflow: "hidden" }}>
        <Tabs
          value={isActive}
          onChange={(e, val) => handleActive(val)}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Tab label="Edit profile" value="edit" />
          <Tab label="Reset password" value="reset" />
        </Tabs>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {isActive === "edit" ? <EditProfile /> : <ResetPassword />}
        </Box>
      </SectionCard>
    </AppShell>
  );
};
