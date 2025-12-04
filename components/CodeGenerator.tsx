import React, { useState } from 'react';
import { generateCodeExample } from '../services/geminiService';
import { LockDefinition } from '../types';
import { Code, Terminal, Clipboard, Check } from 'lucide-react';
import { LANGUAGES } from '../constants';

interface CodeGeneratorProps {
  selectedLock: LockDefinition;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ selectedLock }) => {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setCode('');
    const result = await generateCodeExample(selectedLock.name, selectedLang);
    setCode(result);
    setLoading(false);
  };

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            AI 代码生成器
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            由 Google Gemini 提供支持，生成标准库示例。
          </p>
        </div>
       
        <div className="flex items-center gap-2">
          <select 
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-all
              ${loading 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20'
              }`}
          >
            {loading ? '生成中...' : '生成示例'}
            {!loading && <Code className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 p-0 overflow-auto min-h-[400px] relative group">
        {!code && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <Code className="w-16 h-16 mb-4 opacity-20" />
            <p>选择语言并点击生成以查看代码示例</p>
          </div>
        )}
        
        {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-400 space-y-4">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></div>
                <p className="text-sm font-mono animate-pulse">正在询问 Gemini 模型...</p>
             </div>
        )}

        {code && (
          <>
            <button 
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-slate-800 rounded text-slate-400 hover:text-white border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="复制"
            >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Clipboard className="w-4 h-4" />}
            </button>
            <div className="p-6 font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {code}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CodeGenerator;
