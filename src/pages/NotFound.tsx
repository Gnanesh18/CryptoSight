import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface NotFoundProps {
  isDark: boolean;
}

export default function NotFound({ isDark }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center animate-fade-in">
      <div className="relative mb-8">
        {/* Decorative elements */}
        <div className={cn(
          "absolute -inset-4 blur-2xl opacity-20 rounded-full",
          isDark ? "bg-brand-500" : "bg-brand-600"
        )} />
        
        <div className={cn(
          "relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-2 rotate-12 transition-transform hover:rotate-0 duration-500",
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-xl"
        )}>
          <AlertCircle className={cn(
            "w-12 h-12 sm:w-16 sm:h-16 -rotate-12 transition-transform duration-500",
            isDark ? "text-brand-400" : "text-brand-500"
          )} />
        </div>
        
        <div className="absolute -bottom-2 -right-2 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500 text-white shadow-lg border-4 border-gray-950">
          <span className="text-xs sm:text-sm font-bold">404</span>
        </div>
      </div>

      <h1 className={cn(
        "text-4xl sm:text-6xl font-black mb-4 tracking-tight",
        isDark ? "text-white" : "text-gray-900"
      )}>
        Lost in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Cyberspace?</span>
      </h1>
      
      <p className={cn(
        "text-lg sm:text-xl max-w-md mb-10 leading-relaxed",
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        The page you're looking for has been moved, deleted, or never existed in this blockchain.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <Link
          to="/"
          className={cn(
            "flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg",
            "bg-brand-500 text-white hover:bg-brand-600 hover:scale-105 active:scale-95 shadow-brand-500/25"
          )}
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className={cn(
            "flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all duration-200 border",
            isDark 
              ? "bg-white/5 border-white/10 text-white hover:bg-white/10" 
              : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm"
          )}
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>

      {/* Quick Search Tip */}
      <div className={cn(
        "mt-16 flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm",
        isDark ? "bg-white/3 border-white/5 text-gray-500" : "bg-gray-50 border-gray-200 text-gray-500"
      )}>
        <Search className="w-4 h-4" />
        <span>Try searching for a coin like "Bitcoin" or "Ethereum"</span>
      </div>
    </div>
  );
}
