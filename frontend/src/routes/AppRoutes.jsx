import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Login from "../pages/Login";
import Logout from "../pages/Logout";

import Dashboard from "../pages/Dashboard";
import Containers from "../pages/Containers";
import Approvals from "../pages/Approvals";
import Observations from "../pages/Observations";
import Reports from "../pages/Reports";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

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

                        <Route path="/observations" element={<Observations />} />

                        <Route path="/reports" element={<Reports />} />

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>

    );

};

export default AppRoutes;