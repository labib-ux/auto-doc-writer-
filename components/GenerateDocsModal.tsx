import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, FileCode, FileType, Check, Download, Play, BookOpen } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen && repo) {
        setStep('config');
        setSelectedFormats(['markdown']);
        setProgress(0);
        setLogs([]);
    }
  }, [isOpen, repo]);

  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter(f => f !== format));
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleGenerate = () => {
    if (selectedFormats.length === 0) return;
    
    setStep('generating');
    setProgress(0);
    setLogs(['Initializing AI engine...']);

    // Simulation sequence
    const sequence = [
        { progress: 20, msg: 'Scanning repository structure...' },
        { progress: 45, msg: 'Analyzing code semantics...' },
        { progress: 60, msg: 'Identifying dependencies...' },
        { progress: 80, msg: 'Generating documentation content...' },
        { progress: 95, msg: 'Formatting output files...' },
        { progress: 100, msg: 'Finalizing...' }
    ];

    let currentIdx = 0;

    const interval = setInterval(() => {
        if (currentIdx >= sequence.length) {
            clearInterval(interval);
            setTimeout(() => setStep('complete'), 600);
            return;
        }
        
        const stepData = sequence[currentIdx];
        setProgress(stepData.progress);
        addLog(stepData.msg);
        currentIdx++;

    }, 800);
  };

  const formats = [
    { id: 'markdown', label: 'Markdown', icon: <FileCode size={20} />, desc: 'Standard .md files for GitHub wikis.' },
    { id: 'pdf', label: 'PDF Report', icon: <FileText size={20} />, desc: 'Professional paginated document.' },
    { id: 'html', label: 'HTML Site', icon: <FileType size={20} />, desc: 'Static website with navigation.' },
    { id: 'latex', label: 'LaTeX', icon: <BookOpen size={20} />, desc: 'Academic paper format.' },
  ];

  return (
    <AnimatePresence>
      {isOpen && repo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#161616] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1a1a1a]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Generate Documentation
                </h2>
                <p className="text-sm text-gray-400 mt-1">Target: <span className="text-white font-mono">{repo.name}</span></p>
              </div>
              <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
                {step === 'config' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 tracking-wider">Select Formats</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {formats.map(f => (
                                    <div 
                                        key={f.id}
                                        onClick={() => toggleFormat(f.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selectedFormats.includes(f.id) ? 'bg-brand/10 border-brand/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className={selectedFormats.includes(f.id) ? 'text-brand' : 'text-gray-400'}>{f.icon}</div>
                                        <div>
                                            <div className="font-semibold text-sm flex items-center gap-2">
                                                {f.label} 
                                                {selectedFormats.includes(f.id) && <Check size={14} className="text-brand" />}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 tracking-wider">Configuration</h3>
                             <div className="bg-white/5 rounded-xl border border-white/5 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Include Code Snippets</span>
                                    <div className="w-10 h-5 bg-brand rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Generate Diagrams (Mermaid)</span>
                                    <div className="w-10 h-5 bg-white/10 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {step === 'generating' && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-6">
                        <div className="relative w-24 h-24">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="45" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                                <circle cx="48" cy="48" r="45" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={283} strokeDashoffset={283 - (283 * progress / 100)} className="text-brand transition-all duration-300 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold font-mono">
                                {Math.round(progress)}%
                            </div>
                        </div>
                        <div className="w-full max-w-md bg-black/30 rounded-lg p-4 font-mono text-xs h-32 overflow-y-auto border border-white/10">
                             {logs.map((log, i) => (
                                 <div key={i} className="text-gray-400 mb-1">> {log}</div>
                             ))}
                             <div className="animate-pulse text-brand">>_</div>
                        </div>
                    </div>
                )}

                {step === 'complete' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                            <div className="p-2 bg-green-500 rounded-full text-white">
                                <Check size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-green-400">Generation Complete</h3>
                                <p className="text-sm text-green-400/70">Documentation successfully created in {selectedFormats.length} formats.</p>
                            </div>
                        </div>

                        <div>
                             <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 tracking-wider">Generated Files</h3>
                             <div className="space-y-2">
                                {selectedFormats.map(fmt => (
                                    <div key={fmt} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {fmt === 'markdown' && <FileCode className="text-blue-400" />}
                                            {fmt === 'pdf' && <FileText className="text-red-400" />}
                                            {fmt === 'html' && <FileType className="text-orange-400" />}
                                            {fmt === 'latex' && <BookOpen className="text-emerald-400" />}
                                            <div>
                                                <div className="font-medium text-white capitalize">{repo.name}_{fmt === 'latex' ? 'paper' : 'docs'}.{fmt === 'markdown' ? 'md' : fmt === 'latex' ? 'tex' : fmt}</div>
                                                <div className="text-xs text-gray-500">2.4 MB • Generated just now</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors">Preview</button>
                                            <button className="px-3 py-1.5 text-xs font-medium bg-brand hover:bg-brand/90 text-white rounded-lg transition-colors flex items-center gap-1">
                                                <Download size={14} /> Download
                                            </button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            {step === 'config' && (
                <div className="p-4 border-t border-white/5 bg-[#1a1a1a] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button 
                        onClick={handleGenerate}
                        disabled={selectedFormats.length === 0}
                        className="px-6 py-2 rounded-lg text-sm font-bold bg-brand text-white hover:bg-brand/90 shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Play size={16} fill="currentColor" /> Start Generation
                    </button>
                </div>
            )}
            {step === 'complete' && (
                <div className="p-4 border-t border-white/5 bg-[#1a1a1a] flex justify-end gap-3">
                     <button onClick={onClose} className="px-6 py-2 rounded-lg text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-colors">
                        Close
                    </button>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};