import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';
import type { Transaction } from '../App';

type AddTransactionProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  selectedTab: string;
};

const categories = {
  expense: [
    '🛒 Продукты',
    '🚗 Транспорт',
    '🏠 Аренда',
    '💡 Коммунальные',
    '🎉 Развлечения',
    '👕 Одежда',
    '🏥 Здоровье',
    '📚 Образование',
    '🍕 Рестораны',
    '💳 Другое',
  ],
  income: [
    '💰 Зарплата',
    '💼 Фриланс',
    '🎁 Подарок',
    '📈 Инвестиции',
    '🏆 Бонус',
    '💸 Другое',
  ],
};

const accounts = ['Kaspi', 'Halyk', 'Jusan', 'Freedom', 'Наличные'];

export function AddTransaction({ open, onClose, onAdd, selectedTab }: AddTransactionProps) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');
  const [account, setAccount] = useState('Kaspi');

  const handleSubmit = () => {
    if (!amount || !category) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    onAdd({
      amount: parseFloat(amount),
      type,
      category: category.replace(/[^\s\w\u0400-\u04FF]/g, '').trim(),
      comment,
      account,
      tabId: selectedTab,
    });

    toast.success('Операция добавлена!');
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep(1);
    setType('expense');
    setAmount('');
    setCategory('');
    setComment('');
    setAccount('Kaspi');
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-slate-900 rounded-t-3xl sm:rounded-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-white">Новая операция</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    s <= step ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Step 1: Type and Amount */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <Label className="text-slate-300 mb-3 block">Тип операции</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Card
                        onClick={() => setType('expense')}
                        className={`cursor-pointer transition-all ${
                          type === 'expense'
                            ? 'bg-gradient-to-br from-red-500 to-rose-500 border-0'
                            : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        <div className="p-4 flex items-center gap-3">
                          <TrendingDown className="w-6 h-6" />
                          <span className="text-white">Расход</span>
                        </div>
                      </Card>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Card
                        onClick={() => setType('income')}
                        className={`cursor-pointer transition-all ${
                          type === 'income'
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-0'
                            : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        <div className="p-4 flex items-center gap-3">
                          <TrendingUp className="w-6 h-6" />
                          <span className="text-white">Доход</span>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount" className="text-slate-200 mb-2 block">
                    Сумма (₸)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5000"
                    className="bg-slate-800 border-slate-700 text-3xl h-16 text-center text-white placeholder:text-slate-400"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!amount}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12"
                >
                  Далее
                </Button>
              </motion.div>
            )}

            {/* Step 2: Category */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <Label className="text-slate-200 mb-3 block">Категория</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories[type].map((cat) => (
                      <motion.div key={cat} whileTap={{ scale: 0.95 }}>
                        <Card
                          onClick={() => setCategory(cat)}
                          className={`cursor-pointer transition-all ${
                            category === cat
                              ? type === 'income'
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-0'
                                : 'bg-gradient-to-br from-blue-500 to-cyan-500 border-0'
                              : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          <div className="p-3 text-center text-sm text-white">{cat}</div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-slate-700 hover:bg-slate-800 text-white"
                  >
                    Назад
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!category}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    Далее
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="comment" className="text-slate-200 mb-2 block">
                    Комментарий (необязательно)
                  </Label>
                  <Input
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Такси до центра"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label className="text-slate-200 mb-3 block">Счёт</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {accounts.map((acc) => (
                      <motion.div key={acc} whileTap={{ scale: 0.95 }}>
                        <Card
                          onClick={() => setAccount(acc)}
                          className={`cursor-pointer transition-all ${
                            account === acc
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-0'
                              : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          <div className="p-3 text-center text-sm text-white">{acc}</div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 border-slate-700 hover:bg-slate-800 text-white"
                  >
                    Назад
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    Добавить
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
