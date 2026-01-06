
import React, { useState } from 'react';
import { generateSmartPlan } from '../services/geminiService';
import { AIPlanResponse, Task } from '../types';

interface AIPlannerProps {
  onAddTasks: (tasks: Omit<Task, 'id'>[]) => void;
}

const AIPlanner: React.FC<AIPlannerProps> = ({ onAddTasks }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AIPlanResponse | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setSuggestion(null);
    try {
      const result = await generateSmartPlan(prompt);
      setSuggestion(result);
    } catch (err) {
      console.error(err);
      alert("Houve um erro ao processar seu plano.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!suggestion) return;
    // Fix: Added dueDate to the task objects to satisfy the Omit<Task, 'id'> type requirement.
    const todayStr = new Date().toISOString().split('T')[0];
    const newTasks: Omit<Task, 'id'>[] = suggestion.tasks.map(t => ({
      title: t.title,
      description: t.description,
      priority: t.priority,
      category: t.category,
      completed: false,
      dueDate: todayStr
    }));
    onAddTasks(newTasks);
    setSuggestion(null);
    setPrompt('');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-16 page-transition pb-32">
      <div className="text-center space-y-8">
        <div className="w-28 h-28 bg-azul-pastel rounded-[3.5rem] mx-auto flex items-center justify-center text-6xl shadow-2xl shadow-blue-100/50 animate-bounce duration-[3000ms]">✨</div>
        <div className="space-y-3">
          <h2 className="text-5xl font-black tracking-tighter text-slate-900">Coach iPlanner IA</h2>
          <p className="text-slate-500 text-xl font-medium max-w-lg mx-auto leading-relaxed">Organização sem estresse. Compartilhe seu objetivo e eu desenho o caminho.</p>
        </div>
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[4.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-azul-pastel"></div>
        <textarea
          placeholder="Ex: 'Quero preparar uma maratona mantendo meu rendimento no trabalho e sem esquecer do tempo com a família...'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full text-2xl p-10 bg-slate-50/50 rounded-[3rem] border border-transparent focus:outline-none focus:ring-4 focus:ring-azul-pastel/30 focus:bg-white transition-all resize-none font-semibold tracking-tight leading-snug"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`w-full py-8 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all active:scale-[0.98] ${
            loading || !prompt.trim() 
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-slate-900 text-white hover:bg-black shadow-slate-300'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-4">
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          ) : 'Gerar Meu Plano Agora'}
        </button>
      </div>

      {suggestion && (
        <div className="bg-white border border-slate-100 rounded-[5rem] overflow-hidden custom-shadow animate-in zoom-in duration-1000">
          <div className="bg-azul-pastel/15 p-12 border-b border-azul-pastel/20 relative">
            <div className="absolute top-10 right-10 text-6xl opacity-20">💡</div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <h3 className="text-3xl font-black text-blue-900 tracking-tight">Conselho do iCoach</h3>
            </div>
            <p className="text-blue-800 text-xl font-semibold leading-relaxed italic relative z-10">"{suggestion.insight}"</p>
          </div>
          
          <div className="p-12 space-y-10">
            <div className="space-y-6">
              {suggestion.tasks.map((t, idx) => (
                <div key={idx} className="flex gap-8 p-10 rounded-[4rem] bg-slate-50/50 border border-slate-100/50 hover:bg-white transition-all group hover:shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-lg shadow-sm shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">{idx + 1}</div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-2xl tracking-tight">{t.title}</h4>
                    <p className="text-slate-500 mt-3 text-lg leading-relaxed font-medium">{t.description}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="px-6 py-2 bg-white rounded-full text-[11px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 shadow-sm">{t.category}</span>
                      <span className="px-6 py-2 bg-white rounded-full text-[11px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 shadow-sm">⏱️ {t.estimatedDuration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button 
                onClick={() => setSuggestion(null)}
                className="flex-1 py-6 text-slate-400 font-black text-lg hover:text-slate-600 hover:bg-slate-50 rounded-[2.5rem] transition-all"
              >
                Refazer Pedido
              </button>
              <button 
                onClick={handleApply}
                className="flex-[2] py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all"
              >
                Ativar Planejamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPlanner;
