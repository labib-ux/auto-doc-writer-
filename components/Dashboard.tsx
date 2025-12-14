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

// --- Types & Mock Data ---

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

// --- Components ---

interface DashboardProps {
  onLogout: () => void;
  onRepoSelect: (id: number) => void;
}

const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="p-3 bg-white/5 rounded-xl text-brand group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {trend && <span className="text-xs text-green-400 font-mono">{trend}</span>}
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
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [privacyFilter, setPrivacyFilter] = useState<'all' | 'private' | 'public'>('all');
  const [docsFilter, setDocsFilter] = useState<'all' | 'has-docs' | 'no-docs'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '24h' | '7d' | '30d'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const toggleRepo = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setRepos(repos.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const handleAddRepo = (newRepo: any) => {
    const formattedRepo: Repo = {
        id: newRepo.id,
        name: newRepo.name,
        desc: newRepo.desc,
        isPrivate: newRepo.isPrivate,
        isActive: false, // Default to inactive until setup
        lastUpdate: 'Just now',
        branch: 'main',
        docCount: 0
    };
    setRepos([formattedRepo, ...repos]);
  };

  // Helper to parse "2m ago", "1d ago" etc. into minutes for sorting
  const parseRelativeTime = (str: string) => {
    const val = parseInt(str);
    if (isNaN(val)) return 0;
    if (str.includes('m') && !str.includes('mo')) return val; // minutes
    if (str.includes('h')) return val * 60; // hours
    if (str.includes('d')) return val * 1440; // days
    if (str.includes('w')) return val * 10080; // weeks
    if (str.includes('mo')) return val * 43200; // months approx
    return 999999;
  };

  const processedRepos = repos
    .filter(repo => {
      // Text Search
      if (!repo.name.toLowerCase().includes(filter.toLowerCase())) return false;
      
      // Privacy Filter
      if (privacyFilter === 'private' && !repo.isPrivate) return false;
      if (privacyFilter === 'public' && repo.isPrivate) return false;

      // Docs Filter
      if (docsFilter === 'has-docs' && repo.docCount === 0) return false;
      if (docsFilter === 'no-docs' && repo.docCount > 0) return false;

      // Date Range Filter
      const minsAgo = parseRelativeTime(repo.lastUpdate);
      if (dateFilter === '24h' && minsAgo > 1440) return false;
      if (dateFilter === '7d' && minsAgo > 10080) return false;
      if (dateFilter === '30d' && minsAgo > 43200) return false;

      return true;
    })
    .sort((a, b) => {
      const timeA = parseRelativeTime(a.lastUpdate);
      const timeB = parseRelativeTime(b.lastUpdate);
      return sortOrder === 'newest' ? timeA - timeB : timeB - timeA;
    });

  const SidebarContent = () => (
    <>
        <div className="p-8">
          <div className="text-2xl font-bold font-mono tracking-tighter mb-1">
            AutoDoc<span className="text-brand">Writer</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Workspace</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => { setCurrentView('overview'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                currentView === 'overview' 
                ? 'bg-brand text-white shadow-[0_0_20px_-5px_rgba(87,57,251,0.5)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
             onClick={() => { setCurrentView('documents'); setIsMobileMenuOpen(false); }}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                currentView === 'documents' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">My Documents</span>
          </button>
          <button 
            onClick={() => { setCurrentView('activity'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                currentView === 'activity' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <Activity size={20} />
            <span className="font-medium">Activity Log</span>
          </button>
          <button 
            onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                currentView === 'settings' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
           <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand to-purple-400 flex items-center justify-center font-bold text-sm shadow-lg">JD</div>
               <div className="flex-1 min-w-0">
                   <p className="text-sm font-semibold truncate">John Doe</p>
                   <p className="text-xs text-gray-500 truncate font-mono">Free Plan</p>
               </div>
           </div>
           <button 
             onClick={onLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
           >
             <LogOut size={14} /> Sign Out
           </button>
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-darker flex text-white font-sans overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      
      <AddRepositoryModal 
        isOpen={isAddRepoOpen} 
        onClose={() => setIsAddRepoOpen(false)} 
        onImport={handleAddRepo}
      />

      <GenerateDocsModal 
        isOpen={!!generatingRepo} 
        repo={generatingRepo} 
        onClose={() => setGeneratingRepo(null)} 
      />

      {/* Sidebar - Desktop */}
      <div className="w-72 bg-[#121212]/95 backdrop-blur-xl border-r border-white/5 flex flex-col hidden md:flex relative z-20">
        <SidebarContent />
      </div>

      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                />
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="fixed top-0 left-0 bottom-0 w-72 bg-[#121212] border-r border-white/10 z-50 md:hidden flex flex-col"
                >
                     <div className="absolute top-4 right-4">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                     </div>
                     <SidebarContent />
                </motion.div>
            </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-brand/5 blur-[100px] -z-10 pointer-events-none" />

        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-12 z-10 shrink-0">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                >
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold capitalize">{currentView.replace('-', ' ')}</h1>
                    {currentView === 'overview' && <p className="text-sm text-gray-500 hidden sm:block">Welcome back, here's what's happening.</p>}
                </div>
            </div>
            
            {currentView === 'overview' && (
                <div className="flex items-center gap-4">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-brand transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-[#1a1a1a] border border-white/10 rounded-full pl-11 pr-6 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 w-48 lg:w-80 transition-all shadow-lg"
                        />
                    </div>
                    
                    <div className="flex bg-[#1a1a1a] border border-white/10 rounded-full p-1 hidden sm:flex">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>

                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 border rounded-full transition-all active:scale-95 ${showFilters ? 'bg-brand text-white border-brand' : 'bg-[#1a1a1a] text-gray-400 border-white/10 hover:text-white hover:bg-white/5'}`}
                    >
                        <SlidersHorizontal size={18} />
                    </button>

                    <button 
                        onClick={() => setIsAddRepoOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-full font-medium shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:bg-brand/90 transition-all active:scale-95"
                    >
                        <Plus size={18} /> <span className="hidden sm:inline">Import</span>
                    </button>
                </div>
            )}
        </header>

        {/* Dashboard Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {currentView === 'settings' ? (
                    <SettingsView />
                ) : currentView === 'documents' ? (
                    <DocumentsView />
                ) : currentView === 'activity' ? (
                    <ActivityView />
                ) : currentView === 'overview' ? (
                    <div className="space-y-10">
                        {/* 1. Quick Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard icon={<Github size={24} />} label="Active Repositories" value={String(repos.filter(r => r.isActive).length)} trend="+1 this week" />
                            <StatCard icon={<FileText size={24} />} label="Docs Generated" value="41" trend="+12% vs last mo" />
                            <StatCard icon={<Zap size={24} />} label="Time Saved" value="18 hrs" trend="Est. manual time" />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            
                            {/* 2. Repository List (Main Column) */}
                            <div className="xl:col-span-2 space-y-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                                            <Github className="w-5 h-5 text-gray-500" /> Repositories
                                        </h2>
                                        {!showFilters && (
                                            <div className="text-xs font-mono text-gray-500 flex gap-4">
                                                <span><span className="text-brand">●</span> Active</span>
                                                <span><span className="text-gray-600">●</span> Inactive</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Collapsible Filter Bar */}
                                    <AnimatePresence>
                                        {showFilters && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="bg-[#1a1a1a]/50 border border-white/5 rounded-xl p-4 flex flex-wrap gap-4 items-center mb-2">
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 min-w-[80px]">
                                                        <Filter size={14} /> <span className="font-mono text-xs uppercase tracking-wider">Filter:</span>
                                                    </div>
                                                    
                                                    {/* Privacy Select */}
                                                    <div className="flex bg-[#121212] rounded-lg p-1 border border-white/10">
                                                        <button 
                                                            onClick={() => setPrivacyFilter('all')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${privacyFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                                        >All</button>
                                                        <button 
                                                            onClick={() => setPrivacyFilter('public')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${privacyFilter === 'public' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-white'}`}
                                                        >Public</button>
                                                        <button 
                                                            onClick={() => setPrivacyFilter('private')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${privacyFilter === 'private' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-white'}`}
                                                        >Private</button>
                                                    </div>

                                                    {/* Docs Status Select */}
                                                    <div className="flex bg-[#121212] rounded-lg p-1 border border-white/10">
                                                        <button 
                                                            onClick={() => setDocsFilter('all')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${docsFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                                        >All</button>
                                                        <button 
                                                            onClick={() => setDocsFilter('has-docs')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${docsFilter === 'has-docs' ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-white'}`}
                                                        >Has Docs</button>
                                                        <button 
                                                            onClick={() => setDocsFilter('no-docs')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${docsFilter === 'no-docs' ? 'bg-red-500/20 text-red-400' : 'text-gray-500 hover:text-white'}`}
                                                        >No Docs</button>
                                                    </div>

                                                    {/* Time Range Select */}
                                                    <div className="flex bg-[#121212] rounded-lg p-1 border border-white/10">
                                                        <button 
                                                            onClick={() => setDateFilter('all')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${dateFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                                        >All Time</button>
                                                        <button 
                                                            onClick={() => setDateFilter('24h')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${dateFilter === '24h' ? 'bg-brand/20 text-brand' : 'text-gray-500 hover:text-white'}`}
                                                        >24h</button>
                                                        <button 
                                                            onClick={() => setDateFilter('7d')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${dateFilter === '7d' ? 'bg-brand/20 text-brand' : 'text-gray-500 hover:text-white'}`}
                                                        >7d</button>
                                                        <button 
                                                            onClick={() => setDateFilter('30d')}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${dateFilter === '30d' ? 'bg-brand/20 text-brand' : 'text-gray-500 hover:text-white'}`}
                                                        >30d</button>
                                                    </div>

                                                    <div className="hidden md:block w-px h-6 bg-white/10 mx-2" />

                                                    {/* Sort Order */}
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 min-w-[80px]">
                                                        <ArrowDownUp size={14} /> <span className="font-mono text-xs uppercase tracking-wider">Sort:</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:border-brand/50 transition-all min-w-[100px] justify-between"
                                                    >
                                                        {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                                                        <ChevronDown size={12} className={`transition-transform ${sortOrder === 'oldest' ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className={`grid gap-4 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1'}`}>
                                    <AnimatePresence mode="popLayout">
                                    {processedRepos.length === 0 ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }}
                                            className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-gray-500"
                                        >
                                            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            No repositories match your filters.
                                        </motion.div>
                                    ) : (
                                        processedRepos.map((repo) => (
                                        <motion.div 
                                            key={repo.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            onClick={() => onRepoSelect(repo.id)}
                                            className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                                                repo.isActive 
                                                ? 'bg-[#1e1e1e]/80 border-brand/40 shadow-[0_0_30px_-10px_rgba(87,57,251,0.15)]' 
                                                : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                                            } ${viewMode === 'list' ? 'p-4' : 'p-6'}`}
                                        >
                                            {/* Active Glow Effect */}
                                            {repo.isActive && <div className="absolute -left-1 top-0 bottom-0 w-1 bg-brand shadow-[0_0_15px_rgba(87,57,251,0.8)]" />}

                                            <div className={`flex items-center gap-6 relative z-10 ${viewMode === 'list' ? 'justify-between' : 'flex-col md:flex-row'}`}>
                                                
                                                {/* 3D Visual Indicator (Grid only) */}
                                                {viewMode === 'grid' && (
                                                    <div className="hidden md:block w-16 h-16 shrink-0 bg-white/5 rounded-xl border border-white/5 overflow-hidden relative group-hover:border-white/10 transition-colors">
                                                    <Canvas dpr={[1, 2]}>
                                                        <ambientLight intensity={0.8} />
                                                        <pointLight position={[5, 5, 5]} intensity={1} />
                                                        <Shape 
                                                        type={repo.id % 3 === 0 ? 'box' : repo.id % 3 === 1 ? 'sphere' : 'torus'} 
                                                        color={repo.isActive ? '#5739fb' : '#404040'} 
                                                        />
                                                    </Canvas>
                                                    </div>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        {repo.isPrivate ? <Lock size={14} className="text-amber-400/80" /> : <Globe size={14} className="text-blue-400/80" />}
                                                        <h3 className="font-bold text-lg tracking-tight group-hover:text-brand transition-colors truncate">{repo.name}</h3>
                                                        <span className="text-[10px] px-2 py-0.5 rounded border border-white/10 bg-black/20 text-gray-400 font-mono flex items-center gap-1 shrink-0">
                                                            <GitCommit size={10} /> {repo.branch}
                                                        </span>
                                                    </div>
                                                    {viewMode === 'grid' && <p className="text-gray-400 text-sm mb-4 max-w-lg">{repo.desc}</p>}
                                                    
                                                    <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
                                                        <span className="flex items-center gap-1.5">
                                                        <Clock size={12} /> {repo.lastUpdate}
                                                        </span>
                                                        <span className={`flex items-center gap-1.5 ${repo.docCount > 0 ? 'text-green-400' : ''}`}>
                                                        <BookOpen size={12} /> {repo.docCount} Docs
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 self-start md:self-center">
                                                    {/* Monitoring Switch */}
                                                    <div 
                                                        onClick={(e) => toggleRepo(repo.id, e)}
                                                        className={`relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300 border border-transparent ${
                                                        repo.isActive ? 'bg-brand/20 border-brand/50' : 'bg-black/40 border-white/10'
                                                        }`}
                                                    >
                                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full shadow-md transition-all duration-300 ${
                                                        repo.isActive ? 'translate-x-7 bg-brand shadow-[0_0_10px_rgba(87,57,251,0.5)]' : 'translate-x-0 bg-gray-500'
                                                        }`} />
                                                    </div>
                                                    
                                                    {repo.isActive ? (
                                                    <div className="flex gap-2">
                                                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors tooltip" title="View Docs">
                                                            <ArrowUpRight size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setGeneratingRepo(repo);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 bg-brand text-white hover:bg-brand/90 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40"
                                                        >
                                                            <Play size={12} fill="currentColor" /> <span className="hidden sm:inline">Generate</span>
                                                        </button>
                                                    </div>
                                                    ) : (
                                                    <div className="w-[100px] hidden sm:block" /> /* Spacer */
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                        ))
                                    )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* 3. Live Activity Feed (Right Column) */}
                            <div className="xl:col-span-1">
                                <div className="bg-[#161616]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full min-h-[500px] flex flex-col">
                                    <h2 className="text-lg font-medium text-gray-200 mb-6 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-brand" /> Activity Log
                                    </h2>
                                    
                                    <div className="space-y-8 relative flex-1">
                                        {/* Continuous Timeline Line */}
                                        <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

                                        {mockActivity.map((item, idx) => (
                                            <motion.div 
                                                key={item.id}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="relative pl-10"
                                            >
                                                <div className={`
                                                    absolute left-0 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-[#161616] z-10
                                                    ${item.type === 'push' ? 'bg-blue-500/10 text-blue-400' : ''}
                                                    ${item.type === 'gen' ? 'bg-brand/10 text-brand' : ''}
                                                    ${item.type === 'error' ? 'bg-red-500/10 text-red-400' : ''}
                                                `}>
                                                    {item.type === 'push' && <GitCommit size={14} />}
                                                    {item.type === 'gen' && <CheckCircle size={14} />}
                                                    {item.type === 'error' && <AlertCircle size={14} />}
                                                </div>
                                                
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">{item.repo}</p>
                                                    <p className="text-sm text-gray-300 leading-snug mb-1 font-medium">{item.message}</p>
                                                    <span className="text-[10px] text-gray-600 font-mono">{item.time}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    
                                    <button className="mt-6 w-full py-3 text-xs font-medium text-gray-500 hover:text-white border-t border-white/5 transition-colors">
                                        View Full History
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                        <Activity className="w-16 h-16 mb-4 opacity-20" />
                        <h2 className="text-xl font-bold mb-2">Work in Progress</h2>
                        <p>The {currentView} view is coming soon.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};