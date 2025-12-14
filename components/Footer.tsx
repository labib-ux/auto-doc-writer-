import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-darker border-t border-white/5 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
                <div className="text-2xl font-bold font-mono text-white mb-2">AutoDoc<span className="text-brand">Writer</span></div>
                <p className="text-gray-500 text-sm">Automated documentation for modern developers.</p>
            </div>
            
            <div className="flex items-center gap-6">
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5"/></a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5"/></a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><Mail className="w-5 h-5"/></a>
            </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} AutoDoc Writer. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-gray-400">Privacy</a>
                <a href="#" className="hover:text-gray-400">Terms</a>
                <a href="#" className="hover:text-gray-400">Contact</a>
            </div>
        </div>
      </div>
    </footer>
  );
};