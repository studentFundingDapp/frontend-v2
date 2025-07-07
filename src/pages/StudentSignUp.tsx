import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthAsideCarousel from "../components/AuthAsideCarousel";
import { useToast } from "../hooks/use-toast";
import FloatingLabelInput from "../components/ui/floating-label-input";
import AuthFormWrapper from "../components/AuthFormWrapper";
import { motion } from "framer-motion";
import { XCircle, CheckCircle, ArrowLeft } from "lucide-react";

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
  const { toast } = useToast();
  const [shake, setShake] = useState(false);

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
    if (!form.email || !form.phone || !form.username || !form.password || !form.walletAddress) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => {
        toast({
          title: "Sign up failed!",
          description: "Please fill in all required fields.",
          variant: "destructive",
          icon: <motion.span initial={{ x: -30, rotate: -20, scale: 0 }} animate={{ x: 0, rotate: 0, scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }}><XCircle className="text-red-500" /></motion.span>
        });
      }, 800);
      return;
    }
    setTimeout(() => {
      toast({
        title: "Sign up successful!",
        description: "Welcome to DSFS.",
        variant: "default",
        icon: <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }}><CheckCircle className="text-green-500" /></motion.span>
      });
    }, 1500);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-400 dark:from-gray-950 dark:via-indigo-950 dark:to-blue-900 overflow-hidden">
      {/* Aside with carousel */}
      <div className="hidden md:flex w-1/2 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
        <AuthAsideCarousel />
      </div>
      {/* Main content */}
      <div className={`flex flex-col justify-center items-center w-full md:w-1/2 h-full relative flex-1 bg-white/80 dark:bg-gray-900/80 ${shake ? 'animate-shake' : ''}`}>
        <motion.button
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => navigate("/role-selection")}
          aria-label="Back to Choose Role"
        >
          <ArrowLeft className="h-5 w-5 text-indigo-600" />
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 bg-white/95 dark:bg-gray-900/95 border border-gray-100 dark:border-gray-800 flex flex-col items-center overflow-y-auto"
          style={{ maxHeight: '92vh' }}
        >
          <AuthFormWrapper title="Student Sign Up">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FloatingLabelInput label="Email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Enter your email" />
              <FloatingLabelInput label="Phone Number" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="Enter your phone number" />
              <FloatingLabelInput label="Username" name="username" type="text" required value={form.username} onChange={handleChange} placeholder="Choose a username" />
              <FloatingLabelInput label="Password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Create a password" />

              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
                  Stellar Wallet <span className="text-red-500">*</span>
                </label>
                {!showWallet && (
                  <div className="flex gap-2">
                    <button type="button" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition" onClick={() => handleWalletMode("generate")}>Generate New</button>
                    <button type="button" className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition" onClick={() => handleWalletMode("paste")}>Paste Existing</button>
                  </div>
                )}
                {showWallet && form.walletMode === "generate" && generated && (
                  <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                    <div className="mb-2 text-xs text-gray-600 dark:text-gray-300">Public Key:</div>
                    <div className="font-mono text-xs break-all mb-2">{generated.publicKey}</div>
                    <div className="mb-2 text-xs text-gray-600 dark:text-gray-300">Secret Key (save this!):</div>
                    <div className="font-mono text-xs break-all mb-2">{generated.secret}</div>
                    <div className="text-xs text-red-500 mb-2">Keep your secret key safe. Never share it.</div>
                  </div>
                )}
                {showWallet && form.walletMode === "paste" && (
                  <div className="mt-3">
                    <input type="text" name="walletAddress" placeholder="Stellar Public Key" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" required onChange={handlePasteWallet} value={form.walletAddress} />
                  </div>
                )}
                {showWallet && (
                  <button type="button" className="mt-2 text-xs text-indigo-600 underline" onClick={() => { setShowWallet(false); setForm(f => ({ ...f, walletMode: "none", walletAddress: "", walletSecret: "" })); setGenerated(null); }}>Change Wallet Option</button>
                )}
              </div>

              {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center">{error}</div>}

              <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg transition">Sign Up</button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
              Already have an account?{" "}
              <button className="text-indigo-600 hover:underline font-semibold" onClick={() => navigate("/student-login")}>Login</button>
            </p>
          </AuthFormWrapper>
          <div className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center w-full">Powered by DSFS</div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentSignUp;