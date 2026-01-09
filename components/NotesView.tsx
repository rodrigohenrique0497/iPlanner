
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
    'bg-rose-100', 
    'bg-blue-100', 
    'bg-amber-100', 
    'bg-emerald-100', 
    'bg-theme-card'   
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
        <div className="w-full md:w-auto flex gap-4 items-center">
          <div className="relative flex-1 md:w-80 group">
            <input 
              type="text" 
              placeholder="Buscar em suas notas..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-7 h-[3.75rem] bg-theme-card rounded-[1.5rem] border border-theme-border shadow-sm focus:ring-4 focus:ring-theme-accent-soft outline-none font-bold text-sm text-theme-text transition-all"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-theme-accent group-focus-within:opacity-100 transition-all">
               <span className="material-symbols-outlined !text-2xl leading-none">search</span>
            </span>
          </div>
          
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-premium hover:scale-105 active:scale-95 transition-all shrink-0 ${isCreating ? 'bg-rose-500 text-white' : 'bg-theme-accent text-theme-card'}`}
          >
            <span className="material-symbols-outlined !text-3xl leading-none">{isCreating ? 'close' : 'add'}</span>
          </button>
        </div>
      </header>

      {/* Editor Inline de Notas */}
      {isCreating && (
        <div className="animate-in slide-in-from-top-6 duration-500">
          <div className="bg-theme-card p-8 md:p-12 rounded-[2.5rem] border border-theme-border shadow-premium space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-theme-text tracking-tight uppercase">Nova Nota</h3>
            </div>

            <div className="space-y-6">
              <input 
                autoFocus
                type="text" 
                placeholder="Título da nota" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-2xl md:text-4xl font-black text-theme-text placeholder:opacity-20 outline-none bg-transparent border-none p-0 min-h-0 text-left"
              />
              <textarea 
                placeholder="Comece a escrever..." 
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={8}
                className="w-full text-lg md:text-xl font-medium text-theme-muted placeholder:opacity-20 outline-none bg-transparent resize-none leading-relaxed border-none p-0 text-left"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddNote}
                className="btn-action-primary flex-1 shadow-glow"
              >
                SALVAR NOTA
              </button>
              <button 
                onClick={() => setIsCreating(false)}
                className="btn-action-secondary flex-1"
              >
                CANCELAR
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
            <h3 className="text-xl font-black text-theme-text mb-3 line-clamp-2 leading-tight text-left">{note.title}</h3>
            <p className="text-theme-text/70 font-medium leading-relaxed flex-1 line-clamp-5 whitespace-pre-wrap text-sm text-left">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesView;
