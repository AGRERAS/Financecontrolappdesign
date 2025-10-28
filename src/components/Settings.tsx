import { motion } from 'motion/react';
import {
  User,
  CreditCard,
  Bell,
  Moon,
  Globe,
  Lock,
  Users,
  Download,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';

export function Settings() {
  const settingsSections = [
    {
      title: 'Аккаунт',
      items: [
        { icon: User, label: 'Профиль', action: 'profile' },
        { icon: CreditCard, label: 'Счета и карты', action: 'accounts', badge: '4' },
        { icon: Users, label: 'Семейный доступ', action: 'family' },
      ],
    },
    {
      title: 'Настройки',
      items: [
        { icon: Bell, label: 'Уведомления', action: 'notifications', toggle: true },
        { icon: Moon, label: 'Тёмная тема', action: 'theme', toggle: true, checked: true },
        { icon: Globe, label: 'Язык', action: 'language', value: 'Русский' },
      ],
    },
    {
      title: 'Безопасность',
      items: [
        { icon: Lock, label: 'Пароль и безопасность', action: 'security' },
        { icon: Download, label: 'Экспорт данных', action: 'export' },
      ],
    },
    {
      title: 'Поддержка',
      items: [
        { icon: HelpCircle, label: 'Помощь', action: 'help' },
        { icon: LogOut, label: 'Выйти', action: 'logout', danger: true },
      ],
    },
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Настройки
        </h1>
        <p className="text-sm text-slate-400">Управление приложением</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 border-0">
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h3 className="text-lg text-white">Ваше имя</h3>
                <p className="text-sm text-white/90">user@example.com</p>
                <p className="text-xs text-white/80 mt-1">Премиум аккаунт</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
          >
            <h3 className="text-sm text-slate-300 mb-3 px-1">{section.title}</h3>
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm divide-y divide-slate-700/50">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(71, 85, 105, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          item.danger
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={item.danger ? 'text-red-400' : 'text-white'}>{item.label}</p>
                        {item.value && (
                          <p className="text-sm text-slate-300">{item.value}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                          {item.badge}
                        </span>
                      )}
                      {item.toggle ? (
                        <Switch defaultChecked={item.checked} />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Version Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center py-4"
      >
        <p className="text-xs text-slate-500">FinTabs v1.0.0</p>
        <p className="text-xs text-slate-600 mt-1">© 2025 Все права защищены</p>
      </motion.div>
    </div>
  );
}
