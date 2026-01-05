import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  FileCode, 
  FileJson, 
  Folder, 
  FolderOpen,
  ChevronRight, 
  ChevronDown, 
  FileText,
  Play,
  CheckCircle,
  LayoutTemplate,
  Code2,
  Columns,
  Search,
  Download,
  GitBranch
} from 'lucide-react';

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
        { id: '1-1-2', name: 'Header.tsx', type: 'file', language: 'typescript' },
        { id: '1-1-3', name: 'Hero.tsx', type: 'file', language: 'typescript' },
    ]},
    { id: '1-2', name: 'utils', type: 'folder', children: [
        { id: '1-2-1', name: 'api.ts', type: 'file', language: 'typescript' },
        { id: '1-2-2', name: 'helpers.ts', type: 'file', language: 'typescript' },
    ]},
    { id: '1-3', name: 'App.tsx', type: 'file', language: 'typescript' },
    { id: '1-4', name: 'index.tsx', type: 'file', language: 'typescript' },
  ]},
  { id: '2', name: 'package.json', type: 'file', language: 'json' },
  { id: '3', name: 'tsconfig.json', type: 'file', language: 'json' },
  { id: '4', name: 'README.md', type: 'file', language: 'markdown' },
];

const mockFileContent: Record<string, { code: string; doc: string }> = {
  '1-1-1': {
    code: `import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      onClick={onClick} 
      className={\`px-4 py-2 rounded \${
        variant === 'primary' 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-200 text-black'
      }\`}
    >
      {label}
    </button>
  );
};`,
    doc: `# Button Component

## Overview
A reusable UI button component that supports primary and secondary styling variants.

## Props Interface
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`label\` | string | - | The text to display inside the button. |
| \`onClick\` | () => void | - | Callback function triggered when the button is clicked. |
| \`variant\` | 'primary' \| 'secondary' | 'primary' | Controls the visual style of the button. |

## Usage Example
\`\`\`tsx
<Button 
  label="Submit" 
  onClick={() => handleSubmit()} 
  variant="primary" 
/>
\`\`\`

## Complexity
- Time Complexity: O(1) rendering
- Space Complexity: O(1)
`
  },
  '1-2-1': {
    code: `export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
};`,
    doc: `# fetchData Utility

## Description
A generic asynchronous helper function to perform HTTP GET requests and parse JSON responses. Includes basic error handling for non-2xx responses.

## Type Parameters
- \`T\`: The expected return type of the JSON response.

## Parameters
- \`url\` (string): The endpoint URL to fetch data from.

## Returns
- \`Promise<T>\`: A promise resolving to the parsed JSON data.

## Error Handling
Throws an Error if the response status is outside the 200-299 range or if the network request fails.
`
  }
};

// Added FileTreeItemProps interface and used React.FC to fix "Property 'key' does not exist" error
interface FileTreeItemProps {
  node: FileNode;
  depth?: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ 
  node, 
  depth = 0, 
  selectedId, 
  onSelect 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedId === node.id;
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

  return (
    <div>
      <div 
        onClick={() => {
          if (node.type === 'folder') setIsOpen(!isOpen);
          else onSelect(node.id);
        }}
        className={`flex items-center gap-2 py-2 px-4 cursor-pointer transition-all text-sm rounded mx-2 ${
          isSelected ? 'bg-brand text-white font-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
        }`}
        style={{ paddingLeft: `${depth * 14 + 16}px` }}
      >
        {node.type === 'folder' && (
          <span className="opacity-70">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        <span className={isSelected ? 'text-white' : 'text-zinc-600'}>
          {node.type === 'folder' ? (isOpen ? <FolderOpen size={16} /> : <Folder size={16} />) : <FileCode size={16} />}
        </span>
        <span className="truncate font-medium">{node.name}</span>
      </div>
      {hasChildren && isOpen && (
        <div className="mt-0.5">
          {node.children!.map(child => (
            <FileTreeItem key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export const RepositoryDetail: React.FC<RepositoryDetailProps> = ({ repoId, onBack }) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>('1-1-1');
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'doc'>('split');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedContent = selectedFileId ? mockFileContent[selectedFileId] : null;

  const flattenTree = (nodes: FileNode[], result: FileNode[] = []) => {
      nodes.forEach(node => {
          if (node.type === 'file') result.push(node);
          if (node.children) flattenTree(node.children, result);
      });
      return result;
  };

  const allFiles = flattenTree(mockFileTree);

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-zinc-950 z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={22} /></button>
          <div className="flex flex-col">
             <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">autodoc-writer-core <span className="text-zinc-700">/</span> src</h1>
             <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
               <GitBranch size={12} /> main <span className="w-1 h-1 rounded-full bg-zinc-700" /> Last sync 2m ago
             </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-black text-zinc-300 hover:bg-zinc-800 transition-all uppercase tracking-widest"><Download size={16} /> Export</button>
          <button onClick={() => { setIsGenerating(true); setTimeout(() => setIsGenerating(false), 2000); }} disabled={isGenerating} className="flex items-center gap-2 px-5 py-2 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"><Play size={16} fill="currentColor" /> {isGenerating ? 'Analyzing...' : 'Generate'}</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col hidden md:flex">
           <div className="p-5 border-b border-zinc-800">
             <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
               <input type="text" placeholder="Jump to file..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-brand transition-all" />
             </div>
           </div>
           <div className="flex-1 overflow-y-auto py-4">
             <div className="px-6 py-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] mb-2">Workspace Explorer</div>
             {mockFileTree.map(node => <FileTreeItem key={node.id} node={node} selectedId={selectedFileId} onSelect={setSelectedFileId} />)}
           </div>
        </div>

        <div className="flex-1 flex flex-col bg-black relative">
           <div className="h-11 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6">
              <div className="text-xs text-zinc-300 font-bold tracking-tight flex items-center gap-2">
                 {selectedFileId ? (<><FileCode size={16} className="text-brand" /> {allFiles.find(f => f.id === selectedFileId)?.name}</>) : 'No file selected'}
              </div>
              <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                  <button onClick={() => setViewMode('code')} className={`px-2.5 py-1 rounded-md transition-all ${viewMode === 'code' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}><Code2 size={16} /></button>
                  <button onClick={() => setViewMode('split')} className={`px-2.5 py-1 rounded-md transition-all ${viewMode === 'split' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}><Columns size={16} /></button>
                  <button onClick={() => setViewMode('doc')} className={`px-2.5 py-1 rounded-md transition-all ${viewMode === 'doc' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}><FileText size={16} /></button>
              </div>
           </div>

           <div className="flex-1 overflow-hidden flex">
              {!selectedContent ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-700">
                      <LayoutTemplate size={64} className="mb-6 opacity-10" />
                      <p className="font-black text-xs uppercase tracking-[0.3em]">Pick a file to analyze</p>
                  </div>
              ) : (
                  <>
                      {(viewMode === 'split' || viewMode === 'code') && (
                          <div className={`flex-1 overflow-auto bg-black border-r border-zinc-800 ${viewMode === 'code' ? 'w-full' : 'w-1/2'}`}>
                              <div className="p-10">
                                  <pre className="font-mono text-sm text-zinc-100 leading-relaxed font-medium">{selectedContent.code}</pre>
                              </div>
                          </div>
                      )}
                      {(viewMode === 'split' || viewMode === 'doc') && (
                          <div className={`flex-1 overflow-auto bg-[#0a0a0a] ${viewMode === 'doc' ? 'w-full' : 'w-1/2'}`}>
                              <div className="p-12 prose prose-invert prose-sm max-w-none">
                                  {selectedContent.doc.split('\n').map((line, i) => {
                                      if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-black mb-8 text-white border-b-2 border-zinc-800 pb-6 tracking-tight">{line.replace('# ', '')}</h1>
                                      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-extrabold mt-12 mb-6 text-white tracking-tight">{line.replace('## ', '')}</h2>
                                      if (line.startsWith('|')) return <div key={i} className="font-mono text-xs bg-zinc-900 border-2 border-zinc-800 p-4 my-4 text-zinc-200 rounded-2xl shadow-inner">{line}</div>
                                      return <p key={i} className="mb-6 text-zinc-200 leading-relaxed font-bold text-base">{line}</p>
                                  })}
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