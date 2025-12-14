import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Download, Trash2, Eye, Filter, FileCode, FileJson, FileType, CheckCircle, Clock, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

// Mock Data
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

    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="inline ml-1" /> : <ArrowDown size={12} className="inline ml-1" />;
    };

    // Helper for size sorting
    const parseSize = (size: string) => {
        if (size.endsWith('MB')) return parseFloat(size) * 1024;
        if (size.endsWith('KB')) return parseFloat(size);
        return 0;
    };

    // Helper for date sorting (approximate for mock strings)
    const parseMockDate = (date: string) => {
        if (date.includes('hour')) return 1;
        if (date.includes('day')) return parseInt(date) * 24;
        if (date.includes('week')) return parseInt(date) * 168;
        return 999;
    };

    const sortedDocs = [...mockDocs].sort((a, b) => {
        let valA: any = a[sortConfig.key];
        let valB: any = b[sortConfig.key];

        if (sortConfig.key === 'size') {
            valA = parseSize(a.size);
            valB = parseSize(b.size);
        } else if (sortConfig.key === 'date') {
            valA = parseMockDate(a.date);
            valB = parseMockDate(b.date);
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredDocs = sortedDocs.filter(doc => 
        doc.name.toLowerCase().includes(filter.toLowerCase()) || 
        doc.repo.toLowerCase().includes(filter.toLowerCase())
    );

    const getIcon = (type: string) => {
        switch(type) {
            case 'PDF': return <FileText className="text-red-400" size={18} />;
            case 'Markdown': return <FileCode className="text-blue-400" size={18} />;
            case 'SQL': return <FileJson className="text-yellow-400" size={18} />;
            case 'YAML': return <FileJson className="text-purple-400" size={18} />;
            case 'HTML': return <FileType className="text-orange-400" size={18} />;
            default: return <FileText className="text-gray-400" size={18} />;
        }
    }

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Ready': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Review': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'Failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold">My Documents</h2>
                    <p className="text-gray-400 mt-1">Access and manage your generated documentation.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-brand transition-colors" />
                         <input 
                            type="text" 
                            placeholder="Search docs..." 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-[#1a1a1a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-brand/50 transition-all w-64"
                         />
                    </div>
                    <button className="p-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden min-h-[400px]">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-mono text-gray-500 uppercase tracking-wider bg-white/[0.02]">
                    <div 
                        className="col-span-12 sm:col-span-4 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('name')}
                    >
                        Document Name {getSortIcon('name')}
                    </div>
                    <div className="col-span-2 hidden md:block">Repository</div>
                    <div className="col-span-1 hidden lg:block">Type</div>
                    <div 
                        className="col-span-1 hidden lg:block cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('size')}
                    >
                        Size {getSortIcon('size')}
                    </div>
                    <div 
                        className="col-span-2 hidden sm:block cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('date')}
                    >
                        Date Generated {getSortIcon('date')}
                    </div>
                    <div 
                        className="col-span-1 hidden sm:block cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('status')}
                    >
                        Status {getSortIcon('status')}
                    </div>
                    <div className="col-span-1 hidden sm:block text-right">Actions</div>
                </div>

                <div className="divide-y divide-white/5">
                    {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc, i) => (
                            <motion.div 
                                key={doc.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
                            >
                                {/* Name */}
                                <div className="col-span-12 sm:col-span-4 flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                        {getIcon(doc.type)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-medium text-white truncate group-hover:text-brand transition-colors cursor-pointer">{doc.name}</h3>
                                        {/* Mobile only sub-details */}
                                        <div className="sm:hidden text-xs text-gray-500 flex gap-2 mt-1">
                                            <span>{doc.type}</span> • <span>{doc.size}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Repo */}
                                <div className="col-span-2 hidden md:flex items-center">
                                    <span className="px-2 py-1 rounded bg-black/20 border border-white/5 truncate max-w-full text-xs font-mono text-gray-400">
                                        {doc.repo}
                                    </span>
                                </div>

                                {/* Type */}
                                <div className="col-span-1 hidden lg:block text-sm text-gray-400">
                                    {doc.type}
                                </div>

                                {/* Size */}
                                <div className="col-span-1 hidden lg:block text-sm text-gray-400 font-mono">
                                    {doc.size}
                                </div>

                                {/* Date */}
                                <div className="col-span-2 hidden sm:block text-sm text-gray-500">
                                    {doc.date}
                                </div>

                                {/* Status */}
                                <div className="col-span-1 hidden sm:flex items-center">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                                        {doc.status === 'Ready' && <CheckCircle size={10} />}
                                        {doc.status === 'Review' && <Clock size={10} />}
                                        {doc.status === 'Failed' && <AlertCircle size={10} />}
                                        {doc.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 hidden sm:flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors tooltip" title="View">
                                        <Eye size={16} />
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors tooltip" title="Download">
                                        <Download size={16} />
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors tooltip" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p>No documents found matching "{filter}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};