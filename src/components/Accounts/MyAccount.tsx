import { useAppDispatch } from "../../hooks/hooks.ts";
import { logoutUser } from "./accountSlice.ts";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function MyAccount() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div>
      <h1>My Account</h1>
      <p>Welcome to your account page!</p>
      <Button onClick={handleLogout}>Wyloguj się</Button>
    </div>
  );
}

export default MyAccount;
