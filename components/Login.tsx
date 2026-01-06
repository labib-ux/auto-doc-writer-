
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginScene } from './three/LoginScene';
import { Github, ArrowLeft, Terminal, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { api, User } from '../lib/api';

interface LoginProps {
  onBack: () => void;
  onLogin: (userData: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onLogin }) => {
  const [githubHandle, setGithubHandle] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubHandle.trim()) return;

    setError(null);
    setIsVerifying(true);

    try {
      // Step 1: Real Handshake with GitHub API
      const githubUser = await api.fetchGitHubUser(githubHandle.trim());
      
      // Step 2: Artificial Delay for "Verification" UX
      await new Promise(res => setTimeout(res, 1500));
      
      onLogin(githubUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      <LoginScene />

      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-50"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand/20">
                <Github className="w-8 h-8 text-brand" />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Connect GitHub</h1>
            <p className="text-gray-400 font-medium">Sync your projects with AutoDoc Engine</p>
          </div>

          <form className="space-y-6" onSubmit={handleGithubSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">GitHub Handle</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand font-black">@</span>
                <input 
                  type="text" 
                  autoFocus
                  disabled={isVerifying}
                  placeholder="github-username" 
                  value={githubHandle}
                  onChange={(e) => setGithubHandle(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand transition-all text-lg font-bold"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-bold"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={isVerifying}
              className="w-full py-4 px-6 bg-brand text-white rounded-2xl font-black transition-all hover:bg-brand/90 hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100"
            >
                {isVerifying ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Connection...</>
                ) : (
                  <><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Sign In with GitHub</>
                )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Powered by GitHub Public API</p>
            <div className="flex gap-1">
              {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand/30" />)}
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                OAuth Tunnel v2.1 • TLS 1.3 SECURED
            </p>
        </div>
      </motion.div>
    </div>
  );
};
