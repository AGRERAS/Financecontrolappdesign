import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, PieChart, BarChart } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import type { Transaction, Budget } from '../App';

type AnalyticsProps = {
  transactions: Transaction[];
  budgets: Budget[];
  selectedTab: string;
};

export function Analytics({ transactions, budgets, selectedTab }: AnalyticsProps) {
  const tabTransactions = transactions.filter((t) => t.tabId === selectedTab);

  const monthIncome = tabTransactions
    .filter((t) => t.type === 'income' && isThisMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpenses = tabTransactions
    .filter((t) => t.type === 'expense' && isThisMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = getCategoryBreakdown(
    tabTransactions.filter((t) => t.type === 'expense' && isThisMonth(t.date))
  );

  const topCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Аналитика
        </h1>
        <p className="text-sm text-slate-400">Ваша финансовая статистика</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 border-0">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
                <span className="text-sm text-white">Доходы</span>
              </div>
              <p className="text-2xl text-white">{formatCurrency(monthIncome)}</p>
              <p className="text-xs text-white/90 mt-1">За месяц</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-red-500 to-rose-500 border-0">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-white" />
                <span className="text-sm text-white">Расходы</span>
              </div>
              <p className="text-2xl text-white">{formatCurrency(monthExpenses)}</p>
              <p className="text-xs text-white/90 mt-1">За месяц</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Net Income */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-200">Чистый доход</span>
              <span
                className={`text-2xl ${
                  monthIncome - monthExpenses >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatCurrency(monthIncome - monthExpenses)}
              </span>
            </div>
            <Progress
              value={monthIncome > 0 ? ((monthIncome - monthExpenses) / monthIncome) * 100 : 0}
              className="h-2 bg-slate-700"
            />
          </div>
        </Card>
      </motion.div>

      {/* Top Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-blue-400" />
          <h3 className="text-slate-200">Топ категорий расходов</h3>
        </div>

        <div className="space-y-3">
          {topCategories.map(([category, amount], index) => {
            const percentage = monthExpenses > 0 ? (amount / monthExpenses) * 100 : 0;
            const colors = [
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-pink-500',
              'from-orange-500 to-amber-500',
              'from-green-500 to-emerald-500',
              'from-red-500 to-rose-500',
            ];

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">{category}</span>
                      <div className="text-right">
                        <p className="text-sm text-white">{formatCurrency(amount)}</p>
                        <p className="text-xs text-slate-300">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[index % colors.length]} rounded-full`}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Budget Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="w-5 h-5 text-purple-400" />
          <h3 className="text-slate-200">Выполнение бюджетов</h3>
        </div>

        <div className="space-y-3">
          {budgets.map((budget, index) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isWarning = percentage > 90;
            const isDanger = percentage >= 100;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card
                  className={`border-0 ${
                    isDanger
                      ? 'bg-gradient-to-br from-red-900/30 to-rose-900/30'
                      : isWarning
                      ? 'bg-gradient-to-br from-orange-900/30 to-amber-900/30'
                      : 'bg-slate-800/50'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">{budget.category}</span>
                      <span className="text-xs text-slate-300">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                      </span>
                    </div>
                    <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                        className={`absolute inset-y-0 left-0 rounded-full ${
                          isDanger
                            ? 'bg-gradient-to-r from-red-500 to-rose-500'
                            : isWarning
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                      />
                    </div>
                    {isWarning && (
                      <p className="text-xs text-orange-400 mt-2">
                        {isDanger ? '⚠️ Лимит превышен!' : '⚠️ Близко к лимиту'}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
          <div className="p-5">
            <h3 className="text-blue-300 mb-3">📊 Статистика</h3>
            <div className="space-y-2 text-sm text-slate-100">
              <p>• Средний расход в день: {formatCurrency(monthExpenses / 30)}</p>
              <p>
                • Самая затратная категория:{' '}
                {topCategories[0] ? topCategories[0][0] : 'Нет данных'}
              </p>
              <p>
                • Процент сбережений:{' '}
                {monthIncome > 0 ? ((monthIncome - monthExpenses) / monthIncome * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function getCategoryBreakdown(transactions: Transaction[]): Record<string, number> {
  const breakdown: Record<string, number> = {};

  transactions.forEach((transaction) => {
    if (!breakdown[transaction.category]) {
      breakdown[transaction.category] = 0;
    }
    breakdown[transaction.category] += transaction.amount;
  });

  return breakdown;
}

function isThisMonth(date: Date): boolean {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
