
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Github, Lock, Globe, Plus, Loader2, RefreshCw } from 'lucide-react';
import { api, AvailableRepo } from '../lib/api';

interface AddRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (repo: any) => void;
}

export const AddRepositoryModal: React.FC<AddRepositoryModalProps> = ({ isOpen, onClose, onImport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [importingId, setImportingId] = useState<number | null>(null);
  const [availableRepos, setAvailableRepos] = useState<AvailableRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userHandle, setUserHandle] = useState('');

  useEffect(() => {
    if (isOpen) {
      const user = api.getCurrentUser();
      if (user) {
        setUserHandle(user.handle);
        loadAvailableRepos(user.handle);
      }
    }
  }, [isOpen]);

  const loadAvailableRepos = async (handle: string) => {
    setIsLoading(true);
    try {
      const repos = await api.getAvailableGithubRepos(handle);
      setAvailableRepos(repos);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const filteredRepos = availableRepos.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImport = (repo: AvailableRepo) => {
    setImportingId(repo.id);
    setTimeout(() => {
      onImport({
        name: repo.name,
        desc: repo.desc,
        isPrivate: repo.isPrivate,
        branch: 'main'
      });
      setImportingId(null);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#161616] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1a1a1a]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Github className="w-5 h-5" /> Import from {userHandle}</h2>
                <p className="text-sm text-gray-400 mt-1">Syncing with your active GitHub session.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => loadAvailableRepos(userHandle)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"><RefreshCw size={18} className={isLoading ? "animate-spin" : ""} /></button>
                <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
              </div>
            </div>

            <div className="p-4 border-b border-white/5 bg-[#121212]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input type="text" autoFocus placeholder="Search your repositories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50 transition-colors" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-brand py-20 gap-4">
                  <Loader2 size={32} className="animate-spin" />
                  <p className="font-black uppercase tracking-widest text-xs">Fetching GitHub API...</p>
                </div>
              ) : filteredRepos.length > 0 ? (
                filteredRepos.map(repo => (
                  <div key={repo.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-200 truncate">{repo.name}</span>
                        {repo.isPrivate ? <Lock size={12} className="text-amber-400/80" /> : <Globe size={12} className="text-blue-400/80" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{repo.desc}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">{repo.language}</span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">★ {repo.stars}</span>
                      </div>
                    </div>
                    <button onClick={() => handleImport(repo)} disabled={importingId === repo.id} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 min-w-[100px] justify-center ${importingId === repo.id ? 'bg-brand/20 text-brand cursor-not-allowed' : 'bg-white/5 hover:bg-brand hover:text-white text-gray-300'}`}>
                      {importingId === repo.id ? <><Loader2 size={14} className="animate-spin" /> Importing</> : <><Plus size={14} /> Import</>}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Github className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No new repositories found for "{userHandle}"</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-white/5 bg-[#1a1a1a] text-xs text-center text-gray-500 font-mono">
               Authenticated as <span className="text-brand font-black">github.com/{userHandle}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
