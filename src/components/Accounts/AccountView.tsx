import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import MyAccount from "./MyAccount.tsx";

function AccountView() {
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
        <Box className="main-container" sx={{ mt: 0 }}>
          <Box>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              aria-label={"login-nav"}
              centered
              sx={{ mb: "1em" }}
            >
              <Tab label={"Twoje konto"} />
              <Tab label={"Zamówienia"} />
            </Tabs>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {tab === 0 ? <MyAccount /> : <h1>Zamowienia ez</h1>}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AccountView;
