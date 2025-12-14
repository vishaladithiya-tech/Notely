import React from 'react';
import { LogOut, Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userEmail: string;
  onLogout: () => void;
  syncStatus: 'idle' | 'syncing' | 'offline' | 'error' | 'synced';
  triggerSync: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, userEmail, onLogout, syncStatus, triggerSync }) => {
  const getSyncIndicator = () => {
    switch (syncStatus) {
      case 'syncing': 
        return (
            <div className="flex items-center space-x-2 text-blue-400 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium">Syncing</span>
            </div>
        );
      case 'offline': 
        return (
            <div className="flex items-center space-x-2 text-gray-500">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs font-medium">Offline</span>
            </div>
        );
      case 'error': 
        return (
            <div className="flex items-center space-x-2 text-red-500 cursor-pointer hover:underline" onClick={triggerSync}>
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-medium">Retry</span>
            </div>
        );
      case 'synced': 
        return (
            <div className="flex items-center space-x-2 text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium">Synced</span>
            </div>
        );
      default: 
        return (
            <div className="flex items-center space-x-2 text-gray-500">
               <span className="w-2 h-2 rounded-full bg-gray-500"></span>
               <span className="text-xs font-medium">Saved</span>
            </div>
        );
    }
  };

  return (
    <div className="relative flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-green-900/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Top Bar (Mobile) / Header Area for Desktop */}
      <div className="absolute top-4 right-6 z-20 flex items-center space-x-6">
        <div className="bg-black/40 border border-white/5 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center space-x-4">
            {getSyncIndicator()}
            <div className="w-px h-4 bg-white/10"></div>
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {userEmail[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-gray-300 hidden sm:inline">{userEmail}</span>
            </div>
            <button 
                onClick={onLogout}
                className="text-gray-400 hover:text-white transition-colors"
                title="Logout"
            >
                <LogOut className="w-4 h-4" />
            </button>
        </div>
      </div>

      <main className="relative z-10 flex-1 flex w-full h-full pt-4 pb-4 pl-4 pr-4 gap-4">
        {children}
      </main>
    </div>
  );
};