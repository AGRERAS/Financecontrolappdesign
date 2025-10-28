import { motion } from 'motion/react';
import { Target, Plus, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import type { Goal } from '../App';

type GoalsProps = {
  goals: Goal[];
};

export function Goals({ goals }: GoalsProps) {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Цели
            </h1>
            <p className="text-sm text-slate-400">Достигайте большего</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Plus className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors overflow-hidden">
                <div className="p-5">
                  {/* Goal Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{goal.icon}</div>
                      <div>
                        <h3 className="text-lg text-white">{goal.name}</h3>
                        <p className="text-sm text-slate-300">
                          {formatCurrency(goal.targetAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl text-blue-400">{percentage.toFixed(0)}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 1, ease: 'easeOut' }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full"
                        style={{
                          backgroundSize: '200% 100%',
                        }}
                      />
                      <motion.div
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 0%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        style={{
                          backgroundSize: '200% 100%',
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-300 mb-1">Накоплено</p>
                      <p className="text-green-400">{formatCurrency(goal.currentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-300 mb-1">Осталось</p>
                      <p className="text-orange-400">{formatCurrency(remaining)}</p>
                    </div>
                  </div>

                  {/* AI Suggestion */}
                  {percentage < 100 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20"
                    >
                      <p className="text-xs text-purple-300">
                        💡 Откладывая {formatCurrency(remaining / 6)} в месяц, вы достигнете цели
                        за полгода
                      </p>
                    </motion.div>
                  )}

                  {/* Completed Badge */}
                  {percentage >= 100 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: index * 0.1 + 0.4 }}
                      className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-500/30"
                    >
                      <p className="text-sm text-green-400 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Цель достигнута! 🎉
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-blue-300">Общий прогресс</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-200">Всего целей</span>
                <span className="text-lg text-white">{goals.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-200">Достигнуто</span>
                <span className="text-lg text-green-400">
                  {goals.filter((g) => g.currentAmount >= g.targetAmount).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-200">В процессе</span>
                <span className="text-lg text-blue-400">
                  {goals.filter((g) => g.currentAmount < g.targetAmount).length}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200">Общая сумма целей</span>
                  <span className="text-lg text-white">
                    {formatCurrency(goals.reduce((sum, g) => sum + g.targetAmount, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
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
