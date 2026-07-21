import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/", { replace: true });
    }, [navigate]);

    return null;
}

export default Logout;