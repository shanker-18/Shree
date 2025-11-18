import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, UserCheck, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name.trim()) { setError('Full name is required'); setLoading(false); return; }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Please enter a valid email address'); setLoading(false); return; }
    if (!formData.phone.trim() || formData.phone.length < 10) { setError('Please enter a valid phone number'); setLoading(false); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters long'); setLoading(false); return; }

    try {
      const result = await register(
        formData.email,
        formData.password,
        {
          name: formData.name,
          phone: formData.phone
        }
      );

      if (!result.success) {
        setError(result.error || 'Registration failed. Please try again.');
      } else {
        // Send verification email to the new user
        if (auth.currentUser) {
          try {
            await sendEmailVerification(auth.currentUser);
            console.log('Verification email sent successfully');
          } catch (verifyError) {
            console.error('Error sending verification email:', verifyError);
          }
        }
        
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
              // No pending product, redirect to categories page
              navigate('/#categories');
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Account Created!</h1>
            <p className="text-gray-600 mb-6">Redirecting you to complete your order...</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Create Account</h2>
              <p className="text-gray-600 text-lg">Join our premium community for exclusive offers</p>
            </div>
          </div>

          {/* Register Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-400" placeholder="Enter your full name" />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-400" placeholder="Enter your email" />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-3">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-400" placeholder="Enter your phone number" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-3">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} required className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-400" placeholder="Create a secure password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-3">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange} required className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-400" placeholder="Confirm your password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Create Account
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
              <p className="text-gray-600 mb-4">Already have an account?</p>
              <Link to="/login" className="inline-flex items-center justify-center w-full bg-white border-2 border-gray-200 text-gray-800 font-medium py-4 px-6 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105 transform">
                <UserCheck className="h-4 w-4 mr-2" />
                Sign In to Your Account
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
