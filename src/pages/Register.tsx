// src/pages/Register.tsx

import React, { useState} from 'react';
import  type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WalletAuth } from '../components/auth/WalletAuth';
import { useAuth } from '../components/auth/AuthContext';
import { studentAPI } from '../services/api';

const Register: React.FC = () => {
  const { isAuthenticated, publicKey } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    studyField: '',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!publicKey) {
      setError('Please connect your Stellar wallet first.');
      return;
    }

    if (!isAuthenticated) {
      setError('Please authenticate with your wallet before creating a profile.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await studentAPI.createProfile({
        ...formData,
        wallet_address: publicKey,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Create Student Profile
        </h1>
        <p className="text-sm text-center text-gray-500 mt-1">
          Receive funding by showcasing your educational goals and background.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4">
            {error}
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Connect Your Stellar Wallet
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            This wallet address will be used to receive donations.
          </p>
          <WalletAuth />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
              Educational Institution
            </label>
            <input
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="studyField" className="block text-sm font-medium text-gray-700">
              Field of Study
            </label>
            <input
              id="studyField"
              name="studyField"
              value={formData.studyField}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio (Tell donors about yourself)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !publicKey || !isAuthenticated}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have a profile?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
