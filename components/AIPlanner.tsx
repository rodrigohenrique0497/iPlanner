import React, { useState } from 'react';
// Import corrected and Priority added for casting
import { AIPlanResponse, Task, Priority } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// Implemented local generation logic following Gemini SDK guidelines to avoid missing service dependency
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
      priority: t.priority as Priority, // Casted to ensure type safety with Priority enum
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
        <div className="w-28 h-28 bg-theme-accent/10 rounded-[3.5rem] mx-auto flex items-center justify-center text-6xl shadow-2xl shadow-theme-accent/20 animate-bounce duration-[3000ms]">✨</div>
        <div className="space-y-3">
          <h2 className="text-5xl font-black tracking-tighter text-theme-text">Coach iPlanner IA</h2>
          <p className="text-theme-muted text-xl font-medium max-w-lg mx-auto leading-relaxed">Organização sem estresse. Compartilhe seu objetivo e eu desenho o caminho.</p>
        </div>
      </div>

      <div className="bg-theme-card p-10 md:p-14 rounded-[4.5rem] border border-theme-border shadow-2xl shadow-theme-accent/5 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-theme-accent"></div>
        <textarea
          placeholder="Ex: 'Quero preparar uma maratona mantendo meu rendimento no trabalho e sem esquecer do tempo com a família...'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full text-2xl p-10 bg-theme-bg rounded-[3rem] border-2 border-transparent focus:outline-none focus:ring-8 focus:ring-theme-accent-soft focus:bg-theme-card focus:border-theme-accent transition-all resize-none font-semibold tracking-tight leading-snug text-theme-text placeholder:text-theme-muted/40"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`w-full py-8 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all active:scale-[0.98] ${
            loading || !prompt.trim() 
              ? 'bg-theme-border text-theme-muted cursor-not-allowed shadow-none' 
              : 'bg-theme-accent text-theme-card hover:opacity-90 shadow-theme-accent/20'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-4">
              <div className="w-6 h-6 border-4 border-theme-card/20 border-t-theme-card rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          ) : 'Gerar Meu Plano Agora'}
        </button>
      </div>

      {suggestion && (
        <div className="bg-theme-card border border-theme-border rounded-[5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-1000">
          <div className="bg-theme-accent/10 p-12 border-b border-theme-accent/20 relative">
            <div className="absolute top-10 right-10 text-6xl opacity-20">💡</div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <h3 className="text-3xl font-black text-theme-text tracking-tight">Conselho do iCoach</h3>
            </div>
            <p className="text-theme-text text-xl font-semibold leading-relaxed italic relative z-10">"{suggestion.insight}"</p>
          </div>
          
          <div className="p-12 space-y-10">
            <div className="space-y-6">
              {suggestion.tasks.map((t, idx) => (
                <div key={idx} className="flex gap-8 p-10 rounded-[4rem] bg-theme-bg border border-theme-border hover:bg-theme-card transition-all group hover:shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-theme-card flex items-center justify-center font-black text-lg shadow-sm shrink-0 border border-theme-border group-hover:scale-110 transition-transform text-theme-text">{idx + 1}</div>
                  <div className="flex-1">
                    <h4 className="font-black text-theme-text text-2xl tracking-tight">{t.title}</h4>
                    <p className="text-theme-muted mt-3 text-lg leading-relaxed font-medium">{t.description}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="px-6 py-2 bg-theme-card rounded-full text-[11px] font-black uppercase tracking-widest text-theme-muted border border-theme-border shadow-sm">{t.category}</span>
                      <span className="px-6 py-2 bg-theme-card rounded-full text-[11px] font-black uppercase tracking-widest text-theme-muted border border-theme-border shadow-sm">⏱️ {t.estimatedDuration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button 
                onClick={() => setSuggestion(null)}
                className="flex-1 py-6 text-theme-muted font-black text-lg hover:text-theme-text hover:bg-theme-bg rounded-[2.5rem] transition-all"
              >
                Refazer Pedido
              </button>
              <button 
                onClick={handleApply}
                className="flex-[2] py-6 bg-theme-accent text-theme-card rounded-[2.5rem] font-black text-xl shadow-2xl hover:opacity-90 active:scale-[0.98] transition-all"
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