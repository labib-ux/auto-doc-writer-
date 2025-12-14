import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
        scrolled ? "bg-dark/80 backdrop-blur-md border-white/10 py-4" : "bg-transparent border-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold font-mono tracking-tighter cursor-pointer z-50 relative" onClick={() => window.scrollTo(0,0)}>
            AutoDoc<span className="text-brand">Writer</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="hidden md:block">
            <button 
                onClick={onLoginClick}
                className="px-5 py-2 bg-white text-dark font-semibold rounded hover:bg-gray-200 transition-colors text-sm"
            >
                Login
            </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden z-50 relative">
            <button onClick={toggleMenu} className="text-white">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 bg-darker/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8"
                >
                    <a 
                        href="#features" 
                        onClick={toggleMenu}
                        className="text-2xl font-bold text-gray-300 hover:text-white"
                    >
                        Features
                    </a>
                    <a 
                        href="#workflow" 
                        onClick={toggleMenu}
                        className="text-2xl font-bold text-gray-300 hover:text-white"
                    >
                        How it Works
                    </a>
                    <a 
                        href="#pricing" 
                        onClick={toggleMenu}
                        className="text-2xl font-bold text-gray-300 hover:text-white"
                    >
                        Pricing
                    </a>
                    <button 
                        onClick={() => { toggleMenu(); onLoginClick(); }}
                        className="px-8 py-3 bg-white text-dark font-bold rounded-lg hover:bg-gray-200 transition-colors text-lg"
                    >
                        Login
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </nav>
  );
};