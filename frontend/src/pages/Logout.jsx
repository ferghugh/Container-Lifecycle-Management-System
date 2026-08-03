import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
// Logout component that handles user logout by clearing authentication data 
// and redirecting to the login page.
function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}

export default Logout;
