import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Github, Lock, Globe, Plus, Loader2, Check } from 'lucide-react';

interface AvailableRepo {
  id: number;
  name: string;
  desc: string;
  isPrivate: boolean;
  language: string;
  stars: number;
}

// Mock data for repos that haven't been imported yet
const availableRepos: AvailableRepo[] = [
  { id: 101, name: 'stripe-payment-integration', desc: 'Stripe webhook handling and checkout flow.', isPrivate: true, language: 'TypeScript', stars: 12 },
  { id: 102, name: 'mobile-app-flutter', desc: 'Cross-platform mobile application.', isPrivate: false, language: 'Dart', stars: 45 },
  { id: 103, name: 'python-data-scraper', desc: 'BeautifulSoup scripts for market analysis.', isPrivate: true, language: 'Python', stars: 8 },
  { id: 104, name: 'landing-page-v1', desc: 'Legacy landing page built with HTML/SCSS.', isPrivate: false, language: 'HTML', stars: 2 },
  { id: 105, name: 'kubernetes-configs', desc: 'Deployment manifests for production.', isPrivate: true, language: 'YAML', stars: 15 },
];

interface AddRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (repo: AvailableRepo) => void;
}

export const AddRepositoryModal: React.FC<AddRepositoryModalProps> = ({ isOpen, onClose, onImport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [importingId, setImportingId] = useState<number | null>(null);

  const filteredRepos = availableRepos.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImport = (repo: AvailableRepo) => {
    setImportingId(repo.id);
    // Simulate API delay
    setTimeout(() => {
      onImport(repo);
      setImportingId(null);
      // We don't close immediately so the user sees the button change state, 
      // but in a real app we might close or show a toast.
      // Here we'll let the parent handle the "post-import" flow (e.g. closing or showing success).
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#161616] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1a1a1a]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Github className="w-5 h-5" /> Import Repository
                </h2>
                <p className="text-sm text-gray-400 mt-1">Select a repository to begin generating documentation.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-white/5 bg-[#121212]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search your repositories..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50 transition-colors"
                />
              </div>
            </div>

            {/* Repo List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredRepos.length > 0 ? (
                filteredRepos.map(repo => (
                  <div 
                    key={repo.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-200 truncate">{repo.name}</span>
                        {repo.isPrivate ? (
                          <Lock size={12} className="text-amber-400/80" />
                        ) : (
                          <Globe size={12} className="text-blue-400/80" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{repo.desc}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                          {repo.language}
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          ★ {repo.stars}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleImport(repo)}
                      disabled={importingId === repo.id}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 min-w-[100px] justify-center ${
                        importingId === repo.id 
                          ? 'bg-brand/20 text-brand cursor-not-allowed'
                          : 'bg-white/5 hover:bg-brand hover:text-white text-gray-300'
                      }`}
                    >
                      {importingId === repo.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Importing
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Import
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Github className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No repositories found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-[#1a1a1a] text-xs text-center text-gray-500">
               Showing repositories from <span className="text-gray-300">github.com/johndoe</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
