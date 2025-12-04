import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LockDefinition, ThreadState } from '../types';
import { Lock, Unlock, Loader2, Play, RefreshCw, AlertCircle } from 'lucide-react';

interface VisualizerProps {
  selectedLock: LockDefinition;
}

const Visualizer: React.FC<VisualizerProps> = ({ selectedLock }) => {
  const [threads, setThreads] = useState<ThreadState[]>([
    { id: 1, status: 'IDLE', name: 'Thread A', waitCount: 0 },
    { id: 2, status: 'IDLE', name: 'Thread B', waitCount: 0 },
    { id: 3, status: 'IDLE', name: 'Thread C', waitCount: 0 },
  ]);
  const [resourceOwner, setResourceOwner] = useState<number | null>(null); // Only for Mutex/Spin
  const [readers, setReaders] = useState<number[]>([]); // For RW Lock
  const [writer, setWriter] = useState<number | null>(null); // For RW Lock
  const [logs, setLogs] = useState<string[]>([]);

  // Reset state when lock type changes
  useEffect(() => {
    setResourceOwner(null);
    setReaders([]);
    setWriter(null);
    setThreads(prev => prev.map(t => ({ ...t, status: 'IDLE', waitCount: 0 })));
    setLogs([`切换模拟模式: ${selectedLock.name}`]);
  }, [selectedLock]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const attemptLock = useCallback((threadId: number, type: 'READ' | 'WRITE' = 'WRITE') => {
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, status: 'WAITING' } : t));
    
    // Simulation Logic
    setTimeout(() => {
      if (selectedLock.simulationType === 'READ_WRITE') {
        handleRWLock(threadId, type);
      } else {
        handleMutexSpinLock(threadId);
      }
    }, 500);
  }, [selectedLock, resourceOwner, readers, writer]);

  const handleMutexSpinLock = (threadId: number) => {
    // If spinlock, we might fail and retry (simulated visually by staying in waiting)
    // But for simplified UX, we check availability immediately
    setResourceOwner(currentOwner => {
        if (currentOwner === null) {
            setThreads(prev => prev.map(t => t.id === threadId ? { ...t, status: 'ACQUIRED' } : t));
            addLog(`线程 ${threadId} 获取了锁`);
            return threadId;
        } else {
            addLog(`线程 ${threadId} 获取失败 (被占用)`);
            setThreads(prev => prev.map(t => t.id === threadId ? { ...t, status: 'WAITING', waitCount: t.waitCount + 1 } : t));
            return currentOwner;
        }
    });
  };

  const handleRWLock = (threadId: number, type: 'READ' | 'WRITE') => {
    if (type === 'READ') {
        // Can acquire if no writer
        setWriter(currentWriter => {
            if (currentWriter === null) {
                setReaders(prev => {
                   setThreads(ts => ts.map(t => t.id === threadId ? { ...t, status: 'READING' } : t));
                   addLog(`线程 ${threadId} 获取读锁`);
                   return [...prev, threadId];
                });
                return null;
            } else {
                addLog(`线程 ${threadId} 读锁获取失败 (有写者)`);
                setThreads(prev => prev.map(t => t.id === threadId ? { ...t, status: 'WAITING' } : t));
                return currentWriter;
            }
        });
    } else {
        // Can acquire if no readers and no writer
        setWriter(currentWriter => {
             // We need to check readers inside the setter or use a ref, but for React batching, let's use the current state from closure but rely on effect or simple logic check
             // Note: In real React code, dependent state checks like this inside setStates are tricky. 
             // We will check the external state here since this is a simulation handler.
             if (currentWriter === null && readers.length === 0) {
                 setThreads(ts => ts.map(t => t.id === threadId ? { ...t, status: 'WRITING' } : t));
                 addLog(`线程 ${threadId} 获取写锁`);
                 return threadId;
             } else {
                 addLog(`线程 ${threadId} 写锁获取失败`);
                 setThreads(prev => prev.map(t => t.id === threadId ? { ...t, status: 'WAITING' } : t));
                 return currentWriter;
             }
        });
    }
  };

  const releaseLock = (threadId: number) => {
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, status: 'IDLE', waitCount: 0 } : t));
    
    if (selectedLock.simulationType === 'READ_WRITE') {
        setWriter(w => w === threadId ? null : w);
        setReaders(r => r.filter(id => id !== threadId));
        addLog(`线程 ${threadId} 释放了锁`);
    } else {
        setResourceOwner(owner => owner === threadId ? null : owner);
        addLog(`线程 ${threadId} 释放了锁`);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-green-400" />
          交互模拟: {selectedLock.name}
        </h3>
        <div className="flex gap-2">
            <button 
                onClick={() => {
                    setResourceOwner(null); 
                    setReaders([]); 
                    setWriter(null);
                    setThreads(t => t.map(th => ({...th, status: 'IDLE', waitCount: 0})));
                    addLog('模拟重置');
                }}
                className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
            >
                重置
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thread Controls */}
        <div className="space-y-4">
          <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">线程控制</h4>
          {threads.map(thread => (
            <div key={thread.id} className="bg-slate-700/50 p-3 rounded-lg flex items-center justify-between border border-slate-600">
              <div>
                <div className="font-mono text-sm text-slate-200">{thread.name}</div>
                <div className={`text-xs mt-1 font-bold
                  ${thread.status === 'IDLE' ? 'text-slate-500' : ''}
                  ${thread.status === 'WAITING' ? 'text-amber-500' : ''}
                  ${thread.status === 'ACQUIRED' || thread.status === 'WRITING' ? 'text-green-400' : ''}
                  ${thread.status === 'READING' ? 'text-blue-400' : ''}
                `}>
                  {thread.status === 'WAITING' && selectedLock.simulationType === 'SPIN' ? `自旋中 (${thread.waitCount})...` : thread.status}
                </div>
              </div>
              
              <div className="flex gap-1">
                {thread.status === 'IDLE' || thread.status === 'WAITING' ? (
                  <>
                    {selectedLock.simulationType === 'READ_WRITE' ? (
                        <>
                             <button 
                                onClick={() => attemptLock(thread.id, 'READ')}
                                className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors text-xs"
                                title="获取读锁"
                            >
                                读
                            </button>
                            <button 
                                onClick={() => attemptLock(thread.id, 'WRITE')}
                                className="p-2 bg-red-600 hover:bg-red-500 rounded text-white transition-colors text-xs"
                                title="获取写锁"
                            >
                                写
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => attemptLock(thread.id)}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white transition-colors"
                            title="获取锁"
                        >
                            <Lock className="w-4 h-4" />
                        </button>
                    )}
                   
                  </>
                ) : (
                  <button 
                    onClick={() => releaseLock(thread.id)}
                    className="p-2 bg-slate-600 hover:bg-slate-500 rounded text-white transition-colors"
                    title="释放锁"
                  >
                    <Unlock className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Central Resource Visualization */}
        <div className="md:col-span-2 bg-slate-900 rounded-lg p-6 relative flex flex-col items-center justify-center border border-slate-800 min-h-[300px]">
           <div className="absolute top-4 left-4 text-slate-500 text-xs font-mono">CRITICAL SECTION (共享资源)</div>
           
           {/* Resource Object */}
           <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 mb-8
             ${resourceOwner || writer ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] bg-red-900/20' : ''}
             ${readers.length > 0 ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-blue-900/20' : ''}
             ${!resourceOwner && !writer && readers.length === 0 ? 'border-slate-600 bg-slate-800' : ''}
           `}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">DATA</div>
                <div className="text-xs text-slate-400">
                    {writer ? `被线程 ${writer} 修改中` : 
                     resourceOwner ? `被线程 ${resourceOwner} 锁定` :
                     readers.length > 0 ? `${readers.length} 个读者正在读取` : '空闲'}
                </div>
              </div>
           </div>

           {/* Queue / Waiting Area */}
           <div className="w-full mt-4">
              <div className="text-center text-xs text-slate-500 mb-2">等待队列 / 自旋区</div>
              <div className="flex justify-center gap-2 min-h-[40px] bg-slate-950/50 p-2 rounded-lg border border-slate-800 border-dashed">
                 {threads.filter(t => t.status === 'WAITING').map(t => (
                     <div key={t.id} className="px-3 py-1 bg-amber-900/40 text-amber-500 border border-amber-800 rounded text-xs flex items-center gap-1 animate-pulse">
                        {selectedLock.simulationType === 'SPIN' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                        {t.name}
                     </div>
                 ))}
                 {threads.filter(t => t.status === 'WAITING').length === 0 && (
                     <span className="text-slate-600 text-xs italic py-1">无等待线程</span>
                 )}
              </div>
           </div>

           {/* Console Logs */}
           <div className="w-full mt-4 bg-black/40 rounded p-2 text-xs font-mono text-green-400 h-24 overflow-hidden border border-slate-800">
             {logs.map((log, i) => (
               <div key={i} className="opacity-80">> {log}</div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
