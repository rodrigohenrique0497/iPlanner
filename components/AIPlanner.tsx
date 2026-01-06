
import React, { useState } from 'react';
import { AIPlanResponse, Task, Priority } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const generateSmartPlan = async (prompt: string): Promise<AIPlanResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Aja como um coach de produtividade e crie um plano para o seguinte objetivo: "${prompt}".`,
    config: {
      systemInstruction: "Você é um coach de produtividade altamente eficiente chamado iCoach. Sua missão é transformar objetivos vagos em planos de ação claros e motivadores. Forneça um insight estratégico curto e uma lista de 3 a 5 tarefas concretas.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insight: {
            type: Type.STRING,
            description: "Um insight motivador e estratégico sobre o objetivo do usuário."
          },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Título claro da tarefa." },
                description: { type: Type.STRING, description: "Breve explicação de como realizar a tarefa." },
                priority: { type: Type.STRING, enum: ['low', 'medium', 'high'], description: "Prioridade da tarefa." },
                category: { type: Type.STRING, description: "Categoria da tarefa (ex: Trabalho, Saúde, Pessoal)." },
                estimatedDuration: { type: Type.STRING, description: "Tempo estimado (ex: 30min, 2h)." },
              },
              required: ['title', 'description', 'priority', 'category', 'estimatedDuration']
            }
          }
        },
        required: ['insight', 'tasks']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("IA retornou uma resposta vazia.");
  return JSON.parse(text.trim());
};

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
    const todayStr = new Date().toISOString().split('T')[0];
    const newTasks: Omit<Task, 'id'>[] = suggestion.tasks.map(t => ({
      title: t.title,
      description: t.description,
      priority: t.priority as Priority,
      category: t.category,
      completed: false,
      dueDate: todayStr
    }));
    onAddTasks(newTasks);
    setSuggestion(null);
    setPrompt('');
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-16 page-transition pb-40">
      <div className="text-center space-y-10">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-theme-accent/5 rounded-[3.5rem] flex items-center justify-center text-7xl shadow-premium animate-pulse duration-[4000ms]">✨</div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-theme-accent rounded-[1.25rem] flex items-center justify-center text-theme-card shadow-glow">
             <span className="material-symbols-outlined !text-2xl">auto_fix_high</span>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-6xl font-black tracking-tighter text-theme-text leading-none">iCoach Inteligência</h2>
          <p className="text-theme-muted text-xl font-medium max-w-xl mx-auto leading-relaxed opacity-70 italic">Sua visão, nossa estrutura. Transformamos o caos em passos claros.</p>
        </div>
      </div>

      <div className="bg-theme-card p-12 md:p-16 rounded-[4rem] border border-theme-border shadow-premium space-y-10 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-3 h-full bg-theme-accent opacity-20 group-hover:opacity-100 transition-opacity"></div>
        <textarea
          placeholder="O que você quer realizar? Descreva em detalhes seu objetivo..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full text-2xl p-10 bg-theme-bg rounded-[3rem] border-2 border-transparent focus:outline-none focus:ring-8 focus:ring-theme-accent-soft focus:bg-theme-card focus:border-theme-accent transition-all resize-none font-bold tracking-tight leading-snug text-theme-text placeholder:text-theme-muted/30"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`w-full py-8 rounded-[2.5rem] font-black text-xl shadow-premium transition-all active:scale-[0.98] flex items-center justify-center gap-4 ${
            loading || !prompt.trim() 
              ? 'bg-theme-border text-theme-muted cursor-not-allowed' 
              : 'bg-theme-accent text-theme-card hover:opacity-90 shadow-glow'
          }`}
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-4 border-theme-card/20 border-t-theme-card rounded-full animate-spin"></div>
              <span>Processando Estratégia...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined !text-3xl">rocket_launch</span>
              Gerar Plano Mestre
            </>
          )}
        </button>
      </div>

      {suggestion && (
        <div className="bg-theme-card border border-theme-border rounded-[5rem] overflow-hidden shadow-premium animate-in zoom-in duration-700">
          <div className="bg-theme-accent/5 p-16 border-b border-theme-border relative">
            <div className="absolute top-10 right-10 text-8xl opacity-[0.03] select-none">PLANNER</div>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-theme-accent rounded-2xl flex items-center justify-center text-theme-card shadow-glow">
                <span className="material-symbols-outlined !text-3xl">lightbulb</span>
              </div>
              <h3 className="text-3xl font-black text-theme-text tracking-tight">Análise do iCoach</h3>
            </div>
            <p className="text-theme-text text-2xl font-bold leading-relaxed italic max-w-3xl border-l-8 border-theme-accent pl-10 py-4 bg-theme-accent-soft/30 rounded-r-[2rem]">
              "{suggestion.insight}"
            </p>
          </div>
          
          <div className="p-16 space-y-12">
            <div className="grid grid-cols-1 gap-6">
              {suggestion.tasks.map((t, idx) => (
                <div key={idx} className="flex gap-10 p-10 rounded-[3.5rem] bg-theme-bg border border-theme-border hover:border-theme-accent/20 transition-all group shadow-sm">
                  <div className="w-16 h-16 rounded-[1.75rem] bg-theme-card flex items-center justify-center font-black text-xl shadow-sm border border-theme-border shrink-0 group-hover:scale-110 transition-all text-theme-text">
                    0{idx + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h4 className="font-black text-theme-text text-3xl tracking-tighter">{t.title}</h4>
                      <div className="flex gap-3">
                         <span className="px-5 py-2 bg-theme-card rounded-full text-[10px] font-black uppercase tracking-widest text-theme-muted border border-theme-border">{t.category}</span>
                         <span className="px-5 py-2 bg-theme-accent text-theme-card rounded-full text-[10px] font-black uppercase tracking-widest">⏱️ {t.estimatedDuration}</span>
                      </div>
                    </div>
                    <p className="text-theme-muted text-xl font-medium leading-relaxed opacity-80">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-10">
              <button 
                onClick={() => setSuggestion(null)}
                className="flex-1 py-7 text-theme-muted font-black text-sm uppercase tracking-widest hover:text-theme-text hover:bg-theme-bg rounded-[2.5rem] transition-all"
              >
                Refinar Pedido
              </button>
              <button 
                onClick={handleApply}
                className="flex-[2] py-7 bg-theme-accent text-theme-card rounded-[2.5rem] font-black text-xl shadow-glow hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-[0.2em]"
              >
                Injetar no Meu Planner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPlanner;
