import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Containers from "./pages/Containers";
import Approvals from "./pages/Approvals";
import Observations from "./pages/Observations";
import Reports from "./pages/Reports";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/containers" element={<Containers />} />

                <Route path="/approvals" element={<Approvals />} />

                <Route path="/observations" element={<Observations />} />

                <Route path="/reports" element={<Reports />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;