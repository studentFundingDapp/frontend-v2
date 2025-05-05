import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Funders from "./pages/Funders";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Login from "./pages/Login";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/funders" element={<Funders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
    </Routes>
);

export default AppRoutes;
