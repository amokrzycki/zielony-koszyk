import PersonIcon from "@mui/icons-material/Person";
import { Button, Menu, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks.ts";
import { RootState } from "../../store/store.ts";
import { AccountState } from "../../reducers/accountReducers.ts";
import React, { useState } from "react";
import { logoutUser } from "./accountSlice.ts";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function UserBadge() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const auth = useAppSelector((state: RootState): AccountState => state.auth);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (auth.token) {
      setAnchorEl(e.currentTarget);
    }
    if (!auth.token) {
      navigate("/login");
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLLIElement>) => {
    setAnchorEl(null);
    if (e.currentTarget.dataset.route) {
      navigate(e.currentTarget.dataset.route);
    }
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logoutUser());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Zostałeś wylogowany");
    navigate("/");
  };

  return (
    <>
      <Button
        id="user-button"
        size={"large"}
        startIcon={<PersonIcon />}
        aria-controls={auth.token ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "text.primary" }}
      >
        {auth.token ? `Witaj ${auth.user.first_name}!` : ""}
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "user-button",
        }}
      >
        <MenuItem onClick={handleClose} data-route="/konto">
          Profil
        </MenuItem>
        <MenuItem onClick={handleClose} data-route="/konto/zamowienia">
          Zamówienia
        </MenuItem>
        <MenuItem onClick={handleLogout}>Wyloguj się</MenuItem>
      </Menu>
    </>
  );
}

export default UserBadge;
