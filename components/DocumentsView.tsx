import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Download, Trash2, Eye, Filter, FileCode, FileJson, FileType, CheckCircle, Clock, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

const mockDocs = [
  { id: 1, name: 'API Reference v2.0', repo: 'backend-api-service', type: 'PDF', size: '2.4 MB', date: '2 hours ago', status: 'Ready' },
  { id: 2, name: 'Component Library Guide', repo: 'frontend-dashboard', type: 'Markdown', size: '145 KB', date: '1 day ago', status: 'Ready' },
  { id: 3, name: 'Database Schema', repo: 'backend-api-service', type: 'SQL', size: '45 KB', date: '2 days ago', status: 'Review' },
  { id: 4, name: 'Getting Started', repo: 'autodoc-writer-core', type: 'HTML', size: '890 KB', date: '3 days ago', status: 'Ready' },
  { id: 5, name: 'Deployment Manifest', repo: 'kubernetes-configs', type: 'YAML', size: '12 KB', date: '5 days ago', status: 'Failed' },
  { id: 6, name: 'Authentication Flow', repo: 'backend-api-service', type: 'Markdown', size: '28 KB', date: '1 week ago', status: 'Ready' },
];

type SortKey = 'name' | 'date' | 'status' | 'size';

export const DocumentsView: React.FC = () => {
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'asc' });

    const handleSort = (key: SortKey) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedDocs = [...mockDocs].sort((a, b) => {
        let valA: any = a[sortConfig.key];
        let valB: any = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredDocs = sortedDocs.filter(doc => 
        doc.name.toLowerCase().includes(filter.toLowerCase()) || 
        doc.repo.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">My Documents</h2>
                    <p className="text-zinc-400 mt-1 font-medium">Manage your generated repository documentation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-brand transition-colors" />
                         <input type="text" placeholder="Search docs..." value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand/50 w-64" />
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-[400px]">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] bg-zinc-950">
                    <div className="col-span-12 sm:col-span-4 cursor-pointer" onClick={() => handleSort('name')}>Document Name</div>
                    <div className="col-span-2 hidden md:block">Repository</div>
                    <div className="col-span-1 hidden lg:block">Type</div>
                    <div className="col-span-1 hidden lg:block">Size</div>
                    <div className="col-span-2 hidden sm:block">Date Generated</div>
                    <div className="col-span-1 hidden sm:block">Status</div>
                    <div className="col-span-1 hidden sm:block text-right">Actions</div>
                </div>

                <div className="divide-y divide-zinc-800">
                    {filteredDocs.map((doc, i) => (
                        <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-800/30 transition-colors group">
                            <div className="col-span-12 sm:col-span-4 flex items-center gap-3">
                                <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 text-brand"><FileText size={18} /></div>
                                <h3 className="font-bold text-white group-hover:text-brand transition-colors truncate">{doc.name}</h3>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center"><span className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{doc.repo}</span></div>
                            <div className="col-span-1 hidden lg:block text-xs font-bold text-zinc-500 uppercase">{doc.type}</div>
                            <div className="col-span-1 hidden lg:block text-xs font-bold text-zinc-500 uppercase">{doc.size}</div>
                            <div className="col-span-2 hidden sm:block text-xs font-bold text-zinc-600 uppercase tracking-tight">{doc.date}</div>
                            <div className="col-span-1 hidden sm:block"><span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${doc.status === 'Ready' ? 'text-green-500 border-green-500/30 bg-green-500/10' : 'text-amber-500 border-amber-500/30 bg-amber-500/10'}`}>{doc.status}</span></div>
                            <div className="col-span-1 hidden sm:flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"><Eye size={16} /></button>
                                <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"><Download size={16} /></button>
                                <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};