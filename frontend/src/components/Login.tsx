import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, UserPlus, LogIn, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed. Please check your credentials.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          const productInfo = localStorage.getItem('pendingProduct');
          if (productInfo) {
            try {
              const product = JSON.parse(productInfo);
              const redirectState = {
                isAuthenticated: true,
                productName: product.name,
                category: product.category,
                price: product.price
              };
              localStorage.removeItem('pendingProduct');
              navigate('/order-details', { state: redirectState });
            } catch (error) {
              console.error('Error parsing pending product:', error);
              navigate('/');
            }
          } else {
            // No pending product, redirect to home page
            navigate('/');
          }
        }, 1200);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
            <p className="text-gray-600 mb-6">{localStorage.getItem('pendingProduct') ? 'Redirecting you to complete your order...' : 'Redirecting you to home page...'}</p>
            <div className="animate-pulse">
              <div className="h-2 bg-emerald-200 rounded-full mb-2"></div>
              <div className="h-2 bg-emerald-200 rounded-full w-3/4 mx-auto"></div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-amber-50"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-red-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
      </div>
      <div className="hidden"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <img src="/logo.png" alt="Shree Raaga SWAAD GHAR" className="h-16 w-16 rounded-full object-cover shadow-lg" />
                <div className="ml-4 text-left">
                  <h1 className="text-2xl font-bold text-gray-800">Shree Raaga</h1>
                  <p className="text-sm text-gray-600">SWAAD GHAR</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h2>
              <p className="text-gray-600 text-lg">Sign in to your premium account</p>
            </div>
          </div>

          {/* Login Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                  <input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} required className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-400" placeholder="Enter your email" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-3">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} required className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-400" placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">{error}</motion.div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-red-700 hover:to-amber-700 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-2xl transform hover:scale-105 flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In to Your Account
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Don't have an account?</p>
              <Link to="/register" className="inline-flex items-center justify-center w-full bg-white border-2 border-gray-200 text-gray-800 font-medium py-4 px-6 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105 transform">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Premium Account
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
