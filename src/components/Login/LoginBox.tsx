import { Box, Typography } from "@mui/material";

function LoginBox() {
  return (
    <Box
      sx={{
        flex: "0 0 33.333333%",
        maxWidth: "33.333333%",
      }}
    >
      <Box id="login-wrapper">
        <Typography variant={"h4"} gutterBottom>
          Mam konto
        </Typography>
        <Box>
          {/* temp form */}
          <form>
            <Box>
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" name="email" />
            </Box>
            <Box>
              <label htmlFor="password">Hasło</label>
              <input type="password" id="password" name="password" />
            </Box>
            <Box>
              <button type="submit">Zaloguj</button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginBox;
