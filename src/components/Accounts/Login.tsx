import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import RegisterForm from "./RegisterForm.tsx";
import LoginForm from "./LoginForm.tsx";

function Login() {
  const [tab, setTab] = useState<number>(0);

  const handleTabChange = (_: React.SyntheticEvent, tabNumber: number) => {
    setTab(tabNumber);
  };

  return (
    <Box id="main-wrapper">
      <Box
        className="main-container"
        sx={{
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box className={"main-container flex-col flex items-center"}>
          <Box>
            <img src="logo.png" alt="logo" className={"h-[120px]"} />
          </Box>
          <Box>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              aria-label={"login-nav"}
              centered
              sx={{ mb: "1em" }}
            >
              <Tab label={"Logowanie"} />
              <Tab label={"Nowe konto"} />
            </Tabs>
            <Box className={"flex justify-center flex-wrap"}>
              {tab === 0 ? <LoginForm /> : <RegisterForm setTab={setTab} />}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
