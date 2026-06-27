'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock authentication - in production this would call an API
    if (username === 'manager' && password === 'admin123') {
      // Store auth state (in production, use proper session/auth)
      document.cookie = "adminAuth=true; path=/; max-age=31536000; SameSite=Lax";
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#B91C1C] to-[#991B1B] flex items-center justify-center p-4 sm:p-6 w-full">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-lg bg-[#B91C1C] flex items-center justify-center text-white font-bold text-3xl">
              CQ
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-[#1A1A1A] mb-2">Admin Login</h1>
          <p className="text-center text-[#6B7280] mb-8">Crisp Quick Management</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent bg-white text-[#1A1A1A]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent bg-white text-[#1A1A1A]"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}



            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
