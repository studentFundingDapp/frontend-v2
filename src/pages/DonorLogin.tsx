import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthAsideCarousel from "../components/AuthAsideCarousel";

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
      {/* Main content */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Donor Login</h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-gray-700">Email or Phone Number</label>
            <input type="text" name="identifier" className="w-full p-2 border rounded mb-4" required onChange={handleChange} value={form.identifier} />
            <label className="block mb-2 text-gray-700">Password</label>
            <input type="password" name="password" className="w-full p-2 border rounded mb-4" required onChange={handleChange} value={form.password} />
            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center">{error}</div>}
            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold">Login</button>
          </form>
          <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <div className="mb-1 font-semibold text-gray-700">Mock Donor Credentials:</div>
            <div>Email/Phone: <span className="font-mono">donor1</span></div>
          </div>
          <p className="mt-4 text-center text-sm">Don't have an account? <button className="text-indigo-600 hover:underline" onClick={() => navigate("/donor-signup")}>Sign Up</button></p>
        </div>
      </div>
    </div>
  );
};

export default DonorLogin; 