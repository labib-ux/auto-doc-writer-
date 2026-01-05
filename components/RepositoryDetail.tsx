
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, FileCode, Folder, FolderOpen, ChevronRight, ChevronDown, 
  FileText, Play, Code2, Columns, Search, Download, GitBranch, Sparkles, X
} from 'lucide-react';
import { explainCodeSnippet } from '../lib/gemini';

interface RepositoryDetailProps {
  repoId: number;
  onBack: () => void;
}

interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  language?: 'typescript' | 'json' | 'markdown' | 'css';
  children?: FileNode[];
}

const mockFileTree: FileNode[] = [
  { id: '1', name: 'src', type: 'folder', children: [
    { id: '1-1', name: 'components', type: 'folder', children: [
        { id: '1-1-1', name: 'Button.tsx', type: 'file', language: 'typescript' },
    ]},
    { id: '1-3', name: 'App.tsx', type: 'file', language: 'typescript' },
  ]},
  { id: '2', name: 'package.json', type: 'file', language: 'json' },
];

const mockFileContent: Record<string, { code: string; doc: string }> = {
  '1-1-1': {
    code: `export const Button = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};`,
    doc: `# Button component\nSimple UI primitive.`
  }
};

const FileTreeItem = ({ node, depth = 0, selectedId, onSelect }: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedId === node.id;
  return (
    <div>
      <div 
        onClick={() => node.type === 'folder' ? setIsOpen(!isOpen) : onSelect(node.id)}
        className={`flex items-center gap-3 py-2 px-4 cursor-pointer transition-all text-sm rounded-lg mx-2 ${isSelected ? 'bg-brand text-white font-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
        style={{ paddingLeft: `${depth * 16 + 16}px` }}
      >
        {node.type === 'folder' ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <FileCode size={14} />}
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children?.map((c: any) => <FileTreeItem key={c.id} node={c} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />)}
    </div>
  );
};

export const RepositoryDetail: React.FC<RepositoryDetailProps> = ({ repoId, onBack }) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>('1-1-1');
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'doc'>('split');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const selectedContent = selectedFileId ? mockFileContent[selectedFileId] : null;

  const handleExplain = async () => {
    if (!selectedContent) return;
    setIsExplaining(true);
    const text = await explainCodeSnippet(selectedContent.code);
    setExplanation(text || "AI could not explain this snippet.");
    setIsExplaining(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="h-20 flex items-center justify-between px-10 border-b border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 hover:bg-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><ArrowLeft size={24} /></button>
          <div>
             <h1 className="text-xl font-black text-white">autodoc-writer-core</h1>
             <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] flex items-center gap-2"><GitBranch size={12} /> main / src</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleExplain} disabled={isExplaining} className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border-2 border-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:border-brand transition-all disabled:opacity-50">
            <Sparkles size={16} className={isExplaining ? "animate-spin" : ""} /> {isExplaining ? "AI Thinking..." : "AI Explain"}
          </button>
          <button className="px-8 py-2.5 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-brand/20">Generate All</button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="w-80 bg-zinc-950 border-r border-zinc-900 flex flex-col py-6">
           <div className="px-8 mb-6 text-xs font-black uppercase tracking-[0.3em] text-zinc-600">Filesystem</div>
           {mockFileTree.map(node => <FileTreeItem key={node.id} node={node} selectedId={selectedFileId} onSelect={setSelectedFileId} />)}
        </div>

        <div className="flex-1 flex flex-col bg-black relative">
           <AnimatePresence>
            {explanation && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-brand/10 border-b border-brand/30 overflow-hidden">
                    <div className="p-4 px-10 flex items-start justify-between gap-6">
                        <div className="flex gap-4">
                            <Sparkles className="text-brand shrink-0 mt-1" size={20} />
                            <p className="text-sm font-bold text-zinc-200 leading-relaxed italic">"{explanation}"</p>
                        </div>
                        {/* Fix: Added missing X icon component from lucide-react */}
                        <button onClick={() => setExplanation(null)} className="text-zinc-500 hover:text-white transition-colors"><X size={16} /></button>
                    </div>
                </motion.div>
            )}
           </AnimatePresence>

           <div className="h-12 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-10">
              <div className="text-xs text-zinc-500 font-black uppercase tracking-widest">
                 {selectedFileId && mockFileTree.flatMap(n => n.children || n).find(f => f.id === selectedFileId)?.name}
              </div>
              <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
                  <button onClick={() => setViewMode('code')} className={`px-4 py-1 rounded-lg text-xs font-black transition-all ${viewMode === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Code</button>
                  <button onClick={() => setViewMode('split')} className={`px-4 py-1 rounded-lg text-xs font-black transition-all ${viewMode === 'split' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Split</button>
                  <button onClick={() => setViewMode('doc')} className={`px-4 py-1 rounded-lg text-xs font-black transition-all ${viewMode === 'doc' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Docs</button>
              </div>
           </div>

           <div className="flex-1 overflow-hidden flex">
              {selectedContent && (
                  <>
                      {(viewMode === 'split' || viewMode === 'code') && (
                          <div className={`flex-1 overflow-auto bg-black p-10 font-mono text-sm leading-loose text-zinc-300 ${viewMode === 'code' ? 'w-full' : 'w-1/2 border-r border-zinc-900'}`}>
                              <pre>{selectedContent.code}</pre>
                          </div>
                      )}
                      {(viewMode === 'split' || viewMode === 'doc') && (
                          <div className={`flex-1 overflow-auto bg-zinc-950 p-12 prose prose-invert max-w-none ${viewMode === 'doc' ? 'w-full' : 'w-1/2'}`}>
                               <div className="bg-zinc-900/40 p-10 rounded-3xl border border-zinc-800">
                                   {selectedContent.doc.split('\n').map((l, i) => <p key={i} className="mb-4 text-zinc-300 font-medium">{l}</p>)}
                               </div>
                          </div>
                      )}
                  </>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
