
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useHaptics } from '@/hooks/useHaptics';
import { useTranslation } from '@/hooks/useTranslation';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { trigger: haptic } = useHaptics();
  const { t } = useTranslation();

  const actions = [
    { name: t('dashboard.quick_actions.notes'), icon: 'edit_note', path: '/notes', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { name: t('dashboard.quick_actions.history'), icon: 'history', path: '/history', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10' }, 
    { name: t('dashboard.quick_actions.community'), icon: 'spa', path: '/community', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/10' },
    { name: t('dashboard.quick_actions.coach'), icon: 'smart_toy', path: '/coach', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {actions.map((action) => (
        <button 
          key={action.path} 
          onClick={() => { haptic('light'); navigate(action.path); }}
          className="flex flex-col items-center gap-3 group"
        >
          <div className={`size-14 rounded-2xl flex items-center justify-center ${action.bg} ${action.color} border border-transparent dark:border-white/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
            <Icon name={action.icon} className="text-2xl opacity-90" />
          </div>
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">{action.name}</span>
        </button>
      ))}
    </div>
  );
};
