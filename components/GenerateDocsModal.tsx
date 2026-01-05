
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, FileCode, FileType, Check, Download, Play, BookOpen, Loader2 } from 'lucide-react';
import { generateDocumentation } from '../lib/gemini';

interface Repo {
  id: number;
  name: string;
}

interface GenerateDocsModalProps {
  repo: Repo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateDocsModal: React.FC<GenerateDocsModalProps> = ({ repo, isOpen, onClose }) => {
  const [step, setStep] = useState<'config' | 'generating' | 'complete'>('config');
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['markdown']);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && repo) {
        setStep('config');
        setSelectedFormats(['markdown']);
        setProgress(0);
        setLogs([]);
        setResults({});
    }
  }, [isOpen, repo]);

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const handleGenerate = async () => {
    if (selectedFormats.length === 0) return;
    
    setStep('generating');
    setProgress(10);
    setLogs(['Contacting Gemini Pro Engine...', 'Connecting to repository: ' + repo?.name]);

    // In a real scenario, we'd fetch the actual code from the backend here.
    // For this demonstration, we use a sample code block to analyze.
    const dummyCode = `
    async function processOrder(order) {
        const validated = await validate(order);
        if (!validated) throw new Error("Invalid");
        const receipt = await db.save(validated);
        return receipt.id;
    }`;

    try {
        const newResults: Record<string, string> = {};
        
        for (let i = 0; i < selectedFormats.length; i++) {
            const fmt = selectedFormats[i];
            const mappedFmt = fmt === 'markdown' ? 'simple' : fmt === 'latex' ? 'latex' : 'research';
            
            setLogs(prev => [...prev, `Analyzing for ${fmt} format...`]);
            setProgress(prev => prev + (80 / selectedFormats.length));
            
            const output = await generateDocumentation(dummyCode, mappedFmt as any);
            newResults[fmt] = output;
        }

        setResults(newResults);
        setProgress(100);
        setLogs(prev => [...prev, 'Finalizing documents...', 'Complete!']);
        setTimeout(() => setStep('complete'), 500);
    } catch (err) {
        setLogs(prev => [...prev, 'Error: ' + (err as Error).message]);
        setStep('config');
    }
  };

  const formats = [
    { id: 'markdown', label: 'Markdown', icon: <FileCode size={20} />, desc: 'Standard .md files.' },
    { id: 'pdf', label: 'PDF Report', icon: <FileText size={20} />, desc: 'Formal report layout.' },
    { id: 'latex', label: 'LaTeX', icon: <BookOpen size={20} />, desc: 'Academic styling.' },
  ];

  return (
    <AnimatePresence>
      {isOpen && repo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
              <div>
                <h2 className="text-2xl font-black text-white">Generate Documentation</h2>
                <p className="text-sm text-zinc-500 font-bold mt-1 uppercase tracking-widest">Target: {repo.name}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
                {step === 'config' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {formats.map(f => (
                                <button key={f.id} onClick={() => toggleFormat(f.id)} className={`p-6 rounded-2xl border-2 text-left transition-all ${selectedFormats.includes(f.id) ? 'bg-brand border-brand' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                                    <div className="mb-4">{f.icon}</div>
                                    <div className="font-black text-sm uppercase tracking-widest mb-1">{f.label}</div>
                                    <p className="text-xs opacity-60 font-medium">{f.desc}</p>
                                </button>
                            ))}
                        </div>
                        <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">AI Model</h3>
                            <div className="flex items-center gap-3 text-sm font-bold text-white bg-black/40 p-3 rounded-xl border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Gemini 3 Pro (Coding Optimized)
                            </div>
                        </div>
                    </div>
                )}

                {step === 'generating' && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-8">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-900" />
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * progress / 100)} className="text-brand transition-all duration-500 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black">{Math.round(progress)}%</div>
                        </div>
                        <div className="w-full bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-xs h-48 overflow-y-auto shadow-inner">
                             {logs.map((log, i) => (
                                 <div key={i} className="text-zinc-400 mb-2 flex gap-2"><span className="text-brand font-black">→</span> {log}</div>
                             ))}
                             <div className="animate-pulse text-brand font-black">_</div>
                        </div>
                    </div>
                )}

                {step === 'complete' && (
                    <div className="space-y-8">
                        <div className="bg-green-500/10 border-2 border-green-500/20 p-6 rounded-2xl flex items-center gap-6">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20"><Check className="text-white" size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black text-white">Analysis Finished</h3>
                                <p className="text-zinc-400 font-medium">Your docs are ready for download or export.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(results).map(([fmt, text]) => (
                                <div key={fmt} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-brand" />
                                            <span className="font-black uppercase text-xs tracking-widest">{fmt} Output</span>
                                        </div>
                                        <button className="text-xs font-black uppercase text-brand hover:underline">Preview</button>
                                    </div>
                                    <pre className="text-[10px] text-zinc-500 line-clamp-3 bg-black/40 p-4 rounded-xl font-mono">{text}</pre>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 border-t border-zinc-900 bg-zinc-900/20 flex justify-end gap-4">
                {step === 'config' ? (
                    <>
                        <button onClick={onClose} className="px-6 py-3 text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Cancel</button>
                        <button onClick={handleGenerate} className="px-8 py-3 bg-brand text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand/20 hover:scale-105 transition-all">Start Engine</button>
                    </>
                ) : step === 'complete' ? (
                    <button onClick={onClose} className="px-10 py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest text-sm hover:bg-zinc-200 transition-all">Done</button>
                ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
