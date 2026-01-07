
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
    'bg-rose-100', // rosa
    'bg-blue-100', // azul
    'bg-amber-100', // amarelo
    'bg-emerald-100', // verde
    'bg-theme-card'   // branco
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
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12 page-transition pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-theme-text tracking-tighter leading-none">Notas</h2>
          <p className="text-theme-muted font-medium text-base md:text-lg mt-2 italic opacity-80">Capture suas ideias.</p>
        </div>
        <div className="w-full md:w-auto flex gap-3 items-center">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 bg-theme-card rounded-2xl border border-theme-border shadow-sm focus:ring-4 focus:ring-theme-accent-soft outline-none font-bold text-xs text-theme-text"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
               <span className="material-symbols-outlined !text-xl leading-none">search</span>
            </span>
          </div>
          
          <button 
            onClick={() => setIsCreating(true)}
            className="w-12 h-12 md:w-14 md:h-14 bg-theme-accent text-theme-card rounded-full flex items-center justify-center shadow-premium hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <span className="material-symbols-outlined !text-3xl leading-none">add</span>
          </button>
        </div>
      </header>

      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-theme-card w-full max-w-2xl p-8 md:p-12 rounded-planner shadow-premium space-y-8 border border-theme-border animate-in zoom-in-95 duration-300">
            <div className="space-y-6">
              <input 
                autoFocus
                type="text" 
                placeholder="Título da nota" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-2xl md:text-3xl font-black text-theme-text placeholder:opacity-20 outline-none bg-transparent"
              />
              <textarea 
                placeholder="Comece a escrever..." 
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={8}
                className="w-full text-base md:text-lg font-medium text-theme-muted placeholder:opacity-20 outline-none bg-transparent resize-none leading-relaxed"
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleAddNote}
                className="flex-1 py-4 bg-theme-accent text-theme-card rounded-2xl font-black uppercase tracking-widest hover:opacity-95 shadow-glow active:scale-95 transition-all text-xs"
              >
                Salvar Nota
              </button>
              <button 
                onClick={() => setIsCreating(false)}
                className="px-8 py-4 bg-theme-bg text-theme-muted rounded-2xl font-black uppercase tracking-widest border border-theme-border active:scale-95 transition-all text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            className={`${note.color} p-8 md:p-10 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group relative min-h-[220px] flex flex-col`}
          >
            <button 
              onClick={() => onDelete(note.id)}
              className="absolute top-5 right-5 w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white active:scale-90"
            >
              <span className="material-symbols-outlined !text-xl leading-none">delete</span>
            </button>
            <h3 className="text-xl font-black text-theme-text mb-3 line-clamp-2 leading-tight">{note.title}</h3>
            <p className="text-theme-text/70 font-medium leading-relaxed flex-1 line-clamp-5 whitespace-pre-wrap text-sm">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesView;
