
import React, { useState, useEffect } from 'react';

interface FocusTimerProps {
  onClose: () => void;
  onComplete: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onClose, onComplete }) => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      if (mode === 'work') {
        onComplete();
        setMode('break');
        setSeconds(5 * 60);
        alert("Excelente! Hora de um descanso de 5 minutos.");
      } else {
        setMode('work');
        setSeconds(25 * 60);
        alert("Descanso finalizado. Vamos voltar ao foco?");
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, mode]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 page-transition backdrop-blur-3xl ${mode === 'work' ? 'bg-slate-900/95' : 'bg-blue-900/95'}`}>
      <div className="max-w-md w-full text-center space-y-12">
        <div className="space-y-4">
          <span className="px-8 py-2 bg-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
            {mode === 'work' ? 'Modo Foco Profundo' : 'Modo Relaxamento'}
          </span>
          <div className="text-white text-[10rem] font-black tracking-tighter leading-none">{formatTime(seconds)}</div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="w-full py-8 rounded-[3rem] bg-white text-slate-900 font-black text-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {isActive ? 'Pausar' : 'Retomar'}
          </button>
          <button onClick={onClose} className="text-white/40 font-black uppercase tracking-widest text-xs hover:text-white transition-all py-4">Abandonar Sessão</button>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
