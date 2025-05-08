import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import { Toaster } from './components/ui/toaster';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeProvider';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import NavBar from './components/NavBar';

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <Router>
        <NavBar />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
            
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
        <Toaster />
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
