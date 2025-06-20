import React from "react";
import { useNavigate } from "react-router-dom";
import AuthAsideCarousel from "../components/AuthAsideCarousel";

const RoleSelectionLanding: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Aside with carousel */}
      <div className="hidden md:flex w-1/2 h-screen">
        <AuthAsideCarousel />
      </div>
      {/* Main content */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8">Welcome to DSFS</h1>
        <p className="mb-8 text-gray-600">Select your role to continue</p>
        <div className="flex flex-row gap-4 w-full max-w-xs">
          <button
            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            onClick={() => navigate("/student-login")}
          >
            Student
          </button>
          <button
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
            onClick={() => navigate("/donor-login")}
          >
            Donor
          </button>
          <button
            className="flex-1 py-3 bg-gray-300 text-gray-500 rounded-lg text-lg font-semibold cursor-not-allowed"
            disabled
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionLanding; 