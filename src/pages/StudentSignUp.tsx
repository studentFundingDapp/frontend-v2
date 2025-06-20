import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthAsideCarousel from "../components/AuthAsideCarousel";

const generateStellarKeypair = () => {
  // Placeholder: Replace with real keypair generation logic
  return {
    publicKey: "G...NEWKEY...",
    secret: "S...SECRET..."
  };
};

const StudentSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
    walletAddress: "",
    walletSecret: "",
    walletMode: "none", // 'none' | 'generate' | 'paste'
  });
  const [error, setError] = useState<string | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [generated, setGenerated] = useState<{publicKey: string, secret: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWalletMode = (mode: "generate" | "paste") => {
    setForm({ ...form, walletMode: mode, walletAddress: "", walletSecret: "" });
    setError(null);
    setGenerated(null);
    setShowWallet(true);
    if (mode === "generate") {
      const kp = generateStellarKeypair();
      setGenerated(kp);
      setForm(f => ({ ...f, walletAddress: kp.publicKey, walletSecret: kp.secret }));
    }
  };

  const handlePasteWallet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, walletAddress: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.phone || !form.username || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (!form.walletAddress) {
      setError("Stellar wallet is required.");
      return;
    }
    // TODO: Submit to backend
    navigate("/login");
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
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Student Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-gray-700">Email</label>
            <input type="email" name="email" className="w-full p-2 border rounded mb-4" required onChange={handleChange} value={form.email} />

            <label className="block mb-2 text-gray-700">Phone Number</label>
            <input type="tel" name="phone" className="w-full p-2 border rounded mb-4" required onChange={handleChange} value={form.phone} />

            <label className="block mb-2 text-gray-700">Username</label>
            <input type="text" name="username" className="w-full p-2 border rounded mb-4" required onChange={handleChange} value={form.username} />

            <label className="block mb-2 text-gray-700">Password</label>
            <input type="password" name="password" className="w-full p-2 border rounded mb-4" required onChange={handleChange} value={form.password} />

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Stellar Wallet <span className="text-red-500">*</span></label>
              {!showWallet && (
                <div className="flex gap-2">
                  <button type="button" className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={() => handleWalletMode("generate")}>Generate New</button>
                  <button type="button" className="flex-1 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={() => handleWalletMode("paste")}>Paste Existing</button>
                </div>
              )}
              {showWallet && form.walletMode === "generate" && generated && (
                <div className="mt-3 bg-indigo-50 p-3 rounded">
                  <div className="mb-2 text-xs text-gray-600">Public Key:</div>
                  <div className="font-mono text-xs break-all mb-2">{generated.publicKey}</div>
                  <div className="mb-2 text-xs text-gray-600">Secret Key (save this!):</div>
                  <div className="font-mono text-xs break-all mb-2">{generated.secret}</div>
                  <div className="text-xs text-red-500 mb-2">Keep your secret key safe. Never share it.</div>
                </div>
              )}
              {showWallet && form.walletMode === "paste" && (
                <div className="mt-3">
                  <input type="text" name="walletAddress" placeholder="Stellar Public Key" className="w-full p-2 border rounded" required onChange={handlePasteWallet} value={form.walletAddress} />
                </div>
              )}
              {showWallet && (
                <button type="button" className="mt-2 text-xs text-indigo-600 underline" onClick={() => { setShowWallet(false); setForm(f => ({ ...f, walletMode: "none", walletAddress: "", walletSecret: "" })); setGenerated(null); }}>Change Wallet Option</button>
              )}
            </div>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center">{error}</div>}

            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold">Sign Up</button>
          </form>
          <p className="mt-4 text-center text-sm">Already have an account? <button className="text-indigo-600 hover:underline" onClick={() => navigate("/student-login")}>Login</button></p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUp; 