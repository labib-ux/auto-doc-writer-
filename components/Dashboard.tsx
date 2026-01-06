
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddRepositoryModal } from './AddRepositoryModal';
import { GenerateDocsModal } from './GenerateDocsModal';
import { SettingsView } from './SettingsView';
import { DocumentsView } from './DocumentsView';
import { ActivityView } from './ActivityView';
import { api, Repo, ActivityItem, User } from '../lib/api';
import { 
  LayoutDashboard, FileText, Settings, LogOut, Github, Lock, Globe, 
  Activity, CheckCircle, Play, Search, Plus, Menu, X, Zap, Clock, BookOpen, GitCommit
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  onRepoSelect: (id: number) => void;
}

const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend?: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group shadow-lg">
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
  const [repos, setRepos] = useState<Repo[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState('');
  const [isAddRepoOpen, setIsAddRepoOpen] = useState(false);
  const [generatingRepo, setGeneratingRepo] = useState<Repo | null>(null);
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
    
    // Fetch user-isolated storage data
    const [fetchedRepos, fetchedActivity] = await Promise.all([
      api.getRepos(),
      api.getActivity()
    ]);
    setRepos(fetchedRepos);
    setActivity(fetchedActivity);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleRepo = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const repo = repos.find(r => r.id === id);
    if (repo) {
      const updated = await api.updateRepo(id, { isActive: !repo.isActive });
      setRepos(repos.map(r => r.id === id ? updated : r));
    }
  };

  const handleImport = async (newRepo: any) => {
    await api.addRepo(newRepo);
    loadData();
  };

  const SidebarContent = () => (
    <>
        <div className="p-8">
          <div className="text-2xl font-black font-mono tracking-tighter mb-1 text-white">AutoDoc<span className="text-brand">Writer</span></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Live Session</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1.5">
          <button onClick={() => setCurrentView('overview')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${currentView === 'overview' ? 'bg-brand text-white shadow-xl shadow-brand/30' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            <LayoutDashboard size={20} /> <span className="font-bold">Dashboard</span>
          </button>
          <button onClick={() => setCurrentView('documents')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${currentView === 'documents' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            <FileText size={20} /> <span className="font-bold">My Documents</span>
          </button>
          <button onClick={() => setCurrentView('activity')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${currentView === 'activity' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            <Activity size={20} /> <span className="font-bold">Activity Log</span>
          </button>
          <button onClick={() => setCurrentView('settings')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${currentView === 'settings' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            <Settings size={20} /> <span className="font-bold">Settings</span>
          </button>
        </nav>
        <div className="p-6 border-t border-zinc-800">
           <div className="flex items-center gap-3 p-4 rounded-2xl bg-black border border-zinc-800 mb-4 group cursor-default">
               <div className="relative">
                 {user?.avatarUrl ? (
                   <img src={user.avatarUrl} className="w-10 h-10 rounded-full border-2 border-brand/50 p-0.5 shadow-lg" alt="avatar" />
                 ) : (
                   <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-black text-sm text-white">{user?.initials || '??'}</div>
                 )}
                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-extrabold text-white truncate group-hover:text-brand transition-colors">{user?.name || 'Loading...'}</p>
                 <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tight">@{user?.handle}</p>
               </div>
           </div>
           <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-black text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors"><LogOut size={14} /> Switch Account</button>
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-black flex text-white font-sans overflow-hidden">
      <AddRepositoryModal isOpen={isAddRepoOpen} onClose={() => setIsAddRepoOpen(false)} onImport={handleImport} />
      <GenerateDocsModal isOpen={!!generatingRepo} repo={generatingRepo} onClose={() => { setGeneratingRepo(null); loadData(); }} />

      <div className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col hidden md:flex relative z-20"><SidebarContent /></div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-black">
        <header className="h-20 flex items-center justify-between px-10 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">{currentView}</h1>
            {currentView === 'overview' && (
                <div className="flex items-center gap-4">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                        <input type="text" placeholder="Search repositories..." value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-full pl-11 pr-6 py-2.5 text-sm text-white focus:outline-none focus:border-brand lg:w-80 transition-all" />
                    </div>
                    <button onClick={() => setIsAddRepoOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-full font-black uppercase text-xs shadow-lg shadow-brand/20 hover:scale-105 transition-all"><Plus size={18} /> Import from GitHub</button>
                </div>
            )}
        </header>

        <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {isLoading ? <div className="flex flex-col items-center justify-center h-64 gap-4 text-brand">
                  <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  <p className="font-black uppercase tracking-[0.2em] text-xs">Syncing Developer Workspace...</p>
                </div> : 
                 currentView === 'settings' ? <SettingsView /> : currentView === 'documents' ? <DocumentsView /> : currentView === 'activity' ? <ActivityView /> : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <StatCard icon={<Github size={24} />} label="Linked Projects" value={String(repos.length)} trend="Live" />
                            <StatCard icon={<FileText size={24} />} label="Docs Library" value={String(repos.reduce((acc, r) => acc + r.docCount, 0))} trend="+Total" />
                            <StatCard icon={<Zap size={24} />} label="Engine Load" value="Optimal" trend="Gemini 3" />
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                            <div className="xl:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                  <h2 className="text-xl font-black uppercase tracking-[0.1em] text-white flex items-center gap-2"><Github className="w-5 h-5 text-brand" /> {user?.handle}'s Repositories</h2>
                                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{repos.length} Total</span>
                                </div>
                                <div className="grid gap-5">
                                    {repos.length === 0 ? (
                                      <div className="p-12 bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl text-center">
                                        <Github className="w-12 h-12 mx-auto text-zinc-800 mb-4" />
                                        <p className="text-zinc-500 font-bold mb-6">No repositories imported yet.</p>
                                        <button onClick={() => setIsAddRepoOpen(true)} className="px-8 py-3 bg-brand text-white rounded-xl font-black uppercase text-xs">Import Your First Repo</button>
                                      </div>
                                    ) : (
                                      repos.filter(r => r.name.toLowerCase().includes(filter.toLowerCase())).map((repo) => (
                                        <motion.div key={repo.id} layout onClick={() => onRepoSelect(repo.id)} className={`group relative rounded-3xl border-2 transition-all cursor-pointer ${repo.isActive ? 'bg-zinc-900 border-brand/40 shadow-xl' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'} p-6`}>
                                            <div className="flex items-center justify-between gap-6">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        {repo.isPrivate ? <Lock size={16} className="text-amber-500" /> : <Globe size={16} className="text-blue-500" />}
                                                        <h3 className="font-extrabold text-xl text-white group-hover:text-brand truncate">{repo.name}</h3>
                                                        <span className="text-[10px] px-2 py-1 rounded bg-black border border-zinc-800 text-zinc-400 font-black uppercase">{repo.branch}</span>
                                                    </div>
                                                    <p className="text-zinc-400 text-sm mb-5 leading-relaxed line-clamp-2 italic">"{repo.desc}"</p>
                                                    <div className="flex items-center gap-6 text-[11px] text-zinc-500 font-black uppercase">
                                                        <span className="flex items-center gap-1.5"><Clock size={14} /> Updated {repo.lastUpdate}</span>
                                                        <span className="flex items-center gap-1.5 text-green-500"><BookOpen size={14} /> {repo.docCount} Docs Generated</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-5">
                                                    <div onClick={(e) => toggleRepo(repo.id, e)} className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${repo.isActive ? 'bg-brand' : 'bg-zinc-800'}`}>
                                                        <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all ${repo.isActive ? 'translate-x-7' : 'translate-x-0'}`} />
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); setGeneratingRepo(repo); }} className="px-5 py-2.5 bg-brand text-white rounded-xl text-xs font-black uppercase shadow-lg active:scale-95 flex items-center gap-2 transition-all hover:bg-brand/80"><Play size={14} fill="currentColor" /> Analyze Engine</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                      ))
                                    )}
                                </div>
                            </div>
                            <div className="xl:col-span-1">
                                <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-8 flex flex-col min-h-[600px] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                      <Activity size={100} />
                                    </div>
                                    <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white mb-8 flex items-center gap-2 z-10"><Activity className="w-5 h-5 text-brand" /> Engine History</h2>
                                    <div className="space-y-10 relative flex-1 z-10">
                                        <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-zinc-800" />
                                        {activity.length === 0 ? (
                                          <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3">
                                            <GitCommit size={40} />
                                            <p className="text-xs font-black uppercase tracking-widest">Awaiting Events...</p>
                                          </div>
                                        ) : (
                                          activity.slice(0, 8).map((item) => (
                                            <div key={item.id} className="relative pl-12 group">
                                                <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-zinc-900 z-10 transition-transform group-hover:scale-110 ${item.type === 'error' ? 'bg-red-600' : item.type === 'push' ? 'bg-blue-600' : item.type === 'create' ? 'bg-green-600' : 'bg-brand'}`}>
                                                    {item.type === 'push' ? <GitCommit size={12} className="text-white" /> : <CheckCircle size={12} className="text-white" />}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">{item.repo}</p>
                                                    <p className="text-sm text-zinc-100 font-bold mb-1.5 leading-tight">{item.message}</p>
                                                    <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{item.time}</span>
                                                </div>
                                            </div>
                                          ))
                                        )}
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
