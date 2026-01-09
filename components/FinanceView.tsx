
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
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12 page-transition pb-32 overflow-x-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-theme-text tracking-tighter leading-none">Finanças</h2>
          <p className="text-theme-muted font-bold text-base md:text-lg mt-3 italic opacity-80">Gerencie seu patrimônio com consciência.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-premium hover:scale-105 active:scale-95 shrink-0 transition-all ${isAdding ? 'bg-red-600 text-white' : 'bg-theme-accent text-theme-card'}`}
        >
          <span className="material-symbols-outlined !text-3xl">{isAdding ? 'close' : 'add'}</span>
        </button>
      </header>

      {isAdding && (
        <div className="animate-in slide-in-from-top-6 duration-500">
          <form onSubmit={handleAdd} className="bg-theme-card p-6 md:p-12 rounded-[2.5rem] border-2 border-theme-border shadow-premium space-y-8 overflow-hidden w-full">
            <h3 className="text-xl font-black text-theme-text tracking-tight uppercase px-4">Nova Movimentação</h3>
            
            <div className="space-y-8">
              <div className="flex bg-theme-bg/50 p-2 rounded-[2rem] border-2 border-theme-border h-[5rem] items-center gap-2">
                <button 
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 h-full rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center justify-center ${type === 'expense' ? 'bg-red-600 text-white shadow-glow' : 'text-theme-muted opacity-50'}`}
                >
                  Saída
                </button>
                <button 
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 h-full rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center justify-center ${type === 'income' ? 'bg-green-600 text-white shadow-glow' : 'text-theme-muted opacity-50'}`}
                >
                  Entrada
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-theme-muted ml-5 tracking-widest opacity-60">Descrição</label>
                  <input type="text" placeholder="Ex: Aluguel, Salário, Lazer" value={desc} onChange={e => setDesc(e.target.value)} className="input-premium" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-theme-muted ml-5 tracking-widest opacity-60">Valor (R$)</label>
                    <input type="number" step="0.01" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} className="input-premium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-theme-muted ml-5 tracking-widest opacity-60">Categoria</label>
                    <select value={category} onChange={e => setCategory(e.target.value as FinanceCategory)} className="input-premium appearance-none text-center uppercase tracking-widest text-[11px]">
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
            </div>

            <div className="flex flex-col gap-5 pt-4">
              <button type="submit" className="btn-action-primary">SALVAR MOVIMENTAÇÃO</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-action-secondary">CANCELAR</button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-theme-card p-6 md:p-10 rounded-[2.5rem] border border-theme-border shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted opacity-50 mb-2">Saldo</p>
          <p className={`text-xl font-black truncate ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-green-500/10 p-6 md:p-10 rounded-[2.5rem] border border-green-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-600 opacity-80 mb-2">Entradas</p>
          <p className="text-xl font-black text-green-700 truncate">
            R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-red-500/10 p-6 md:p-10 rounded-[2.5rem] border border-red-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-600 opacity-80 mb-2">Saídas</p>
          <p className="text-xl font-black text-red-700 truncate">
            R$ {stats.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-blue-500/10 p-6 md:p-10 rounded-[2.5rem] border border-blue-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-80 mb-2">Reserva</p>
          <p className="text-xl font-black text-blue-700 truncate">
            R$ {stats.emergency.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-theme-card rounded-[3rem] border border-theme-border shadow-sm overflow-hidden w-full">
        <div className="p-8 border-b border-theme-border flex justify-between items-center bg-theme-bg/30">
          <h3 className="font-black text-theme-text tracking-tight uppercase text-[10px] tracking-[0.25em] opacity-60">Fluxo de Caixa</h3>
        </div>
        <div className="divide-y divide-theme-border overflow-hidden">
          {transactions.length > 0 ? [...transactions].reverse().map(t => (
            <div key={t.id} className="p-6 md:p-10 flex items-center justify-between group hover:bg-theme-bg transition-all">
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-theme-bg rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined !text-2xl">{getCategoryIcon(t.category)}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-[15px] md:text-[17px] text-theme-text truncate">{t.description}</h4>
                  <span className="text-[9px] font-black uppercase tracking-widest text-theme-muted opacity-40">{t.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-8 shrink-0">
                <p className={`text-base md:text-lg font-black ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center opacity-30 space-y-4">
              <span className="material-symbols-outlined !text-6xl">receipt_long</span>
              <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma movimentação</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
