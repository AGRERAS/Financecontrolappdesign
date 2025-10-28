import { motion } from 'motion/react';
import { Home, Receipt, BarChart3, Target, Settings } from 'lucide-react';

type BottomNavProps = {
  activeView: 'dashboard' | 'transactions' | 'analytics' | 'goals' | 'settings';
  onViewChange: (view: 'dashboard' | 'transactions' | 'analytics' | 'goals' | 'settings') => void;
};

const navItems = [
  { id: 'dashboard' as const, icon: Home, label: 'Главная' },
  { id: 'transactions' as const, icon: Receipt, label: 'Операции' },
  { id: 'analytics' as const, icon: BarChart3, label: 'Аналитика' },
  { id: 'goals' as const, icon: Target, label: 'Цели' },
  { id: 'settings' as const, icon: Settings, label: 'Настройки' },
];

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 pb-safe z-50"
    >
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="relative flex flex-col items-center gap-1 min-w-[60px]"
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -inset-2 bg-blue-500/20 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
