import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthAsideCarousel from "../components/AuthAsideCarousel";
import AuthFormWrapper from "../components/AuthFormWrapper";

const DonorSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    walletAddress: "",
    walletMode: "none", // 'none' | 'add'
  });
  const [error, setError] = useState<string | null>(null);
  const [showWallet, setShowWallet] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWalletMode = () => {
    setForm({ ...form, walletMode: "add", walletAddress: "" });
    setShowWallet(true);
    setError(null);
  };

  const handlePasteWallet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, walletAddress: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.phone || !form.password) {
      setError("All fields are required.");
      return;
    }
    // TODO: Submit to backend
    navigate("/donor-login");
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
        <AuthFormWrapper title="Donor Sign Up">
          <form onSubmit={handleSubmit} className="w-full">
            <label className="block mb-2 text-gray-700 font-medium">Email</label>
            <input type="email" name="email" className="w-full p-2 border rounded mb-4 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:scale-105 outline-none" required onChange={handleChange} value={form.email} />
            <label className="block mb-2 text-gray-700 font-medium">Phone Number</label>
            <input type="tel" name="phone" className="w-full p-2 border rounded mb-4 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:scale-105 outline-none" required onChange={handleChange} value={form.phone} />
            <label className="block mb-2 text-gray-700 font-medium">Password</label>
            <input type="password" name="password" className="w-full p-2 border rounded mb-4 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:scale-105 outline-none" required onChange={handleChange} value={form.password} />
            {/* Stellar Wallet Section */}
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Stellar Wallet (optional)</label>
              {!showWallet && (
                <button type="button" className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all duration-200 focus:scale-105" onClick={handleWalletMode}>Add Wallet</button>
              )}
              {showWallet && (
                <div className="mt-3">
                  <input type="text" name="walletAddress" placeholder="Stellar Public Key" className="w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:scale-105 outline-none" onChange={handlePasteWallet} value={form.walletAddress} />
                  <button type="button" className="mt-2 text-xs text-blue-600 underline" onClick={() => { setShowWallet(false); setForm(f => ({ ...f, walletMode: "none", walletAddress: "" })); }}>Remove Wallet</button>
                </div>
              )}
            </div>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center animate-pulse">{error}</div>}
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-semibold shadow transition-all duration-200 hover:bg-blue-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400">Sign Up</button>
          </form>
          <p className="mt-4 text-center text-sm">Already have an account? <button className="text-blue-600 hover:underline" onClick={() => navigate("/donor-login")}>Login</button></p>
        </AuthFormWrapper>
      </div>
    </div>
  );
};

export default DonorSignUp; 