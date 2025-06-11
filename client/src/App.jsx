import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, CssBaseline, Typography, Paper, Alert } from "@mui/material";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import { useState, createContext } from "react";

export const ThemeContext = createContext();

function App() {
  const [isDarkThemed, setIsDarkThemed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Example auth state

  return (
    <Router>
      <ThemeContext.Provider value={isDarkThemed}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            background:
              "linear-gradient(to left,rgb(87, 175, 159),rgb(119, 132, 190))",
          }}
        >
          <Header />

          <Box>
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={<Login onLogin={() => setIsAuthenticated(true)} />}
              />

              <Route
                path="/register"
                element={<Register onRegister={() => {}} />}
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Redirect from root to login if not authenticated, or dashboard if authenticated */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Optional: 404 Not Found page */}
              <Route
                path="*"
                element={
                  <Paper
                    sx={{
                      p: 1,
                      width: 220,
                      mx: "auto",
                      mb: 5,
                      borderRadius: "4px",
                      backgroundColor: "red",
                    }}
                  >
                    <Alert variant="filled" severity="error">
                      404 - Page Not Found
                    </Alert>
                  </Paper>
                }
              />
            </Routes>
          </Box>
        </Box>
      </ThemeContext.Provider>
    </Router>
  );
}

export default App;
