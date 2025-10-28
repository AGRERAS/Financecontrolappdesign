import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Plus, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import type { FinancialTab, Transaction, Budget } from '../App';

type DashboardProps = {
  tabs: FinancialTab[];
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  transactions: Transaction[];
  budgets: Budget[];
  onAddTransaction: () => void;
};

export function Dashboard({ tabs, selectedTab, onTabChange, transactions, budgets, onAddTransaction }: DashboardProps) {
  const currentTab = tabs.find(t => t.id === selectedTab)!;
  const tabTransactions = transactions.filter(t => t.tabId === selectedTab);
  
  const todayIncome = tabTransactions
    .filter(t => t.type === 'income' && isToday(t.date))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const todayExpenses = tabTransactions
    .filter(t => t.type === 'expense' && isToday(t.date))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthIncome = tabTransactions
    .filter(t => t.type === 'income' && isThisMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthExpenses = tabTransactions
    .filter(t => t.type === 'expense' && isThisMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            FinTabs
          </h1>
          <p className="text-sm text-slate-400 mt-1">Управляй финансами легко</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onAddTransaction}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30"
            size="lg"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Tabs Carousel */}
      <div className="overflow-x-auto -mx-4 px-4 hide-scrollbar">
        <div className="flex gap-3 min-w-max pb-2">
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => onTabChange(tab.id)}
                className={`relative overflow-hidden cursor-pointer transition-all ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-br ' + tab.color + ' shadow-xl shadow-blue-500/20'
                    : 'bg-slate-800/50 hover:bg-slate-800'
                } border-0 min-w-[140px]`}
              >
                <div className="p-4">
                  <div className="text-2xl mb-2">{tab.icon}</div>
                  <p className="text-xs text-white/90 mb-1">{tab.name}</p>
                  <p className="text-lg text-white">{formatCurrency(tab.balance)}</p>
                </div>
                {selectedTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 border-2 border-white/30 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`bg-gradient-to-br ${currentTab.color} border-0 shadow-2xl shadow-blue-500/20`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90">Общий баланс</p>
              <span className="text-2xl">{currentTab.icon}</span>
            </div>
            <motion.h2
              key={currentTab.balance}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-4xl mb-6 text-white"
            >
              {formatCurrency(currentTab.balance)}
            </motion.h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/90 mb-1">Доходы сегодня</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-300" />
                  <span className="text-lg text-white">{formatCurrency(todayIncome)}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/90 mb-1">Расходы сегодня</p>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-red-300" />
                  <span className="text-lg text-white">{formatCurrency(todayExpenses)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Month Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <div className="p-5">
            <h3 className="text-sm text-slate-200 mb-4">Итоги месяца</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Доходы</span>
                  <span className="text-green-400">{formatCurrency(monthIncome)}</span>
                </div>
                <Progress value={100} className="h-2 bg-slate-700" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Расходы</span>
                  <span className="text-red-400">{formatCurrency(monthExpenses)}</span>
                </div>
                <Progress
                  value={monthIncome > 0 ? (monthExpenses / monthIncome) * 100 : 0}
                  className="h-2 bg-slate-700"
                />
              </div>
              <div className="pt-2 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white">Разница</span>
                  <span className={monthIncome - monthExpenses >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatCurrency(monthIncome - monthExpenses)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Budgets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-200">Бюджеты</h3>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
            Все
          </Button>
        </div>
        <div className="space-y-3">
          {budgets.slice(0, 3).map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white">{budget.category}</span>
                    <span className="text-xs text-slate-300">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <Progress
                    value={(budget.spent / budget.limit) * 100}
                    className="h-2 bg-slate-700"
                  />
                  {budget.spent / budget.limit > 0.9 && (
                    <p className="text-xs text-orange-400 mt-2">⚠️ Близко к лимиту</p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 backdrop-blur-sm">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-purple-300">AI Инсайты</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-100">
                💡 Вы тратите на 15% меньше чем в прошлом месяце. Отличная динамика!
              </p>
              <p className="text-sm text-slate-100">
                📊 Развлечения составляют 18% расходов. Попробуйте сократить до 15%.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-200">Последние операции</h3>
        </div>
        <div className="space-y-2">
          {tabTransactions.slice(0, 5).map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white">{transaction.category}</p>
                      {transaction.comment && (
                        <p className="text-xs text-slate-300">{transaction.comment}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-slate-300">{transaction.account}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isThisMonth(date: Date): boolean {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}
