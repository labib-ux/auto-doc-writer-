import React, { useState, useEffect } from 'react';
import { Section } from './ui/Section';
import { WorkflowScene } from './three/WorkflowScene';
import { Play, RotateCcw, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { id: 1, title: 'Push Code', desc: 'You push changes to GitHub' },
  { id: 2, title: 'Analysis', desc: 'AI scans the diffs' },
  { id: 3, title: 'Generation', desc: 'Docs are created' },
  { id: 4, title: 'Review', desc: 'Ready for export' },
];

export const Workflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev >= 4 ? 1 : prev + 1));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if(e.key.toLowerCase() === 'p') setIsPlaying(prev => !prev);
        if(e.key.toLowerCase() === 'r') {
            setIsPlaying(false);
            setActiveStep(1);
        }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <Section id="workflow" className="bg-dark border-t border-white/5 relative overflow-hidden h-[800px] flex flex-col justify-center">
        
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
         <WorkflowScene activeStep={activeStep} />
         {/* Fade Gradients for seamless blending */}
         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-dark to-transparent" />
         <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="container mx-auto text-center relative z-10 pointer-events-none">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-xl">Your Workflow, Simplified</h2>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto drop-shadow-md">
                AutoDoc Writer seamlessly integrates into your existing development process without breaking your flow.
            </p>
        </motion.div>

        {/* The 3D scene handles the visual representation of steps. 
            We just provide the controls here. 
            We push the controls to the bottom to not obstruct the view. */}
        <div className="h-[400px]"></div> {/* Spacer for 3D elements */}

        <div className="pointer-events-auto inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-full mt-8">
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-brand text-white hover:bg-brand/80 transition-all shadow-[0_0_15px_rgba(87,57,251,0.5)]"
                title="Play/Pause Animation (P)"
            >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            
            <div className="h-4 w-px bg-white/20" />

            {steps.map((step) => (
                <button
                    key={step.id}
                    onClick={() => { setIsPlaying(false); setActiveStep(step.id); }}
                    className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
                        activeStep === step.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                    }`}
                >
                    {step.id}
                </button>
            ))}

            <div className="h-4 w-px bg-white/20" />

             <button 
                onClick={() => { setIsPlaying(false); setActiveStep(1); }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset (R)"
            >
                <RotateCcw size={16} />
            </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 font-mono">
            Press <span className="text-gray-300">P</span> to play, <span className="text-gray-300">R</span> to reset
        </div>
      </div>
    </Section>
  );
};