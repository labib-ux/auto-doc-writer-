import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Cpu, 
  Zap, 
  Bell, 
  Shield, 
  CreditCard, 
  Check, 
  Save
} from 'lucide-react';

const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-gray-300 text-sm">{label}</span>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${checked ? 'bg-brand' : 'bg-white/10'}`}
    >
      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#161616] border border-white/5 rounded-2xl p-6 mb-6"
  >
    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
      <div className="p-2 bg-white/5 rounded-lg text-brand">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    {children}
  </motion.div>
);

export const SettingsView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // State
  const [aiCreativity, setAiCreativity] = useState(50);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-gray-400 mt-1">Manage your account and AI preferences.</p>
        </div>
        <button 
            onClick={handleSave}
            disabled={loading || success}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                success 
                ? 'bg-green-500/20 text-green-400 cursor-default' 
                : 'bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20'
            }`}
        >
            {loading ? (
                <>Saving...</>
            ) : success ? (
                <><Check size={18} /> Saved</>
            ) : (
                <><Save size={18} /> Save Changes</>
            )}
        </button>
      </div>

      <Section title="Profile Information" icon={<User size={20} />}>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase">Display Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input 
                        type="text" 
                        defaultValue="John Doe"
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-brand/50 transition-colors"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input 
                        type="email" 
                        defaultValue="john.doe@example.com"
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-brand/50 transition-colors"
                    />
                </div>
            </div>
        </div>
      </Section>

      <Section title="AI Configuration" icon={<Cpu size={20} />}>
        <div className="space-y-6">
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-200">Creativity vs. Precision</label>
                    <span className="text-xs text-brand font-mono">{aiCreativity}%</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={aiCreativity}
                    onChange={(e) => setAiCreativity(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between mt-1 text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                    <span>Strict</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <Toggle label="Auto-generate docs on push" checked={autoUpdate} onChange={setAutoUpdate} />
                <Toggle label="Include dependency analysis" checked={true} onChange={() => {}} />
                <Toggle label="Generate mermaid diagrams" checked={false} onChange={() => {}} />
            </div>
        </div>
      </Section>

      <Section title="Notifications" icon={<Bell size={20} />}>
         <div className="space-y-2">
            <Toggle label="Email Digests (Weekly)" checked={emailNotifs} onChange={setEmailNotifs} />
            <Toggle label="Push Notifications" checked={pushNotifs} onChange={setPushNotifs} />
            <Toggle label="Failed Generation Alerts" checked={true} onChange={() => {}} />
         </div>
      </Section>

      <Section title="Billing & Plan" icon={<CreditCard size={20} />}>
        <div className="flex items-center justify-between bg-gradient-to-r from-brand/10 to-transparent p-4 rounded-xl border border-brand/20">
            <div>
                <p className="font-bold text-white">Free Developer Plan</p>
                <p className="text-xs text-gray-400 mt-1">5 repositories • 100 generations/mo</p>
            </div>
            <button className="px-4 py-2 bg-white text-brand text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 transition-colors">
                Upgrade
            </button>
        </div>
      </Section>

    </div>
  );
};
