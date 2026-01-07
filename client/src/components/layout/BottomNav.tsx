import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { CreateActionSheet } from '@/components/business/CreateActionSheet';
import { useHaptics } from '@/hooks/useHaptics';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trigger: haptic } = useHaptics();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: '凡人', icon: 'home', path: '/' },
    { name: '晨读', icon: 'menu_book', path: '/reading' },
    { name: '书友', icon: 'group', path: '/community' },
    { name: '我的', icon: 'person', path: '/profile' },
  ];

  const handleCreateClick = () => {
    haptic('medium');
    setIsCreateOpen(true);
  };

  return (
    <>
      <div className="w-full bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl pb-safe transition-all duration-300 border-t border-gray-100/50 dark:border-gray-800/50">
        <div className="flex justify-around items-center h-[60px] relative">
          {/* Left Nav Items */}
          {navItems.slice(0, 2).map((item) => (
            <button
              key={item.path}
              onClick={() => {
                haptic('light');
                navigate(item.path);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 group transition-colors ${isActive(item.path)
                  ? ''
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              style={isActive(item.path) ? { color: '#58bd69' } : undefined}
            >
              <Icon
                name={item.icon}
                filled={isActive(item.path)}
                className="text-[24px]"
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          ))}

          {/* Center Create Button */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={handleCreateClick}
              className="relative -mt-5 w-14 h-14 rounded-full 
                bg-gradient-to-br from-primary via-primary to-emerald-600
                shadow-lg shadow-primary/30
                flex items-center justify-center
                hover:scale-105 active:scale-95 transition-all duration-300
                ring-4 ring-white dark:ring-[#111]"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-emerald-600 blur-lg opacity-40" />

              {/* Icon */}
              <Icon name="add" className="text-white text-3xl relative z-10" />

              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
            </button>
          </div>

          {/* Right Nav Items */}
          {navItems.slice(2).map((item) => (
            <button
              key={item.path}
              onClick={() => {
                haptic('light');
                navigate(item.path);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 group transition-colors ${isActive(item.path)
                  ? ''
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              style={isActive(item.path) ? { color: '#58bd69' } : undefined}
            >
              <Icon
                name={item.icon}
                filled={isActive(item.path)}
                className="text-[24px]"
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Action Sheet */}
      <CreateActionSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
};