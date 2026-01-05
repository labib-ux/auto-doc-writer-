import React, { useEffect, useState } from 'react';
import { HeroScene } from './three/HeroScene';
import { DocType } from '../types';
import { ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const [viewMode, setViewMode] = useState<DocType>(DocType.CODE);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') setViewMode(DocType.CODE);
      if (e.key.toLowerCase() === 'd') setViewMode(DocType.DOC);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      {/* 3D Scene Background */}
      <HeroScene viewMode={viewMode} />

      {/* Scrolling Text Background - Darker for less distraction */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 -z-20 opacity-[0.03] select-none pointer-events-none overflow-hidden whitespace-nowrap">
        <div className="animate-scroll-text text-[15vw] font-black text-white font-mono leading-none">
          CODE → DOCUMENTATION CODE → DOCUMENTATION CODE → DOCUMENTATION
        </div>
      </div>

      <div className="container mx-auto px-6 z-10 text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="inline-block mb-8 px-5 py-2 rounded-full border-2 border-brand bg-brand/10 text-white text-xs font-black tracking-[0.2em] uppercase">
              v2.0 PRO ENGINE LIVE
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-none text-white">
            Code Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-400">Docs.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-12 leading-relaxed font-bold">
            AutoDoc Writer transforms messy source code into professional, research-ready documentation in seconds.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
                onClick={onGetStarted}
                className="group relative px-10 py-5 bg-brand text-white font-black uppercase tracking-widest rounded-xl overflow-hidden transition-all shadow-2xl shadow-brand/40 hover:scale-105 active:scale-95"
            >
                <span className="relative flex items-center gap-3 text-lg">
                Start Analyzing Free <ArrowRight className="w-5 h-5" />
                </span>
            </button>
            
            <button className="px-10 py-5 bg-transparent border-2 border-zinc-800 text-white font-black uppercase tracking-widest rounded-xl hover:bg-zinc-900 transition-all text-lg flex items-center gap-3">
                <Github className="w-6 h-6" /> GitHub
            </button>
            </div>

            <div className="mt-20 text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">
            Interactive: Press <span className="text-brand mx-1">C</span> for Code <span className="mx-3 opacity-30">|</span> <span className="text-brand mx-1">D</span> for Docs
            </div>
        </motion.div>
      </div>
    </div>
  );
};