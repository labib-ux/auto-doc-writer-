import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Shape } from './three/Shape';
import { AddRepositoryModal } from './AddRepositoryModal';
import { GenerateDocsModal } from './GenerateDocsModal';
import { SettingsView } from './SettingsView';
import { DocumentsView } from './DocumentsView';
import { ActivityView } from './ActivityView';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Github, 
  Lock, 
  Globe, 
  Activity, 
  CheckCircle, 
  Play, 
  Search,
  RefreshCw,
  GitCommit,
  AlertCircle,
  Zap,
  Clock,
  BookOpen,
  ArrowUpRight,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ArrowDownUp,
  Plus,
  Menu,
  X,
  LayoutGrid,
  List
} from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  desc: string;
  isPrivate: boolean;
  isActive: boolean;
  lastUpdate: string;
  branch: string;
  docCount: number;
}

const mockRepos: Repo[] = [
  { id: 1, name: 'autodoc-writer-core', desc: 'Core logic for documentation generation engine.', isPrivate: true, isActive: true, lastUpdate: '2m ago', branch: 'main', docCount: 12 },
  { id: 2, name: 'react-three-fiber-experiments', desc: 'Visual experiments and 3D scenes.', isPrivate: false, isActive: false, lastUpdate: '1d ago', branch: 'dev', docCount: 5 },
  { id: 3, name: 'backend-api-service', desc: 'Node.js API for handling GitHub webhooks.', isPrivate: true, isActive: true, lastUpdate: '3h ago', branch: 'v2.0', docCount: 24 },
  { id: 4, name: 'docs-site-generator', desc: 'Static site generator for public docs.', isPrivate: false, isActive: false, lastUpdate: '5d ago', branch: 'master', docCount: 0 },
  { id: 5, name: 'utils-library', desc: 'Common utility functions shared across projects.', isPrivate: true, isActive: false, lastUpdate: '2w ago', branch: 'v1.1', docCount: 0 },
  { id: 6, name: 'frontend-dashboard', desc: 'React-based admin dashboard.', isPrivate: false, isActive: true, lastUpdate: '10m ago', branch: 'main', docCount: 8 },
];

const mockActivity = [
  { id: 1, type: 'push', repo: 'autodoc-writer-core', time: '2 mins ago', message: 'feat: added new parser logic' },
  { id: 2, type: 'gen', repo: 'autodoc-writer-core', time: '1 min ago', message: 'Documentation generated (v2.1)' },
  { id: 3, type: 'push', repo: 'backend-api-service', time: '3 hours ago', message: 'fix: websocket timeout issue' },
  { id: 4, type: 'error', repo: 'react-three-fiber-experiments', time: '1 day ago', message: 'Analysis failed: Syntax error' },
  { id: 5, type: 'push', repo: 'autodoc-writer-core', time: '2 days ago', message: 'chore: updated dependencies' },
];

interface DashboardProps {
  onLogout: () => void;
  onRepoSelect: (id: number) => void;
}

const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group shadow-lg"
  >
    <div className="p-3 bg-brand/10 rounded-xl text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <div>
      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-extrabold text-white">{value}</h3>
        {trend && <span className="text-xs text-green-400 font-mono font-bold">{trend}</span>}
      </div>
    </div>
  </motion.div>
);

type DashboardView = 'overview' | 'documents' | 'activity' | 'settings';

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, onRepoSelect }) => {
  const [repos, setRepos] = useState<Repo[]>(mockRepos);
  const [filter, setFilter] = useState('');
  const [isAddRepoOpen, setIsAddRepoOpen] = useState(false);
  const [generatingRepo, setGeneratingRepo] = useState<Repo | null>(null);
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [showFilters, setShowFilters] = useState(false);
  const [privacyFilter, setPrivacyFilter] = useState<'all' | 'private' | 'public'>('all');

  const toggleRepo = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRepos(repos.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const SidebarContent = () => (
    <>
        <div className="p-8">
          <div className="text-2xl font-bold font-mono tracking-tighter mb-1 text-white">
            AutoDoc<span className="text-brand">Writer</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Workspace</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          <button 
            onClick={() => { setCurrentView('overview'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl cursor-pointer transition-all ${
                currentView === 'overview' 
                ? 'bg-brand text-white shadow-xl shadow-brand/30' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white hover:translate-x-1'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-bold">Dashboard</span>
          </button>
          <button 
             onClick={() => { setCurrentView('documents'); setIsMobileMenuOpen(false); }}
             className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl cursor-pointer transition-all ${
                currentView === 'documents' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white hover:translate-x-1'
            }`}
          >
            <FileText size={20} />
            <span className="font-bold">My Documents</span>
          </button>
          <button 
            onClick={() => { setCurrentView('activity'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl cursor-pointer transition-all ${
                currentView === 'activity' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white hover:translate-x-1'
            }`}
          >
            <Activity size={20} />
            <span className="font-bold">Activity Log</span>
          </button>
          <button 
            onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl cursor-pointer transition-all ${
                currentView === 'settings' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white hover:translate-x-1'
            }`}
          >
            <Settings size={20} />
            <span className="font-bold">Settings</span>
          </button>
        </nav>

        <div className="p-6 border-t border-zinc-800">
           <div className="flex items-center gap-3 p-4 rounded-xl bg-black border border-zinc-800 mb-4">
               <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-bold text-sm shadow-inner">JD</div>
               <div className="flex-1 min-w-0">
                   <p className="text-sm font-extrabold text-white truncate">John Doe</p>
                   <p className="text-[10px] text-zinc-500 truncate font-mono uppercase tracking-widest font-bold">Free Plan</p>
               </div>
           </div>
           <button 
             onClick={onLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-black text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-widest"
           >
             <LogOut size={14} /> Sign Out
           </button>
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-black flex text-white font-sans overflow-hidden">
      
      <AddRepositoryModal 
        isOpen={isAddRepoOpen} 
        onClose={() => setIsAddRepoOpen(false)} 
        onImport={(newRepo) => setRepos([{...newRepo, id: Date.now(), isActive: false, lastUpdate: 'Just now', branch: 'main', docCount: 0}, ...repos])}
      />

      <GenerateDocsModal 
        isOpen={!!generatingRepo} 
        repo={generatingRepo} 
        onClose={() => setGeneratingRepo(null)} 
      />

      <div className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col hidden md:flex relative z-20">
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-black">
        <header className="h-20 flex items-center justify-between px-10 z-10 shrink-0 border-b border-zinc-800 bg-zinc-950/50">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-white">
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white">{currentView.replace('-', ' ')}</h1>
                    {currentView === 'overview' && <p className="text-sm text-zinc-400 font-bold">Manage your codebase analysis.</p>}
                </div>
            </div>
            
            {currentView === 'overview' && (
                <div className="flex items-center gap-4">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-brand transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search repositories..." 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 rounded-full pl-11 pr-6 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-brand w-48 lg:w-80 transition-all"
                        />
                    </div>
                    <button onClick={() => setIsAddRepoOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-brand/20 hover:scale-105 transition-all"><Plus size={18} /> Import Repo</button>
                </div>
            )}
        </header>

        <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {currentView === 'settings' ? <SettingsView /> : currentView === 'documents' ? <DocumentsView /> : currentView === 'activity' ? <ActivityView /> : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <StatCard icon={<Github size={24} />} label="Active Repositories" value={String(repos.filter(r => r.isActive).length)} trend="+1 this week" />
                            <StatCard icon={<FileText size={24} />} label="Docs Generated" value="41" trend="+12% vs last mo" />
                            <StatCard icon={<Zap size={24} />} label="Time Saved" value="18 hrs" trend="Est. manual time" />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                            <div className="xl:col-span-2 space-y-6">
                                <h2 className="text-xl font-black uppercase tracking-[0.1em] text-white flex items-center gap-2 mb-4">
                                  <Github className="w-5 h-5 text-brand" /> Repositories
                                </h2>
                                
                                <div className="grid gap-5">
                                    <AnimatePresence mode="popLayout">
                                        {repos.filter(r => r.name.toLowerCase().includes(filter.toLowerCase())).map((repo) => (
                                            <motion.div key={repo.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => onRepoSelect(repo.id)} className={`group relative rounded-2xl border-2 transition-all cursor-pointer ${repo.isActive ? 'bg-zinc-900 border-brand/40 shadow-xl' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'} p-6`}>
                                                <div className="flex items-center justify-between gap-6">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            {repo.isPrivate ? <Lock size={16} className="text-amber-500" /> : <Globe size={16} className="text-blue-500" />}
                                                            <h3 className="font-extrabold text-xl text-white group-hover:text-brand transition-colors truncate">{repo.name}</h3>
                                                            <span className="text-[10px] px-2 py-1 rounded bg-black border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest">{repo.branch}</span>
                                                        </div>
                                                        <p className="text-zinc-300 text-sm mb-5 font-medium leading-relaxed line-clamp-2">{repo.desc}</p>
                                                        <div className="flex items-center gap-6 text-[11px] text-zinc-500 font-black uppercase tracking-widest">
                                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {repo.lastUpdate}</span>
                                                            <span className={`flex items-center gap-1.5 ${repo.docCount > 0 ? 'text-green-500' : ''}`}><BookOpen size={14} /> {repo.docCount} Docs</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-5">
                                                        <div onClick={(e) => toggleRepo(repo.id, e)} className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${repo.isActive ? 'bg-brand' : 'bg-zinc-800'}`}>
                                                            <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${repo.isActive ? 'translate-x-7' : 'translate-x-0'}`} />
                                                        </div>
                                                        <button onClick={(e) => { e.stopPropagation(); setGeneratingRepo(repo); }} className="px-5 py-2.5 bg-brand text-white hover:bg-brand/90 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"><Play size={14} fill="currentColor" /> Generate</button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="xl:col-span-1">
                                <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-8 flex flex-col min-h-[600px] shadow-2xl">
                                    <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white mb-8 flex items-center gap-2"><Activity className="w-5 h-5 text-brand" /> Recent Activity</h2>
                                    <div className="space-y-10 relative flex-1">
                                        <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-zinc-800" />
                                        {mockActivity.map((item) => (
                                            <div key={item.id} className="relative pl-12">
                                                <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-zinc-900 z-10 ${item.type === 'push' ? 'bg-blue-600' : 'bg-brand'}`}>
                                                    {item.type === 'push' ? <GitCommit size={12} className="text-white" /> : <CheckCircle size={12} className="text-white" />}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{item.repo}</p>
                                                    <p className="text-sm text-zinc-100 leading-snug font-bold mb-1.5">{item.message}</p>
                                                    <span className="text-[10px] text-zinc-600 font-black uppercase tracking-tighter">{item.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};