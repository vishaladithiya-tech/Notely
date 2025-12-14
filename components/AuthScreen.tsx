import React, { useState } from 'react';
import { Mail, ArrowRight, Notebook, Activity, Lock } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, password?: string) => Promise<void>;
  loading: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    await onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-[#121212] border border-white/5 rounded-3xl shadow-2xl p-8 z-10 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-700 mb-6 shadow-lg shadow-green-900/50">
            <Notebook className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Notely</h1>
          <p className="text-gray-400">Your thoughts, synchronized.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Access</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-[#181818] border border-white/5 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Security Key</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-[#181818] border border-white/5 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all outline-none"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
                {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full flex items-center justify-center py-4 px-6 rounded-full font-bold text-base
              ${loading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
              }
              transition-all duration-300 transform active:scale-[0.98]
            `}
          >
            {loading ? (
              <Activity className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
                By continuing, you acknowledge this is an offline-first demo application.
            </p>
        </div>
      </div>
    </div>
  );
};