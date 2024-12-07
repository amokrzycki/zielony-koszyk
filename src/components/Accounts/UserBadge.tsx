import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";
import { useAppSelector } from "../../hooks/hooks.ts";
import { RootState } from "../../store/store.ts";
import { AccountState } from "../../reducers/accountReducers.ts";

function UserBadge() {
  const auth = useAppSelector((state: RootState): AccountState => state.auth);

  const handleClick = () => {
    if (auth.token) {
      window.location.href = "/konto";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <IconButton onClick={handleClick}>
      <PersonIcon />
    </IconButton>
  );
}

export default UserBadge;
