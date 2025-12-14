import React from 'react';
import { motion } from 'framer-motion';
import { LoginScene } from './three/LoginScene';
import { Github, ArrowLeft, Terminal } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onLogin }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      <LoginScene />

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </button>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Top decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-50"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand/20">
                <Terminal className="w-8 h-8 text-brand" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to manage your documentation</p>
          </div>

          <div className="space-y-4">
            <button 
                onClick={onLogin}
                className="w-full py-3 px-4 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-lg font-medium flex items-center justify-center gap-3 transition-all hover:scale-[1.02] border border-white/10 group"
            >
              <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Continue with GitHub
            </button>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#1a1a1a] px-2 text-gray-500">Or continue with email</span>
                </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Email Address</label>
                    <input 
                        type="email" 
                        placeholder="developer@example.com"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
                    />
                </div>
                <button className="w-full py-3 px-4 bg-brand hover:bg-brand/90 text-white rounded-lg font-medium transition-all hover:shadow-[0_0_20px_-5px_rgba(87,57,251,0.5)]">
                    Sign In
                </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <a href="#" className="text-brand hover:underline">Request Access</a>
          </p>
        </div>
        
        {/* Footer info */}
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-600 font-mono">
                Secure Connection • End-to-End Encrypted
            </p>
        </div>
      </motion.div>
    </div>
  );
};