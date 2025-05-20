import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import AuthFooter from "./components/AuthFooter";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { Toaster } from "./components/ui/sonner";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeProvider";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./components/auth/AuthContext";
import Projects from "./pages/Projects"; // Ensure the file exists at this path
import Donations from "./pages/Donations";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";


// Removed PrivateRoute and authentication logic for deployment/demo
function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <Router>
          <AppContent />
          <Toaster position="top-right" />
        </Router>
      </LoadingProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isNotFound =
    location.pathname === "/404" ||
    location.pathname === "/not-found" ||
    location.pathname === "*" ||
    location.pathname === "/404.html";

  return (
    <div className="flex flex-col min-h-screen">
      {!isNotFound && <NavBar />}
      <div className="flex-grow">
        <Routes>
                  {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login setIsAuthenticated={() => {}} />} />
          <Route path="/register" element={<Register setIsAuthenticated={() => {}} />} />

          {/* Private Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/donations" element={<Donations />} />
            </>
          ) : (
            <>
              {/* If not authenticated, redirect protected paths to login */}
              <Route path="/dashboard" element={<Navigate to="/login" replace />} />
              <Route path="/projects" element={<Navigate to="/login" replace />} />
              <Route path="/about" element={<Navigate to="/login" replace />} />
              <Route path="/profile" element={<Navigate to="/login" replace />} />
              <Route path="/donations" element={<Navigate to="/login" replace />} />
            </>
          )}

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
 
      </div>
      {!isNotFound && <Footer />}
      {isNotFound && <AuthFooter />}
    </div>
  );
}

export default App;
