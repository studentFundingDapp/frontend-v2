import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthAsideCarousel from "../components/AuthAsideCarousel";
import AuthFormWrapper from "../components/AuthFormWrapper";
import { useAuth } from "../context/AuthContext";

const MOCK_USERNAME = "student1";
const MOCK_PASSWORD = "newpass456";

const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.username || !form.password) {
      setError("Both fields are required.");
      return;
    }
    if (form.username === MOCK_USERNAME && form.password === MOCK_PASSWORD) {
      login("mockPublicKey", "mockNetwork", "student");
      navigate("/dashboard");
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
        <AuthFormWrapper title="Student Login">
          <form onSubmit={handleSubmit} className="w-full">
            <label className="block mb-2 text-gray-700 font-medium">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-2 border rounded mb-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 focus:scale-105 outline-none"
              required
              onChange={handleChange}
              value={form.username}
            />
            <label className="block mb-2 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded mb-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 focus:scale-105 outline-none"
              required
              onChange={handleChange}
              value={form.password}
            />
            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center animate-pulse">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded font-semibold shadow transition-all duration-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <div className="mb-1 font-semibold text-gray-700">Mock Student Credentials:</div>
            <div>Username: <span className="font-mono">student1</span></div>
          </div>
          <p className="mt-4 text-center text-sm">Don't have an account? <button className="text-indigo-600 hover:underline" onClick={() => navigate("/student-signup")}>Sign Up</button></p>
        </AuthFormWrapper>
      </div>
    </div>
  );
};

export default StudentLogin; 