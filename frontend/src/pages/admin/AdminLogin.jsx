import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(form.email, form.password);
      if (data.user.role !== 'admin') {
        setError('Admin access required.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center px-6">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#F2B12D 1px, transparent 1px), linear-gradient(90deg, #F2B12D 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-block border border-gold-500/30 p-5 mb-4 bg-dark-700">
            <img src={logo} alt="Lucky's Home" style={{ height: 120, width: "auto", objectFit: "contain", display: "block" }} />
          </div>
          <p className="text-gray-500 text-xs uppercase tracking-[4px]">Admin Panel</p>
        </div>

        <div className="bg-dark-700 border border-dark-500 p-8 shadow-2xl">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to manage your properties and enquiries.</p>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-400 block mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                required
                placeholder="admin@luckys-home.com"
                className="w-full bg-dark-600 border border-dark-400 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold-500 placeholder-gray-600 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-400 block mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                required
                placeholder="••••••••"
                className="w-full bg-dark-600 border border-dark-400 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold-500 placeholder-gray-600 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-600 text-dark-800 font-bold py-3.5 uppercase tracking-widest text-sm transition-all duration-300 disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-500">
            <p className="text-gray-600 text-xs text-center">
              Default: admin@luckys-home.com / Admin@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
