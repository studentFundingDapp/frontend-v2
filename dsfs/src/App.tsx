// src/App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home";
import Donate from "./pages/Donate";
import StudentRegister from "./pages/StudentRegister";
import AdminDashboard from "./pages/AdminDashboard";
import SuccessPage from "./pages/SuccessPage";

import Loader from "./components/Loader";
import { useLoading } from "./context/LoadingContext";

const App: React.FC = () => {
  const location = useLocation();
  const { loading } = useLoading();

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/register" element={<StudentRegister />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </AnimatePresence>
      )}
    </>
  );
};

export default App;
