
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { api, ActivityItem } from '../lib/api';

export const ActivityView: React.FC = () => {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const fetched = await api.getActivity();
      setActivity(fetched);
      setIsLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Activity Log</h2>
        <p className="text-gray-400 mt-1">Real-time history of repository events and workspace generations.</p>
      </div>

      {isLoading ? (
          <div className="text-brand font-black animate-pulse">LOADING LOGS...</div>
      ) : activity.length === 0 ? (
          <div className="text-zinc-600 font-bold italic">No activity recorded. Start by importing a repository.</div>
      ) : (
          <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-8">
            {activity.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="relative pl-8 md:pl-12">
                    <div className={`absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full border-4 border-[#121212] z-10
                        ${item.type === 'push' ? 'bg-blue-500' : ''}
                        ${item.type === 'gen' ? 'bg-brand' : ''}
                        ${item.type === 'error' ? 'bg-red-500' : ''}
                        ${item.type === 'system' ? 'bg-gray-500' : ''}
                        ${item.type === 'create' ? 'bg-green-500' : ''}
                    `} />
                    <div className="bg-[#161616] border border-white/5 rounded-xl p-4 md:p-6 hover:border-white/10 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded
                                    ${item.type === 'push' ? 'bg-blue-500/10 text-blue-400' : ''}
                                    ${item.type === 'gen' ? 'bg-brand/10 text-brand' : ''}
                                    ${item.type === 'error' ? 'bg-red-500/10 text-red-400' : ''}
                                    ${item.type === 'system' ? 'bg-gray-500/10 text-gray-400' : ''}
                                    ${item.type === 'create' ? 'bg-green-500/10 text-green-400' : ''}
                                `}>
                                    {item.type}
                                </span>
                                <span className="text-sm font-mono text-gray-500">{item.time}</span>
                            </div>
                            {item.repo !== '-' && (
                                <div className="text-xs text-gray-400 flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                                    <span className="opacity-50">repo:</span> {item.repo}
                                </div>
                            )}
                        </div>
                        <h3 className="text-white font-medium mb-1">{item.message}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            {item.user && <span>User: <span className="text-gray-300">{item.user}</span></span>}
                        </div>
                    </div>
                </motion.div>
            ))}
          </div>
      )}
    </div>
  );
};
