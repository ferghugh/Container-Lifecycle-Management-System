import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

// App component that serves as the root of the application, 
// rendering the routing structure defined in AppRoutes.
function App() {
  return <AppRoutes />;
}

export default App;
