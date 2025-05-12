import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  return (
    <ThemeProvider>
      <LoadingProvider>
        <Router>
          <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        </Router>
        <Toaster />
      </LoadingProvider>
    </ThemeProvider>
  );
}

function AppContent({
  isAuthenticated,
  setIsAuthenticated,
}: {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const location = useLocation(); // Get the current route

  // Define routes where AuthLayout2 and AuthFooter should be used
  const authRoutes = ["/login", "/register"];

  return (
    <div className="flex flex-col min-h-screen">
      {authRoutes.includes(location.pathname) ? (
        
          <Routes>
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/register" element={<Register />} />
          </Routes>
          
        
      ) : (
        <>
          <NavBar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route
                path="/dashboard"
                element={
                  //<ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dashboard />
                  //</ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
