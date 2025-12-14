import React from 'react';
import { Section } from './ui/Section';
import { motion } from 'framer-motion';
import { ProblemScene } from './three/ProblemScene';

export const Problem: React.FC = () => {
  return (
    <Section className="bg-darker border-t border-white/5">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Documentation <br/> <span className="text-gray-500">Is a Nightmare</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Writing code is creative. Writing documentation is repetitive, tedious, and often neglected. This leads to technical debt, onboarding friction, and "legacy code" that nobody understands.
            </p>
            
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="text-3xl font-bold text-brand mb-2">65%</div>
                <div className="text-gray-300">of CS students find documentation harder than coding itself.</div>
              </div>
              <div className="p-6 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="text-3xl font-bold text-brand mb-2">30%</div>
                <div className="text-gray-300">of engineering time is wasted figuring out undocumented logic.</div>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] w-full flex items-center justify-center">
             {/* 3D Scene representing Chaos */}
             <ProblemScene />

             {/* Floating Labels (Overlay) */}
             <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-1/4 left-0 md:-left-4 font-mono text-sm text-gray-400 bg-darker/80 backdrop-blur-md p-2 border border-gray-700 rounded shadow-2xl z-10"
             >
                // TODO: Explain this
             </motion.div>
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-10 right-0 md:right-10 font-mono text-sm text-red-400 bg-darker/80 backdrop-blur-md p-2 border border-red-900/50 rounded shadow-2xl z-10"
             >
                FIXME: Deprecated
             </motion.div>
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute bottom-10 left-10 font-mono text-sm text-orange-400 bg-darker/80 backdrop-blur-md p-2 border border-orange-900/50 rounded shadow-2xl z-10"
             >
                Unknown Runtime Error
             </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
};