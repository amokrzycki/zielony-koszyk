import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import RegisterForm from "./RegisterForm.tsx";
import LoginForm from "./LoginForm.tsx";
import { useMode } from "@/providers/ModeProvider.tsx";

function Login() {
  const query = new URLSearchParams(window.location.search);
  const [tab, setTab] = useState<number>(query.get("tab") === "1" ? 1 : 0);
  const { mode } = useMode();

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
            <img src={`/${mode}_logo.png`} alt="logo" className={"h-[120px]"} />
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
