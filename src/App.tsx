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
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import DashboardD from "./pages/DashboardD";
import DonorNavBar from "./components/DonorNavBar";
import Donate from "./pages/Donate";
import ExploreStudents from "./pages/ExploreStudents";
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
  const donorRoutes = ["/dashboard-d", "/donate", "/students"];
 const isDonorPage = donorRoutes.includes(location.pathname);

  const isNotFound =
    location.pathname === "/404" ||
    location.pathname === "/not-found" ||
    location.pathname === "*" ||
    location.pathname === "/404.html";

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

          {/* Authentication pages (commented out for production/demo) */}
          
          <Route path="/login" element={<Login setIsAuthenticated={() => {}} />} />
          <Route path="/register" element={<Register />} />
         

          {/* Default route: redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      {!isNotFound && (isDonorPage ? <DonorNavBar /> : <NavBar />)}
      {!isNotFound && <Footer />}
      {isNotFound && <AuthFooter />}
    </div>
  );
}

export default App;
