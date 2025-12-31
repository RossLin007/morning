
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, rightAction, className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800 px-6 py-4 flex items-center justify-between transition-all ${className}`}>
      <button 
        onClick={handleBack} 
        className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
      >
        <Icon name="arrow_back" className="text-text-main dark:text-white group-hover:scale-110 transition-transform" />
      </button>
      
      <h1 className="text-base font-bold text-text-main dark:text-white absolute left-1/2 -translate-x-1/2">
        {title}
      </h1>
      
      <div className="flex items-center">
        {rightAction || <div className="w-8" />}
      </div>
    </header>
  );
};
