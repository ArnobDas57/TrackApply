import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Box,
  CssBaseline,
  Typography,
  Paper,
  Alert,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useEffect, useState, createContext, useMemo } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import ForgotPassword from "./pages/ForgotPassword";

export const ThemeContext = createContext();
export const AuthContext = createContext();

function App() {
  const [mode, setMode] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "rgb(51, 117, 222)" : "#rgb(5, 13, 26)",
          },
          secondary: {
            main: mode === "light" ? "rgb(87, 175, 159)" : "#rgb(30, 222, 132)",
          },
          background: {
            default: mode === "light" ? "rgb(240, 242, 245)" : "#121212",
            paper: mode === "light" ? "rgb(255, 255, 255)" : "#1e1e1e",
          },
        },
        typography: {
          fontFamily: "Roboto, sans-serif",
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                // Dynamic background based on theme mode
                background:
                  mode === "light"
                    ? "linear-gradient(to right, rgb(87, 175, 159), rgb(119, 132, 190))"
                    : "linear-gradient(to right, #2c3e50, #34495e)", // Darker gradient for dark mode
              },
            },
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsAuthenticated(true);
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        setUsername(null);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    if (userData && userData.username) {
      setUsername(userData.username);
      localStorage.setItem("username", userData.username);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <Router>
      <ThemeContext.Provider value={{ mode, toggleColorMode }}>
        <AuthContext.Provider
          value={{ isAuthenticated, username, handleLogin, handleLogout }}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                background:
                  theme.palette.mode === "light"
                    ? "linear-gradient(to left,rgb(87, 175, 159),rgb(119, 132, 190))"
                    : theme.palette.background.paper,
              }}
            >
              <Header />

              <Box sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

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

                  <Route
                    path="*"
                    element={
                      <Box
                        sx={{
                          p: 2,
                          width: 250,
                          mx: "auto",
                          mt: 5,
                          borderRadius: "4px",
                          backgroundColor: theme.palette.background.paper,
                          textAlign: "center",
                        }}
                      >
                        <Alert variant="filled" severity="error">
                          404 - Page Not Found
                        </Alert>
                      </Box>
                    }
                  />
                </Routes>
              </Box>
            </Box>
          </ThemeProvider>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </Router>
  );
}

export default App;
