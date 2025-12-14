import React from 'react';
import { Sparkles, ArrowRight, Zap, Check, Shield } from 'lucide-react';

interface IntroCardProps {
  onDismiss: () => void;
}

export const IntroCard: React.FC<IntroCardProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg overflow-hidden bg-[#181818] rounded-3xl shadow-2xl border border-white/10">
        
        {/* Decorative Background Blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="p-8 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-900/50">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Notely</span>
          </h2>
          
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Your premium, offline-first workspace. Sync seamlessly, write elegantly, and keep your thoughts organized like a pro.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-yellow-400" />
                </div>
                <span>Lightning fast offline mode</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                    <Shield className="w-3 h-3 text-blue-400" />
                </div>
                <span>Secure local-first storage</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                </div>
                <span>Seamless cloud synchronization</span>
            </div>
          </div>

          <button 
            onClick={onDismiss}
            className="w-full group relative flex items-center justify-center py-4 px-6 bg-white text-black font-bold rounded-full hover:scale-[1.02] transition-all duration-200 shadow-xl shadow-white/10"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};