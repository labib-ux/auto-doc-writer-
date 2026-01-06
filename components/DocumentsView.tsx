
import React, { useState, useEffect } from 'react';
import { FileText, Search, Download, Trash2, Eye } from 'lucide-react';
import { api, Document } from '../lib/api';

export const DocumentsView: React.FC = () => {
    const [docs, setDocs] = useState<Document[]>([]);
    const [filter, setFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDocs = async () => {
            const fetched = await api.getDocs();
            setDocs(fetched);
            setIsLoading(false);
        };
        loadDocs();
    }, []);

    const filteredDocs = docs.filter(doc => 
        doc.name.toLowerCase().includes(filter.toLowerCase()) || 
        doc.repo.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">My Documents</h2>
                    <p className="text-zinc-400 mt-1 font-medium">Manage your generated documentation library.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                         <input type="text" placeholder="Search docs..." value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand/50 w-64" />
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64 text-brand font-black animate-pulse">FETCHING LIBRARY...</div>
                ) : filteredDocs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-600 gap-4">
                        <FileText size={48} opacity={0.2} />
                        <p className="font-black uppercase tracking-widest text-xs">No documents generated yet</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] bg-zinc-950">
                            <div className="col-span-12 sm:col-span-4">Document Name</div>
                            <div className="col-span-3 hidden md:block">Repository</div>
                            <div className="col-span-2 hidden sm:block">Date Generated</div>
                            <div className="col-span-1 hidden sm:block">Type</div>
                            <div className="col-span-2 hidden sm:block text-right">Actions</div>
                        </div>

                        <div className="divide-y divide-zinc-800">
                            {filteredDocs.map((doc) => (
                                <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-800/30 transition-colors group">
                                    <div className="col-span-12 sm:col-span-4 flex items-center gap-3">
                                        <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 text-brand"><FileText size={18} /></div>
                                        <h3 className="font-bold text-white truncate">{doc.name}</h3>
                                    </div>
                                    <div className="col-span-3 hidden md:flex items-center"><span className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">{doc.repo}</span></div>
                                    <div className="col-span-2 hidden sm:block text-xs font-bold text-zinc-600 uppercase">{doc.date}</div>
                                    <div className="col-span-1 hidden sm:block text-xs font-bold text-brand uppercase">{doc.type}</div>
                                    <div className="col-span-2 hidden sm:flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"><Eye size={16} /></button>
                                        <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"><Download size={16} /></button>
                                        <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
