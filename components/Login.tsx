
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginScene } from './three/LoginScene';
import { Github, ArrowLeft, Terminal, ArrowRight } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onLogin: (userData: { name: string; email: string; handle: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [githubHandle, setGithubHandle] = useState('');
  const [isGithubMode, setIsGithubMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || email.split('@')[0] || 'Developer';
    const finalEmail = email.trim() || 'dev@autodoc.ai';
    const finalHandle = githubHandle.trim() || finalName.toLowerCase().replace(/\s+/g, '-');
    onLogin({ name: finalName, email: finalEmail, handle: finalHandle });
  };

  const handleGithubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubHandle.trim()) return;
    onLogin({ 
      name: githubHandle.trim(), 
      email: `${githubHandle.toLowerCase()}@github.com`,
      handle: githubHandle.trim()
    });
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-50"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand/20">
                <Terminal className="w-8 h-8 text-brand" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{isGithubMode ? 'Connect GitHub' : 'Welcome Back'}</h1>
            <p className="text-gray-400">{isGithubMode ? 'Enter your handle to sync repositories' : 'Sign in to manage your documentation'}</p>
          </div>

          <AnimatePresence mode="wait">
            {!isGithubMode ? (
              <motion.div 
                key="standard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <button 
                    onClick={() => setIsGithubMode(true)}
                    className="w-full py-3 px-4 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-lg font-medium flex items-center justify-center gap-3 transition-all hover:scale-[1.02] border border-white/10 group"
                >
                  <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Connect GitHub Account
                </button>
                
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-gray-500">Or use email</span></div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input 
                        type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 transition-all"
                    />
                    <input 
                        type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 transition-all"
                    />
                    <button type="submit" className="w-full py-3 px-4 bg-brand hover:bg-brand/90 text-white rounded-lg font-bold transition-all uppercase tracking-widest text-sm shadow-xl">
                        Sign In
                    </button>
                </form>
              </motion.div>
            ) : (
              <motion.form 
                key="github"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
                onSubmit={handleGithubSubmit}
              >
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">@</span>
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="github-username" 
                    value={githubHandle}
                    onChange={(e) => setGithubHandle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 transition-all text-lg font-bold"
                  />
                </div>
                <button type="submit" className="w-full py-4 px-6 bg-white text-black rounded-lg font-black transition-all hover:bg-gray-200 uppercase tracking-widest text-sm flex items-center justify-center gap-2 group">
                    Verify & Connect <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button type="button" onClick={() => setIsGithubMode(false)} className="w-full text-xs text-gray-500 hover:text-white transition-colors">
                  Cancel and use standard login
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-600 font-mono">
                Independent Sandboxed Workspace • No Shared Data
            </p>
        </div>
      </motion.div>
    </div>
  );
};
