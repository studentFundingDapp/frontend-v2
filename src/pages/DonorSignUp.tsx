import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthAsideCarousel from "../components/AuthAsideCarousel";

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
      {/* Main content */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Donor Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-gray-700">Email</label>
            <input type="email" name="email" className="w-full p-2 border rounded mb-4" required onChange={handleChange} value={form.email} />

            <label className="block mb-2 text-gray-700">Phone Number</label>
            <input type="tel" name="phone" className="w-full p-2 border rounded mb-4" required onChange={handleChange} value={form.phone} />

            <label className="block mb-2 text-gray-700">Password</label>
            <input type="password" name="password" className="w-full p-2 border rounded mb-4" required onChange={handleChange} value={form.password} />

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Stellar Wallet (optional)</label>
              {!showWallet && (
                <button type="button" className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={handleWalletMode}>Add Wallet</button>
              )}
              {showWallet && (
                <div className="mt-3">
                  <input type="text" name="walletAddress" placeholder="Stellar Public Key" className="w-full p-2 border rounded" onChange={handlePasteWallet} value={form.walletAddress} />
                  <button type="button" className="mt-2 text-xs text-indigo-600 underline" onClick={() => { setShowWallet(false); setForm(f => ({ ...f, walletMode: "none", walletAddress: "" })); }}>Remove Wallet</button>
                </div>
              )}
            </div>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center">{error}</div>}

            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold">Sign Up</button>
          </form>
          <p className="mt-4 text-center text-sm">Already have an account? <button className="text-indigo-600 hover:underline" onClick={() => navigate("/donor-login")}>Login</button></p>
        </div>
      </div>
    </div>
  );
};

export default DonorSignUp; 