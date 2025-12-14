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

// --- Mock Data ---

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

// --- Components ---

const FileTreeItem = ({ 
  node, 
  depth = 0, 
  selectedId, 
  onSelect 
}: { 
  node: FileNode; 
  depth?: number; 
  selectedId: string | null; 
  onSelect: (id: string) => void;
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
        className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors text-sm rounded mx-2 ${
          isSelected ? 'bg-brand/20 text-brand font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.type === 'folder' && (
          <span className="opacity-70">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        
        <span className={isSelected ? 'text-brand' : 'text-gray-500'}>
          {node.type === 'folder' ? (
             isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
          ) : (
             node.language === 'json' ? <FileJson size={16} /> : 
             node.language === 'markdown' ? <FileText size={16} /> :
             <FileCode size={16} />
          )}
        </span>
        
        <span className="truncate">{node.name}</span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children!.map(child => (
            <FileTreeItem 
              key={child.id} 
              node={child} 
              depth={depth + 1} 
              selectedId={selectedId} 
              onSelect={onSelect}
            />
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

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  // Helper to flatten tree for search
  const flattenTree = (nodes: FileNode[], result: FileNode[] = []) => {
      nodes.forEach(node => {
          if (node.type === 'file') result.push(node);
          if (node.children) flattenTree(node.children, result);
      });
      return result;
  };

  const allFiles = flattenTree(mockFileTree);
  const filteredFiles = allFiles.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-screen bg-darker text-white overflow-hidden">
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#121212] z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex flex-col">
             <h1 className="text-lg font-bold flex items-center gap-2">
               autodoc-writer-core <span className="text-gray-600">/</span> src
             </h1>
             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
               <GitBranch size={12} />
               <span>main</span>
               <span className="w-1 h-1 rounded-full bg-gray-600" />
               <span>Last update 2m ago</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-1.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
            ) : (
                <>
                  <Play size={16} fill="currentColor" /> Generate Docs
                </>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar: File Explorer */}
        <div className="w-72 bg-[#161616] border-r border-white/5 flex flex-col hidden md:flex">
           <div className="p-4 border-b border-white/5">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Search files..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-brand/50"
               />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto py-2">
             <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Explorer</div>
             
             {searchTerm ? (
                 <div className="space-y-1">
                     {filteredFiles.length > 0 ? (
                         filteredFiles.map(file => (
                            <div 
                                key={file.id}
                                onClick={() => setSelectedFileId(file.id)}
                                className={`flex items-center gap-2 py-1.5 px-3 cursor-pointer transition-colors text-sm rounded mx-2 ${
                                selectedFileId === file.id ? 'bg-brand/20 text-brand font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <FileCode size={14} className="opacity-70" />
                                <span className="truncate">{file.name}</span>
                            </div>
                         ))
                     ) : (
                         <div className="px-4 py-4 text-sm text-gray-500 text-center">No files found.</div>
                     )}
                 </div>
             ) : (
                 mockFileTree.map(node => (
                    <FileTreeItem 
                        key={node.id} 
                        node={node} 
                        selectedId={selectedFileId} 
                        onSelect={setSelectedFileId} 
                    />
                 ))
             )}
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-[#0d0d0d] relative">
           
           {/* View Toggle Bar */}
           <div className="h-10 bg-[#161616] border-b border-white/5 flex items-center justify-between px-4">
              <div className="text-sm text-gray-400 font-mono flex items-center gap-2">
                 {selectedFileId ? (
                   <>
                     <FileCode size={14} className="text-blue-400" />
                     {allFiles.find(f => f.id === selectedFileId)?.name || 'Button.tsx'}
                   </>
                 ) : 'No file selected'}
              </div>

              <div className="flex bg-black/30 rounded p-0.5">
                  <button 
                    onClick={() => setViewMode('code')}
                    className={`p-1 rounded text-gray-400 hover:text-white transition-colors ${viewMode === 'code' ? 'bg-white/10 text-white' : ''}`}
                    title="Code Only"
                  >
                    <Code2 size={14} />
                  </button>
                  <button 
                    onClick={() => setViewMode('split')}
                    className={`p-1 rounded text-gray-400 hover:text-white transition-colors ${viewMode === 'split' ? 'bg-white/10 text-white' : ''}`}
                    title="Split View"
                  >
                    <Columns size={14} />
                  </button>
                  <button 
                    onClick={() => setViewMode('doc')}
                    className={`p-1 rounded text-gray-400 hover:text-white transition-colors ${viewMode === 'doc' ? 'bg-white/10 text-white' : ''}`}
                    title="Docs Only"
                  >
                    <FileText size={14} />
                  </button>
              </div>
           </div>

           {/* Content Canvas */}
           <div className="flex-1 overflow-hidden relative flex">
              {!selectedContent ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                      <LayoutTemplate size={48} className="mb-4 opacity-20" />
                      <p>Select a file to view content</p>
                  </div>
              ) : (
                  <>
                      {/* Code Pane */}
                      {(viewMode === 'split' || viewMode === 'code') && (
                          <div className={`flex-1 overflow-auto bg-[#0d0d0d] border-r border-white/5 relative ${viewMode === 'code' ? 'w-full' : 'w-1/2'}`}>
                              <div className="absolute top-0 left-0 px-4 py-2 bg-[#1a1a1a]/80 backdrop-blur border-b border-white/5 w-full sticky z-10">
                                  <span className="text-xs font-bold text-gray-500 uppercase">Source Code</span>
                              </div>
                              <div className="p-6">
                                  <pre className="font-mono text-sm text-gray-300 leading-relaxed">
                                      {selectedContent.code}
                                  </pre>
                              </div>
                          </div>
                      )}

                      {/* Doc Pane */}
                      {(viewMode === 'split' || viewMode === 'doc') && (
                          <div className={`flex-1 overflow-auto bg-[#121212] relative ${viewMode === 'doc' ? 'w-full' : 'w-1/2'}`}>
                              <div className="absolute top-0 left-0 px-4 py-2 bg-[#1a1a1a]/80 backdrop-blur border-b border-white/5 w-full sticky z-10 flex justify-between items-center">
                                  <span className="text-xs font-bold text-brand uppercase">Generated Documentation</span>
                                  {isGenerating ? (
                                      <span className="text-xs text-brand animate-pulse">Updating...</span>
                                  ) : (
                                      <span className="text-[10px] text-green-400 flex items-center gap-1">
                                          <CheckCircle size={10} /> Up to date
                                      </span>
                                  )}
                              </div>
                              <div className="p-8 prose prose-invert prose-sm max-w-none">
                                  {selectedContent.doc.split('\n').map((line, i) => {
                                      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-4 text-white pb-2 border-b border-white/10">{line.replace('# ', '')}</h1>
                                      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold mt-6 mb-3 text-white">{line.replace('## ', '')}</h2>
                                      if (line.startsWith('```')) return null; // Simple skip for code block markers
                                      if (line.startsWith('|')) return <div key={i} className="font-mono text-xs bg-white/5 p-1 my-1 truncate text-gray-400">{line}</div>
                                      return <p key={i} className="mb-2 text-gray-300 leading-relaxed">{line}</p>
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