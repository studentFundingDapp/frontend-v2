import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import AuthFooter from "./components/AuthFooter";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Donations from "./pages/Donations";
import Profile from "./pages/Profile";
import DashboardD from "./pages/DashboardD";
import Donate from "./pages/Donate";
import ExploreStudents from "./pages/ExploreStudents";
import DonorProfile from "./pages/DonorProfile";
import About from "./pages/About";
import StudentSignUp from "./pages/StudentSignUp";
import StudentLogin from "./pages/StudentLogin";
import DonorSignUp from "./pages/DonorSignUp";
import DonorLogin from "./pages/DonorLogin";
import RoleSelectionLanding from "./pages/RoleSelectionLanding";
import Loader from "./components/Loader";
import { LoaderProvider, useLoader } from "./context/LoaderContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LoaderProvider>
          <Router>
            <AppContent />
            <Toaster position="top-right" />
          </Router>
        </LoaderProvider>
      </ThemeProvider>
 </AuthProvider>
  );
}

function AppContent() {
  const { show, message } = useLoader();
  const location = useLocation();
  const { user } = useAuth();

  const authPages = ["/login", "/student-login", "/student-signup", "/donor-login", "/donor-signup"];
  const isAuthPage = authPages.includes(location.pathname);
  const isNotFound = ["/404", "/not-found", "*", "/404.html"].includes(location.pathname);

  // Determine role for NavBar
  let navRole = "default";
  if (user?.role === "donor") navRole = "donor";
  else if (user?.role === "student") navRole = "student";
  else if (user?.role === "admin") navRole = "admin";

  return (
    <>
      <Loader show={show} message={message} />
      <div className="flex flex-col min-h-screen">
        {!isNotFound && !isAuthPage && <NavBar role={navRole as import("./components/NavBar").NavBarRole} />}
        <div className="flex-grow">
          <div className="pt-16">
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
        </div>
        {!isNotFound && !isAuthPage && <Footer />}
        {isNotFound && <AuthFooter />}
      </div>
    </>
  );
}

export default App;
