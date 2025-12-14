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
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* 3D Scene Background */}
      <HeroScene viewMode={viewMode} />

      {/* Scrolling Text Background */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 -z-20 opacity-5 select-none pointer-events-none overflow-hidden whitespace-nowrap">
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
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 backdrop-blur-sm text-brand text-sm font-mono tracking-wider">
            v2.0 NOW AVAILABLE
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
            Turn Code Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-400">Documentation.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AutoDoc Writer generates clean, research-ready documentation from your GitHub code in seconds using advanced AI analysis.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
                onClick={onGetStarted}
                className="group relative px-8 py-4 bg-brand text-white font-semibold rounded-lg overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(87,57,251,0.6)]"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
                </span>
            </button>
            
            <button className="px-8 py-4 bg-transparent border border-white/10 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
                <Github className="w-5 h-5" /> Clone on GitHub
            </button>
            </div>

            <div className="mt-16 text-sm text-gray-500 font-mono">
            <span className="inline-block p-1 border border-gray-700 rounded text-xs mx-1">C</span> for Code 
            <span className="mx-2">|</span>
            <span className="inline-block p-1 border border-gray-700 rounded text-xs mx-1">D</span> for Docs
            </div>
        </motion.div>
      </div>
    </div>
  );
};