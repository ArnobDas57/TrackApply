import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Box, CssBaseline, Fade, Grow } from "@mui/material";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import { useState } from "react";

function App() {
  // using global state management to manage auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          alignContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(to left,rgb(87, 175, 159),rgb(119, 132, 190))",
        }}
      >
        <Header />

        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={() => setIsAuthenticated(true)} />}
          />
          <Route path="/register" element={<Register />} />{" "}
          {/* Add onRegister prop if needed */}
          {/* Protected route (Dashboard) */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
