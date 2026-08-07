import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { removeToken } from "../../../utils/storage";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/", { replace: true });
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;