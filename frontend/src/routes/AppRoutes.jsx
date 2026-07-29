import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Dashboard from "../pages/Dashboard";
import Containers from "../pages/Containers";
import Approvals from "../pages/Approvals";
import Analytics from "../pages/Analytics";
import ContainerDetails from "../pages/ContainerDetails";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import QuickScan from "../pages/QuickScan";



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/logout" element={<Logout />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/containers" element={<Containers />} />

            <Route path="/approvals" element={<Approvals />} />

            <Route path="/analytics" element={<Analytics />} />

            <Route path="/containers/:id" element={<ContainerDetails />} />

            <Route path="/quick-scan" element={<QuickScan />} />

           

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
