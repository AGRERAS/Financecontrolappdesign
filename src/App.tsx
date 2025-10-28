import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { Analytics } from './components/Analytics';
import { Goals } from './components/Goals';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';
import { AddTransaction } from './components/AddTransaction';
import { Toaster } from './components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';

export type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  comment?: string;
  account: string;
  date: Date;
  tabId: string;
};

export type FinancialTab = {
  id: string;
  name: string;
  icon: string;
  color: string;
  balance: number;
};

export type Budget = {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  icon: string;
};

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'transactions' | 'analytics' | 'goals' | 'settings'>('dashboard');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedTab, setSelectedTab] = useState('personal');

  const [tabs] = useState<FinancialTab[]>([
    { id: 'personal', name: 'Личные', icon: '💰', color: 'from-blue-500 to-cyan-500', balance: 450000 },
    { id: 'home', name: 'Ремонт', icon: '🏠', color: 'from-orange-500 to-amber-500', balance: 125000 },
    { id: 'business', name: 'Бизнес', icon: '💼', color: 'from-purple-500 to-pink-500', balance: 890000 },
    { id: 'family', name: 'Семья', icon: '👨‍👩‍👧', color: 'from-green-500 to-emerald-500', balance: 320000 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 5000,
      type: 'expense',
      category: 'Продукты',
      comment: 'Магнум',
      account: 'Kaspi',
      date: new Date(),
      tabId: 'personal',
    },
    {
      id: '2',
      amount: 15000,
      type: 'expense',
      category: 'Транспорт',
      comment: 'Такси до центра',
      account: 'Наличные',
      date: new Date(Date.now() - 86400000),
      tabId: 'personal',
    },
    {
      id: '3',
      amount: 350000,
      type: 'income',
      category: 'Зарплата',
      account: 'Halyk',
      date: new Date(Date.now() - 172800000),
      tabId: 'personal',
    },
  ]);

  const [budgets] = useState<Budget[]>([
    { id: '1', category: 'Продукты', limit: 80000, spent: 45200, period: 'monthly' },
    { id: '2', category: 'Развлечения', limit: 20000, spent: 18500, period: 'monthly' },
    { id: '3', category: 'Транспорт', limit: 30000, spent: 12300, period: 'monthly' },
  ]);

  const [goals] = useState<Goal[]>([
    { id: '1', name: 'Отпуск в Турции', targetAmount: 500000, currentAmount: 320000, icon: '✈️' },
    { id: '2', name: 'Новый MacBook', targetAmount: 450000, currentAmount: 180000, icon: '💻' },
    { id: '3', name: 'Резервный фонд', targetAmount: 1000000, currentAmount: 650000, icon: '🛡️' },
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-20 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {activeView === 'dashboard' && (
            <Dashboard
              tabs={tabs}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              transactions={transactions}
              budgets={budgets}
              onAddTransaction={() => setShowAddTransaction(true)}
            />
          )}
          {activeView === 'transactions' && (
            <TransactionList
              transactions={transactions}
              selectedTab={selectedTab}
              tabs={tabs}
            />
          )}
          {activeView === 'analytics' && (
            <Analytics
              transactions={transactions}
              budgets={budgets}
              selectedTab={selectedTab}
            />
          )}
          {activeView === 'goals' && <Goals goals={goals} />}
          {activeView === 'settings' && <Settings />}
        </motion.div>
      </AnimatePresence>

      <BottomNav activeView={activeView} onViewChange={setActiveView} />

      <AddTransaction
        open={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onAdd={addTransaction}
        selectedTab={selectedTab}
      />

      <Toaster />
    </div>
  );
}
