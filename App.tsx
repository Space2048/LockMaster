import React, { useState } from 'react';
import { LOCK_DATA } from './constants';
import { LockDefinition, LockCategory } from './types';
import Visualizer from './components/Visualizer';
import CodeGenerator from './components/CodeGenerator';
import { Cpu, ShieldCheck, Lock as LockIcon, Info } from 'lucide-react';

const App: React.FC = () => {
  const [selectedLockId, setSelectedLockId] = useState<string>(LOCK_DATA[0].id);
  const selectedLock = LOCK_DATA.find(l => l.id === selectedLockId) || LOCK_DATA[0];

  const categories = Array.from(new Set(LOCK_DATA.map(l => l.category)));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              LockMaster
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            计算机科学锁机制交互式指南
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Navigation */}
          <div className="lg:col-span-3 space-y-6">
             <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">选择锁类型</h2>
                <div className="space-y-6">
                    {categories.map(cat => (
                        <div key={cat}>
                            <h3 className="text-xs font-bold text-slate-500 mb-2 px-2">{cat}</h3>
                            <div className="space-y-1">
                                {LOCK_DATA.filter(l => l.category === cat).map(lock => (
                                    <button
                                        key={lock.id}
                                        onClick={() => setSelectedLockId(lock.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2
                                            ${selectedLockId === lock.id 
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                            }
                                        `}
                                    >
                                        <LockIcon className="w-3 h-3" />
                                        {lock.name.split(' ')[0]} 
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Header Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 border border-indigo-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Cpu className="w-32 h-32 text-indigo-400" />
                </div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-4">
                        {selectedLock.category}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedLock.name}</h2>
                    <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                        {selectedLock.fullDesc}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-slate-950/50 rounded-lg p-4 border border-emerald-900/30">
                            <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 优点 (Pros)
                            </h4>
                            <ul className="list-none space-y-1">
                                {selectedLock.pros.map((p, i) => (
                                    <li key={i} className="text-slate-400 text-sm pl-4 relative before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-slate-600 before:rounded-full">
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-950/50 rounded-lg p-4 border border-rose-900/30">
                            <h4 className="text-rose-400 font-semibold mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 缺点 (Cons)
                            </h4>
                            <ul className="list-none space-y-1">
                                {selectedLock.cons.map((c, i) => (
                                    <li key={i} className="text-slate-400 text-sm pl-4 relative before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-slate-600 before:rounded-full">
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulation Section */}
            <Visualizer selectedLock={selectedLock} />

            {/* Code Generation Section */}
            <div className="h-full">
                <CodeGenerator selectedLock={selectedLock} />
            </div>

            {/* Footer info */}
            <div className="flex items-center gap-2 text-slate-500 text-sm p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <Info className="w-4 h-4" />
                <p>注意：这里的可视化仅用于教育目的，实际操作系统的锁调度要复杂得多。</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
