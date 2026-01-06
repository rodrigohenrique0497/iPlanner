
import React, { useState } from 'react';
import { Note } from '../types';

interface NotesViewProps {
  notes: Note[];
  onAdd: (note: Note) => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

const NotesView: React.FC<NotesViewProps> = ({ notes, onAdd, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const colors = [
    'bg-[#F6C1CC]', // rosa
    'bg-[#C9DFF2]', // azul
    'bg-[#FFF1B8]', // amarelo
    'bg-[#E2F2D5]', // verde
    'bg-white'      // branco
  ];

  const handleAddNote = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle.trim() || 'Sem título',
      content: newContent.trim(),
      lastEdited: new Date().toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    onAdd(newNote);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12 page-transition pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Notas</h2>
          <p className="text-slate-500 font-medium text-lg mt-2 italic">Capture suas ideias antes que elas voem.</p>
        </div>
        <div className="w-full md:w-auto flex gap-4">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Buscar notas..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white rounded-[1.75rem] border border-slate-100 shadow-sm focus:ring-4 focus:ring-azul-pastel/30 outline-none font-bold text-xs"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
          </div>
          
          {/* FAB PADRONIZADO PREMIUM */}
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-slate-900 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-90 transition-all focus:outline-none group relative shrink-0"
          >
            <span className="text-3xl md:text-5xl font-light leading-none select-none flex items-center justify-center">+</span>
            <div className="absolute inset-0 rounded-full border border-white/10 group-hover:scale-105 transition-transform"></div>
          </button>
        </div>
      </header>

      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl p-10 rounded-[3.5rem] shadow-2xl space-y-8">
            <div className="space-y-6">
              <input 
                autoFocus
                type="text" 
                placeholder="Título da nota" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-200 outline-none bg-transparent"
              />
              <textarea 
                placeholder="Comece a escrever aqui..." 
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={8}
                className="w-full text-lg font-medium text-slate-600 placeholder:text-slate-300 outline-none bg-transparent resize-none"
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleAddNote}
                className="flex-1 py-5 bg-slate-900 text-white rounded-[1.75rem] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98]"
              >
                Salvar Nota
              </button>
              <button 
                onClick={() => setIsCreating(false)}
                className="px-10 py-5 bg-slate-50 text-slate-400 rounded-[1.75rem] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            className={`${note.color} p-10 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group relative min-h-[240px] flex flex-col`}
          >
            <button 
              onClick={() => onDelete(note.id)}
              className="absolute top-6 right-6 w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white active:scale-90"
            >
              <span className="text-xl flex items-center justify-center">🗑️</span>
            </button>
            <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2">{note.title}</h3>
            <p className="text-slate-700/80 font-medium leading-relaxed flex-1 line-clamp-5 whitespace-pre-wrap">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesView;
