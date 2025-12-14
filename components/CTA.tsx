import React from 'react';
import { Section } from './ui/Section';

interface CTAProps {
  onGetStarted: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onGetStarted }) => {
  return (
    <Section id="pricing" className="bg-brand text-white py-32 text-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Write Better <br/> Documentation?</h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Connect your GitHub repository and watch AutoDoc Writer transform your codebase into comprehensive guides in minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-white text-brand font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
                Get Started Now
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                View Documentation
            </button>
        </div>
      </div>
    </Section>
  );
};