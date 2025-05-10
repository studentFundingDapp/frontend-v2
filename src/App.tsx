import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import { Toaster } from './components/ui/toaster';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeProvider';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from "./pages/Register";
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider>
      <LoadingProvider>
        <Router>
          
          <div className="flex flex-col min-h-screen">
               {isAuthenticated && <NavBar />}
            <div className="flex-grow">
              <Routes>
               
                <Route path="/" element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
               {isAuthenticated && <Footer />}
            <Footer />
          </div>
        </Router>
        <Toaster />
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
