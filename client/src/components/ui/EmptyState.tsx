
import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface EmptyStateProps {
  icon?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = "inbox", 
  message = "暂无数据", 
  actionLabel, 
  onAction,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-gray-400 animate-fade-in ${className}`}>
      <div className="size-16 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
        <Icon name={icon} className="text-3xl opacity-50" />
      </div>
      <p className="text-sm font-medium mb-6">{message}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-6 py-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-xs font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
