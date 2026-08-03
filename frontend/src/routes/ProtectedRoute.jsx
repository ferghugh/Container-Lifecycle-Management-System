import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
// ProtectedRoute component that checks if the user is authenticated before allowing access to protected routes.
const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
