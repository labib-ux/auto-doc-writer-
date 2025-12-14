import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Section } from './ui/Section';
import { Canvas } from '@react-three/fiber';
import { Shape } from './three/Shape';
import { FileText, BookOpen, Sigma, X, Copy, Check, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cards = [
  {
    id: 1,
    title: "Simple Explanation",
    description: "Explains functions, classes, and logic in plain English for quick onboarding.",
    icon: <FileText className="w-6 h-6 text-brand" />,
    shape: 'box',
    color: '#5739fb'
  },
  {
    id: 2,
    title: "Research Paper",
    description: "Converts code logic into formal, academically-styled paragraphs suitable for publication.",
    icon: <BookOpen className="w-6 h-6 text-blue-400" />,
    shape: 'torus',
    color: '#60a5fa'
  },
  {
    id: 3,
    title: "LaTeX Output",
    description: "Generates copy-paste ready LaTeX code formatted for Overleaf and academic editors.",
    icon: <Sigma className="w-6 h-6 text-emerald-400" />,
    shape: 'sphere',
    color: '#34d399'
  }
];

const samples: Record<number, { title: string; lang: string; text: string }> = {
  1: {
    title: "Simple Explanation Output",
    lang: "markdown",
    text: `### Function Analysis: generateReport()

**Summary**
This function aggregates user activity logs and calculates retention metrics over a specified date range.

**Step-by-Step Logic**
1. **Input Validation**: Checks if \`startDate\` and \`endDate\` are valid Date objects.
2. **Data Fetching**: Queries the \`analytics_db\` for logs within the time window.
3. **Processing**:
   - Groups logs by unique \`userId\`.
   - Calculates average session duration per user.
4. **Output**: Returns a JSON object containing daily active user (DAU) counts.

**Complexity Note**
The sorting operation implies a time complexity of O(n log n).`
  },
  2: {
    title: "Research Paper Output",
    lang: "text",
    text: `3.2. Asynchronous Data Aggregation

The proposed architecture implements a non-blocking I/O model to handle high-throughput log ingestion. As illustrated in the \`generateReport\` procedure, the system leverages a distributed map-reduce pattern, which reduces latency by approximately 40% compared to synchronous iteration.

The data flow guarantees strong consistency while maintaining partition tolerance, adhering to the CAP Theorem constraints for distributed analytics systems (Gilbert & Lynch, 2002).`
  },
  3: {
    title: "LaTeX Output",
    lang: "latex",
    text: `\\section{Algorithmic Efficiency}

The aggregation function $f(x)$ is defined as:

\\begin{equation}
    f(x) = \\sum_{i=0}^{n} \\frac{\\log(s_i)}{t_{total}}
\\end{equation}

Where $s_i$ represents the session duration and $t_{total}$ is the total observation window. 

\\subsection{Performance Metrics}
\\begin{table}[h]
    \\centering
    \\begin{tabular}{|c|c|}
        \\hline
        Algorithm & Time (ms) \\\\
        \\hline
        Linear Scan & 450 \\\\
        Indexed Search & 120 \\\\
        \\hline
    \\end{tabular}
    \\caption{Query Performance Comparison}
\\end{table}`
  }
};

export const Solution: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (activeCard === null) return;
    const sample = samples[activeCard];
    const element = document.createElement("a");
    const file = new Blob([sample.text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    const ext = sample.lang === 'markdown' ? 'md' : sample.lang === 'latex' ? 'tex' : 'txt';
    element.download = `autodoc-${sample.title.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Section className="bg-dark relative">
      {/* Background Text */}
      <div className="absolute top-20 left-0 w-full opacity-[0.03] pointer-events-none overflow-hidden whitespace-nowrap z-0">
          <div className="animate-scroll-text text-[10vw] font-black font-mono">
            PLAIN TEXT × RESEARCH × LATEX × PLAIN TEXT × RESEARCH × LATEX
          </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">From Code to Three Formats</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Click any card to see a live example of the generated output.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div 
              key={card.id} 
              onClick={() => setActiveCard(card.id)}
              className="group relative bg-white/5 border border-white/5 rounded-2xl p-1 overflow-hidden transition-all hover:-translate-y-2 hover:bg-white/10 cursor-pointer"
            >
              <div className="h-48 w-full bg-black/20 rounded-xl mb-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    {/* Main Light */}
                    <spotLight position={[5, 5, 5]} angle={0.25} penumbra={1} intensity={1.5} color="white" />
                    {/* Color Fill Light */}
                    <pointLight position={[-5, -5, -5]} intensity={1.5} color={card.color} />
                    {/* Rim Light for 3D Pop */}
                    <spotLight position={[-5, 5, 0]} intensity={1} color="#ffffff" angle={0.5} />
                    
                    <Shape type={card.shape as any} color={card.color} />
                  </Canvas>
                </div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs bg-white/10 backdrop-blur text-white px-2 py-1 rounded border border-white/10">Click to preview</span>
                </div>
              </div>
              <div className="px-6 pb-8">
                <div className="mb-4 inline-flex items-center justify-center p-3 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Portal */}
      {createPortal(
        <AnimatePresence>
          {activeCard !== null && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCard(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand/20 rounded-lg text-brand">
                            {cards.find(c => c.id === activeCard)?.icon}
                        </div>
                        <h3 className="text-xl font-bold">{samples[activeCard].title}</h3>
                    </div>
                    <button 
                        onClick={() => setActiveCard(null)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                
                <div className="p-6 bg-[#0d0d0d] overflow-x-auto">
                    <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {samples[activeCard].text}
                    </pre>
                </div>

                <div className="p-4 border-t border-white/5 bg-white/5 flex justify-end gap-3">
                    <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
                    >
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button 
                        onClick={() => handleCopy(samples[activeCard].text)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy Output"}
                    </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </Section>
  );
};