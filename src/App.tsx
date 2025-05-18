import { useEffect, useState, type JSX } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import AuthFooter from "./components/AuthFooter";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { Toaster } from "./components/ui/sonner";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeProvider";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Donations from "./pages/Donations";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Register from "./pages/Register";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  // Optional: redirect to dashboard if already logged in and visiting /login or /register
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <ThemeProvider>
      <LoadingProvider>
        <Router>
          <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <Toaster position="top-right" />
        </Router>
      </LoadingProvider>
    </ThemeProvider>
  );
}

function AppContent({ isAuthenticated, setIsAuthenticated }: { isAuthenticated: boolean; setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) {
  const location = useLocation();

  // Define authentication and not found routes
  const authRoutes = ["/login", "/register"];
  const isAuthOrNotFound =
    authRoutes.includes(location.pathname) ||
    location.pathname === "/404" ||
    location.pathname === "/not-found" ||
    location.pathname === "*" ||
    location.pathname === "/404.html";

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthOrNotFound && <NavBar />}
      <div className="flex-grow">
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register setIsAuthenticated={setIsAuthenticated} />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <Projects />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/donations"
            element={
              <PrivateRoute>
                <Donations />
              </PrivateRoute>
            }
          />
          {/* ...other protected routes... */}

          {/* Default route: redirect to login if not authenticated */}
          <Route
            path="*"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
      {!isAuthOrNotFound && <Footer />}
      {isAuthOrNotFound && <AuthFooter />}
    </div>
  );
}

export default App;
