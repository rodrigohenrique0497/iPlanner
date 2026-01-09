
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
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12 page-transition pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-theme-text tracking-tighter leading-none">Finanças</h2>
          <p className="text-theme-muted font-bold text-base md:text-lg mt-3 italic opacity-80">Gerencie seu patrimônio com consciência.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-16 h-16 bg-theme-accent text-theme-card rounded-2xl flex items-center justify-center shadow-premium hover:scale-105 active:scale-95 shrink-0 transition-all"
        >
          <span className="material-symbols-outlined !text-3xl">add</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-theme-card p-10 rounded-[2.5rem] border border-theme-border shadow-sm space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted opacity-50">Saldo Total</p>
          <p className={`text-2xl font-black ${stats.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-emerald-500/10 p-10 rounded-[2.5rem] border border-emerald-500/20 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 opacity-80">Entradas</p>
          <p className="text-2xl font-black text-emerald-700">
            R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-rose-500/10 p-10 rounded-[2.5rem] border border-rose-500/20 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 opacity-80">Saídas</p>
          <p className="text-2xl font-black text-rose-700">
            R$ {stats.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-blue-500/10 p-10 rounded-[2.5rem] border border-blue-500/20 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-80">Reserva</p>
          <p className="text-2xl font-black text-blue-700">
            R$ {stats.emergency.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {isAdding && (
        <div className="modal-backdrop">
          <form onSubmit={handleAdd} className="modal-container p-8 md:p-12 space-y-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-black text-theme-text tracking-tight uppercase">Nova Movimentação</h3>
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-close-modal"
              >
                <span className="material-symbols-outlined !text-3xl">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex bg-theme-bg/50 p-1.5 rounded-2xl border border-theme-border h-16 items-center">
                <button 
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 h-full rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-theme-card shadow-sm text-rose-600' : 'text-theme-muted opacity-50'}`}
                >
                  Saída
                </button>
                <button 
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 h-full rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-theme-card shadow-sm text-emerald-600' : 'text-theme-muted opacity-50'}`}
                >
                  Entrada
                </button>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-theme-muted ml-5 tracking-widest opacity-40">Descrição</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Ex: Aluguel, Salário, Lazer" 
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="w-full px-7 h-[4.5rem] bg-theme-bg/40 rounded-2xl border border-theme-border/50 outline-none font-bold text-base text-theme-text placeholder:opacity-40"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-theme-muted ml-5 tracking-widest opacity-40">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0,00" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-7 h-[4.5rem] bg-theme-bg/40 rounded-2xl border border-theme-border/50 outline-none font-bold text-base text-theme-text"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-theme-muted ml-5 tracking-widest opacity-40">Categoria</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value as FinanceCategory)}
                    className="w-full px-7 h-[4.5rem] bg-theme-bg/40 rounded-2xl border border-theme-border/50 outline-none font-black text-[11px] uppercase tracking-widest text-theme-text appearance-none cursor-pointer"
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
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button type="submit" className="btn-action-primary">Salvar</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-action-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-theme-card rounded-[3rem] border border-theme-border shadow-sm overflow-hidden">
        <div className="p-8 md:p-10 border-b border-theme-border flex justify-between items-center bg-theme-bg/30">
          <h3 className="font-black text-theme-text tracking-tight uppercase text-xs tracking-[0.25em] opacity-60">Fluxo de Caixa</h3>
          <span className="text-[10px] font-black uppercase text-theme-muted bg-theme-accent-soft px-4 py-2 rounded-full border border-theme-border/50 tracking-widest">{transactions.length} registros</span>
        </div>
        
        <div className="divide-y divide-theme-border">
          {transactions.length > 0 ? [...transactions].reverse().map(t => (
            <div key={t.id} className="p-8 md:p-10 flex items-center justify-between group hover:bg-theme-bg transition-all duration-300">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-theme-bg rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:bg-theme-accent group-hover:text-theme-card transition-all border border-theme-border/50 shadow-inner">
                  <span className="material-symbols-outlined !text-2xl leading-none flex items-center justify-center">{getCategoryIcon(t.category)}</span>
                </div>
                <div>
                  <h4 className="font-black text-[17px] text-theme-text leading-tight group-hover:translate-x-1 transition-transform">{t.description}</h4>
                  <div className="flex items-center gap-4 mt-2.5">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-theme-accent-soft text-theme-muted px-3 py-1.5 rounded-xl border border-theme-border/50">
                      {t.category}
                    </span>
                    <span className="text-[9px] font-bold text-theme-muted opacity-40 uppercase tracking-tighter">
                      {new Date(t.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <p className={`text-lg md:text-xl font-black tracking-tight ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <button 
                  onClick={() => onDelete(t.id)}
                  className="opacity-0 group-hover:opacity-100 w-12 h-12 flex items-center justify-center rounded-2xl text-theme-muted hover:text-rose-600 hover:bg-rose-500/10 transition-all active:scale-90 shadow-sm"
                >
                  <span className="material-symbols-outlined !text-2xl leading-none">delete</span>
                </button>
              </div>
            </div>
          )) : (
            <div className="py-32 text-center opacity-30 space-y-6">
              <span className="material-symbols-outlined !text-7xl">receipt_long</span>
              <p className="text-theme-muted font-black uppercase tracking-[0.3em] text-xs">Nenhuma movimentação registrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
