import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import AuthFooter from "./components/AuthFooter";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { Toaster } from "./components/ui/sonner";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
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

  const donorRoutes = ["/dashboard-d", "/donate", "/students","/about", "/profile-d"];
 const isDonorPage = donorRoutes.includes(location.pathname);

  const { isAuthenticated } = useAuth();

  console.log("AppContent rendering. Authenticated:", isAuthenticated); 


  const isNotFound = ["/404", "/not-found", "*", "/404.html"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isNotFound &&(isDonorPage ? <DonorNavBar/> : <NavBar />)}
      <div className="flex-grow">
        <Routes>

          {/* Direct access to all main pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/dashboard-d" element={<DashboardD />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/students" element={<ExploreStudents />} />
          <Route path="/profile-d" element={<DonorProfile />} />

          <Route path="/login" element={<Login />} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />


          {/* Private Routes */}
          {/* {isAuthenticated ? (
            <> */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/donations" element={<Donations />} />
            {/* </> */}
          {/* ) : ( */}
            <>
              {/* If not authenticated, redirect protected paths to login */}
              {/* <Route path="/dashboard" element={<Navigate to="/login" replace />} />
              {/* Redirect unauthenticated users to login */}
              <Route path="/dashboard" element={<Navigate to="/login" replace />} />
              <Route path="/projects" element={<Navigate to="/login" replace />} />
              <Route path="/about" element={<Navigate to="/login" replace />} />
              <Route path="/profile" element={<Navigate to="/login" replace />} />
              <Route path="/donations" element={<Navigate to="/login" replace />} /> 
            </> 
          {/* )} */}

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
      {!isNotFound && (isDonorPage ? <DonorNavBar /> : <NavBar />)}
      {!isNotFound && <Footer />}
      {isNotFound && <AuthFooter />}
    </div>
  );
}

export default App;
