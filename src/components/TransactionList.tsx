import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Transaction, FinancialTab } from '../App';

type TransactionListProps = {
  transactions: Transaction[];
  selectedTab: string;
  tabs: FinancialTab[];
};

export function TransactionList({ transactions, selectedTab, tabs }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions
    .filter((t) => t.tabId === selectedTab)
    .filter((t) => {
      if (filterType === 'all') return true;
      return t.type === filterType;
    })
    .filter((t) => {
      if (!searchQuery) return true;
      return (
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.comment?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const groupedTransactions = groupByDate(filteredTransactions);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Операции
        </h1>
        <p className="text-sm text-slate-400">
          {tabs.find((t) => t.id === selectedTab)?.name}
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по категории или комментарию"
            className="bg-slate-800 border-slate-700 pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setFilterType('all')}
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            className={
              filterType === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'border-slate-700 text-slate-200'
            }
          >
            Все
          </Button>
          <Button
            onClick={() => setFilterType('income')}
            variant={filterType === 'income' ? 'default' : 'outline'}
            size="sm"
            className={
              filterType === 'income'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'border-slate-700 text-slate-200'
            }
          >
            Доходы
          </Button>
          <Button
            onClick={() => setFilterType('expense')}
            variant={filterType === 'expense' ? 'default' : 'outline'}
            size="sm"
            className={
              filterType === 'expense'
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                : 'border-slate-700 text-slate-200'
            }
          >
            Расходы
          </Button>
        </div>
      </motion.div>

      {/* Transactions List */}
      <div className="space-y-6">
        {Object.entries(groupedTransactions).map(([date, txs], groupIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-slate-300" />
              <h3 className="text-sm text-slate-200">{date}</h3>
            </div>
            <div className="space-y-2">
              {txs.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            transaction.type === 'income'
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                              : 'bg-gradient-to-br from-red-500 to-rose-500'
                          }`}
                        >
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-6 h-6 text-white" />
                          ) : (
                            <TrendingDown className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-white">{transaction.category}</p>
                          {transaction.comment && (
                            <p className="text-sm text-slate-300">{transaction.comment}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">{transaction.account}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg ${
                            transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-slate-300">
                          {formatTime(transaction.date)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {filteredTransactions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-300">Операций не найдено</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function groupByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  
  transactions.forEach((transaction) => {
    const date = formatDate(transaction.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
  });

  return groups;
}

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) {
    return 'Сегодня';
  } else if (isSameDay(date, yesterday)) {
    return 'Вчера';
  } else {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
    }).format(date);
  }
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
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
