
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
          <h2 className="text-5xl font-black text-theme-text tracking-tighter">Finanças</h2>
          <p className="text-theme-muted font-medium text-lg mt-2 italic">Gerencie seu patrimônio com consciência.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-theme-accent text-theme-card rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <span className="material-symbols-outlined !text-4xl leading-none">add</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-theme-card p-8 rounded-[3rem] border border-theme-border shadow-sm space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Saldo Total</p>
          <p className={`text-3xl font-black ${stats.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60">Entradas (Mês)</p>
          <p className="text-3xl font-black text-emerald-800">
            R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-rose-50 p-8 rounded-[3rem] border border-rose-100 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-700/60">Saídas (Mês)</p>
          <p className="text-3xl font-black text-rose-800">
            R$ {stats.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-700/60">Reserva de Emergência</p>
          <p className="text-3xl font-black text-blue-800">
            R$ {stats.emergency.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-theme-bg/40 backdrop-blur-sm animate-in fade-in duration-300">
          <form onSubmit={handleAdd} className="bg-theme-card w-full max-w-xl p-10 rounded-[4rem] shadow-2xl space-y-8 border border-theme-border">
            <h3 className="text-2xl font-black text-theme-text tracking-tight">Adicionar Movimentação</h3>
            
            <div className="space-y-6">
              <div className="flex bg-theme-bg p-1.5 rounded-2xl">
                <button 
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${type === 'expense' ? 'bg-theme-card shadow-sm text-rose-600' : 'text-theme-muted'}`}
                >
                  Saída
                </button>
                <button 
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${type === 'income' ? 'bg-theme-card shadow-sm text-emerald-600' : 'text-theme-muted'}`}
                >
                  Entrada
                </button>
              </div>

              <input 
                autoFocus
                type="text" 
                placeholder="Descrição (Ex: Aluguel, Salário, Netflix)" 
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full p-5 bg-theme-bg rounded-2xl border-2 border-transparent focus:border-theme-accent-soft outline-none font-bold text-sm text-theme-text"
              />

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Valor (R$)" 
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full p-5 bg-theme-bg rounded-2xl border-2 border-transparent focus:border-theme-accent-soft outline-none font-bold text-sm text-theme-text"
                />
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as FinanceCategory)}
                  className="w-full p-5 bg-theme-bg rounded-2xl border-2 border-transparent focus:border-theme-accent-soft outline-none font-bold text-sm text-theme-text"
                >
                  <option value="Salário">Salário</option>
                  <option value="Casa">Casa / Contas</option>
                  <option value="Assinatura">Assinatura</option>
                  <option value="Parcela">Parcela / Compra</option>
                  <option value="Reserva">Reserva de Emerg.</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {category === 'Parcela' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase px-4 opacity-40">Total de Parcelas</label>
                  <input 
                    type="number" 
                    value={installments}
                    onChange={e => setInstallments(e.target.value)}
                    className="w-full p-5 bg-theme-bg rounded-2xl font-bold text-sm text-theme-text"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button type="submit" className="flex-1 py-5 bg-theme-accent text-theme-card rounded-[1.75rem] font-black uppercase tracking-widest hover:opacity-90">Salvar</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-10 py-5 bg-theme-bg text-theme-muted rounded-[1.75rem] font-black uppercase tracking-widest">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-theme-card rounded-[3.5rem] border border-theme-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-theme-border flex justify-between items-center">
          <h3 className="font-black text-theme-text tracking-tight">Fluxo de Caixa</h3>
          <span className="text-[10px] font-black uppercase text-theme-muted">{transactions.length} transações registradas</span>
        </div>
        
        <div className="divide-y divide-theme-border">
          {transactions.length > 0 ? [...transactions].reverse().map(t => (
            <div key={t.id} className="p-8 flex items-center justify-between group hover:bg-theme-bg transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-theme-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined !text-3xl text-theme-text leading-none flex items-center justify-center">{getCategoryIcon(t.category)}</span>
                </div>
                <div>
                  <h4 className="font-black text-theme-text leading-tight">{t.description}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-theme-bg text-theme-muted px-2 py-1 rounded-lg border border-theme-border">
                      {t.category}
                    </span>
                    <span className="text-[9px] font-bold text-theme-muted opacity-60">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </span>
                    {t.installments && (
                      <span className="text-[9px] font-black text-theme-accent bg-theme-accent/10 px-2 py-1 rounded-lg">
                        Parcela {t.installments.current}/{t.installments.total}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <p className={`text-lg font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <button 
                  onClick={() => onDelete(t.id)}
                  className="opacity-0 group-hover:opacity-100 p-3 text-theme-muted hover:text-red-500 transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined !text-2xl leading-none">delete</span>
                </button>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center">
              <p className="text-theme-muted font-bold italic">Nenhuma movimentação financeira.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
