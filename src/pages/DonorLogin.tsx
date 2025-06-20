import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthAsideCarousel from "../components/AuthAsideCarousel";
import AuthFormWrapper from "../components/AuthFormWrapper";

const MOCK_IDENTIFIER = "donor1";
const MOCK_PASSWORD = "donorpass";

const DonorLogin: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.identifier || !form.password) {
      setError("Both fields are required.");
      return;
    }
    if (form.identifier === MOCK_IDENTIFIER && form.password === MOCK_PASSWORD) {
      navigate("/dashboard-d");
    } else {
      setError("Invalid credentials. Use the mock credentials below.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Aside with carousel */}
      <div className="hidden md:flex w-1/2 h-screen">
        <AuthAsideCarousel />
      </div>
      {/* Divider for large screens */}
      <div className="hidden md:block w-px bg-gray-200 h-screen" />
      {/* Main content */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <AuthFormWrapper title="Donor Login">
          <form onSubmit={handleSubmit} className="w-full">
            <label className="block mb-2 text-gray-700 font-medium">Email or Phone Number</label>
            <input type="text" name="identifier" className="w-full p-2 border rounded mb-4 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:scale-105 outline-none" required onChange={handleChange} value={form.identifier} />
            <label className="block mb-2 text-gray-700 font-medium">Password</label>
            <input type="password" name="password" className="w-full p-2 border rounded mb-4 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:scale-105 outline-none" required onChange={handleChange} value={form.password} />
            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center animate-pulse">{error}</div>}
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-semibold shadow transition-all duration-200 hover:bg-blue-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400">Login</button>
          </form>
          <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <div className="mb-1 font-semibold text-gray-700">Mock Donor Credentials:</div>
            <div>Email/Phone: <span className="font-mono">donor1</span></div>
          </div>
          <p className="mt-4 text-center text-sm">Don't have an account? <button className="text-blue-600 hover:underline" onClick={() => navigate("/donor-signup")}>Sign Up</button></p>
        </AuthFormWrapper>
      </div>
    </div>
  );
};

export default DonorLogin; 