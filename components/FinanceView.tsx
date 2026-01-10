
import React, { useState, useMemo } from 'react';
import { FinanceTransaction, FinanceCategory } from '../types';

interface FinanceViewProps {
  transactions: FinanceTransaction[];
  onAdd: (t: FinanceTransaction) => void;
  onDelete: (id: string) => void;
}

const FinanceView: React.FC<FinanceViewProps> = ({ transactions, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<FinanceCategory>('Casa');
  const [installments, setInstallments] = useState('1');

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const emergency = transactions.filter(t => t.category === 'Reserva').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense, emergency };
  }, [transactions]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    const numAmount = parseFloat(amount);
    const totalInst = parseInt(installments);

    const newTransaction: FinanceTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: desc,
      amount: numAmount,
      type,
      category,
      date: new Date().toISOString().split('T')[0],
      ...(totalInst > 1 ? { installments: { current: 1, total: totalInst } } : {})
    };

    onAdd(newTransaction);
    setDesc('');
    setAmount('');
    setIsAdding(false);
  };

  const getCategoryIcon = (cat: FinanceCategory) => {
    switch(cat) {
      case 'Salário': return 'payments';
      case 'Casa': return 'home';
      case 'Assinatura': return 'subscriptions';
      case 'Parcela': return 'credit_card';
      case 'Reserva': return 'savings';
      case 'Lazer': return 'confirmation_number';
      case 'Alimentação': return 'restaurant';
      default: return 'monetization_on';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5 md:p-10 space-y-12 page-transition pb-32 overflow-hidden">
      <header className="flex justify-between items-center w-full">
        <div className="min-w-0">
          <h2 className="text-3xl md:text-5xl font-black text-theme-text tracking-tighter truncate leading-none">Finanças</h2>
          <p className="text-theme-muted font-bold text-[10px] md:text-lg mt-2 uppercase tracking-widest opacity-60">Gestão Patrimonial</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-premium transition-all active:scale-90 shrink-0 ${isAdding ? 'bg-rose-500 text-white' : 'bg-theme-accent text-theme-card'}`}
        >
          <span className="material-symbols-outlined !text-3xl">{isAdding ? 'close' : 'add'}</span>
        </button>
      </header>

      {isAdding && (
        <div className="animate-in slide-in-from-top-6 duration-500 w-full">
          <form onSubmit={handleAdd} className="bg-theme-card p-6 md:p-12 rounded-[2.5rem] border border-theme-border shadow-premium space-y-10 w-full overflow-hidden box-border">
            <div className="space-y-8 w-full">
              <div className="flex bg-theme-bg/50 p-1.5 rounded-[1.25rem] border border-theme-border h-[4.5rem] items-center gap-1 w-full">
                <button 
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 h-full rounded-[0.9rem] text-[10px] font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-rose-600 text-white shadow-lg' : 'text-theme-muted opacity-50 hover:opacity-100'}`}
                >
                  Saída
                </button>
                <button 
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 h-full rounded-[0.9rem] text-[10px] font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-emerald-600 text-white shadow-lg' : 'text-theme-muted opacity-50 hover:opacity-100'}`}
                >
                  Entrada
                </button>
              </div>

              <div className="space-y-3 w-full">
                <label className="text-[10px] font-black uppercase text-theme-muted text-center block tracking-widest opacity-40">Descrição</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Ex: Aluguel, Salário, Lazer" 
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-3 w-full">
                  <label className="text-[10px] font-black uppercase text-theme-muted text-center block tracking-widest opacity-40">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0,00" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div className="space-y-3 w-full">
                  <label className="text-[10px] font-black uppercase text-theme-muted text-center block tracking-widest opacity-40">Categoria</label>
                  <div className="relative w-full">
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value as FinanceCategory)}
                      className="input-premium appearance-none cursor-pointer uppercase tracking-widest text-[11px]"
                    >
                      <option value="Salário">Salário</option>
                      <option value="Casa">Casa / Contas</option>
                      <option value="Assinatura">Assinatura</option>
                      <option value="Parcela">Parcela</option>
                      <option value="Reserva">Reserva</option>
                      <option value="Lazer">Lazer</option>
                      <option value="Alimentação">Alimentação</option>
                      <option value="Outros">Outros</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 w-full">
              <button type="submit" className="btn-action-primary">SALVAR REGISTRO</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-action-secondary">CANCELAR</button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards Grid - Estabilidade de Proporção */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-theme-card p-6 md:p-8 rounded-[2rem] border border-theme-border shadow-sm space-y-2 min-h-[120px] flex flex-col justify-center">
          <p className="text-[8px] font-black uppercase tracking-widest text-theme-muted opacity-50">Saldo</p>
          <p className={`text-lg md:text-2xl font-black truncate ${stats.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-emerald-500/10 p-6 md:p-8 rounded-[2rem] border border-emerald-500/20 space-y-2 min-h-[120px] flex flex-col justify-center">
          <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600 opacity-80">Ganhos</p>
          <p className="text-lg md:text-2xl font-black text-emerald-700 truncate">
            R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-rose-500/10 p-6 md:p-8 rounded-[2rem] border border-rose-500/20 space-y-2 min-h-[120px] flex flex-col justify-center">
          <p className="text-[8px] font-black uppercase tracking-widest text-rose-600 opacity-80">Gastos</p>
          <p className="text-lg md:text-2xl font-black text-rose-700 truncate">
            R$ {stats.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-blue-500/10 p-6 md:p-8 rounded-[2rem] border border-blue-500/20 space-y-2 min-h-[120px] flex flex-col justify-center">
          <p className="text-[8px] font-black uppercase tracking-widest text-blue-600 opacity-80">Reserva</p>
          <p className="text-lg md:text-2xl font-black text-blue-700 truncate">
            R$ {stats.emergency.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Extrato Recente - Otimização de Espaço */}
      <div className="bg-theme-card rounded-[2.5rem] border border-theme-border shadow-sm overflow-hidden w-full">
        <div className="p-6 md:p-8 border-b border-theme-border flex justify-between items-center bg-theme-bg/30 w-full">
          <h3 className="font-black text-theme-text uppercase text-[9px] tracking-[0.2em] opacity-60">Extrato Recente</h3>
          <span className="text-[7px] font-black uppercase text-theme-muted bg-theme-card px-3 py-1.5 rounded-full border border-theme-border shadow-sm">{transactions.length} regs</span>
        </div>
        
        <div className="divide-y divide-theme-border w-full">
          {transactions.length > 0 ? [...transactions].reverse().map(t => (
            <div key={t.id} className="p-5 md:p-8 flex items-center justify-between group hover:bg-theme-bg transition-all duration-300 w-full">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-theme-bg rounded-xl flex items-center justify-center shrink-0 border border-theme-border/50 shadow-inner">
                  <span className="material-symbols-outlined !text-lg leading-none">{getCategoryIcon(t.category)}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-[13px] md:text-[17px] text-theme-text leading-tight truncate">{t.description}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest bg-theme-accent-soft text-theme-muted px-2 py-0.5 rounded-lg">
                      {t.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-8 shrink-0">
                <p className={`text-[13px] md:text-xl font-black tracking-tighter ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <button 
                  onClick={() => onDelete(t.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-theme-muted hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined !text-lg">delete</span>
                </button>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center opacity-30 space-y-4">
              <span className="material-symbols-outlined !text-6xl">receipt_long</span>
              <p className="text-theme-muted font-black uppercase tracking-[0.2em] text-[10px]">Sem registros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
