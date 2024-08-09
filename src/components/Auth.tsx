import React, { useState } from 'react';
import { login, logout } from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully!');
  };

  return (
    <div className="bg-[#f8f5f1] min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-800">Login</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded-full border-2 border-green-800 focus:outline-none focus:ring-2 focus:ring-green-800"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded-full border-2 border-green-800 focus:outline-none focus:ring-2 focus:ring-green-800"
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleLogout}
          className="w-full mt-4 py-2 border border-green-800 text-green-800 rounded-full hover:bg-green-800 hover:text-white transition"
        >
          Logout
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Auth;