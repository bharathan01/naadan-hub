import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement admin authentication logic
    console.log('Admin login:', formData);
    // navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="ri-shield-user-line text-3xl text-white"></i>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Secure access for administrators</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-admin-line text-gray-400 text-lg"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors text-sm text-white placeholder-gray-400"
                  placeholder="admin@naadanhub.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-lock-password-line text-gray-400 text-lg"></i>
                </div>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors text-sm text-white placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <Link to="/admin-forgot-password" className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 cursor-pointer">
                Forgot Password?
              </Link>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex gap-3">
                <i className="ri-shield-check-line text-yellow-400 text-xl flex-shrink-0"></i>
                <div>
                  <p className="text-sm text-yellow-200 font-semibold mb-1">Secure Connection</p>
                  <p className="text-xs text-gray-400">Your credentials are encrypted and protected</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all cursor-pointer whitespace-nowrap shadow-lg"
            >
              <i className="ri-login-box-line mr-2"></i>
              Access Admin Panel
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-gray-400 mb-3">
              <i className="ri-information-line mr-1"></i>
              Authorized personnel only
            </p>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="flex-1 text-center py-2 px-4 border-2 border-white/20 rounded-lg text-sm font-semibold text-gray-300 hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
              >
                User Login
              </Link>
              <Link
                to="/seller-login"
                className="flex-1 text-center py-2 px-4 border-2 border-white/20 rounded-lg text-sm font-semibold text-gray-300 hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
              >
                Seller Login
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-white cursor-pointer">
            <i className="ri-arrow-left-line mr-1"></i>
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}