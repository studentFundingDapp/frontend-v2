import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import AuthFooter from "./components/AuthFooter";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { Toaster } from "./components/ui/sonner";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Donations from "./pages/Donations";
import Profile from "./pages/Profile";
import DashboardD from "./pages/DashboardD";
import DonorNavBar from "./components/DonorNavBar";
import Donate from "./pages/Donate";
import ExploreStudents from "./pages/ExploreStudents";
import DonorProfile from "./pages/DonorProfile";
import About from "./pages/About";
import StudentSignUp from "./pages/StudentSignUp";
import StudentLogin from "./pages/StudentLogin";
import DonorSignUp from "./pages/DonorSignUp";
import DonorLogin from "./pages/DonorLogin";
import RoleSelectionLanding from "./pages/RoleSelectionLanding";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LoadingProvider>
          <Router>
            <AppContent />
            <Toaster position="top-right" />
          </Router>
        </LoadingProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();

  const authPages = ["/login", "/student-login", "/student-signup", "/donor-login", "/donor-signup"];
  const donorRoutes = ["/dashboard-d", "/donate", "/students", "/about", "/profile-d"];
  const isDonorPage = donorRoutes.includes(location.pathname);
  const isAuthPage = authPages.includes(location.pathname);

  const isNotFound = ["/404", "/not-found", "*", "/404.html"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isNotFound && !isAuthPage && (isDonorPage ? <DonorNavBar /> : <NavBar />)}
      <div className="flex-grow">
        <Routes>
          {/* Auth & Role Selection */}
          <Route path="/login" element={<RoleSelectionLanding />} />
          <Route path="/student-signup" element={<StudentSignUp />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/donor-signup" element={<DonorSignUp />} />
          <Route path="/donor-login" element={<DonorLogin />} />

          {/* Public Routes */}
          <Route path="/about" element={<About />} />

          {/* Donor Routes (no auth protection, add if needed) */}
          <Route path="/dashboard-d" element={<DashboardD />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/students" element={<ExploreStudents />} />
          <Route path="/profile-d" element={<DonorProfile />} />

          {/* Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/donations" element={<PrivateRoute><Donations /></PrivateRoute>} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
      {!isNotFound && !isAuthPage && <Footer />}
      {isNotFound && <AuthFooter />}
    </div>
  );
}

export default App;
