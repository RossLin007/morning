import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: '首页', icon: 'home', path: '/' },
    { name: '晨读', icon: 'menu_book', path: '/reading' },
    { name: '社区', icon: 'forum', path: '/community' },
    { name: '我的', icon: 'person', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:bottom-8">
      <div className="bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl border-t md:border border-gray-100 dark:border-gray-800 pb-safe pt-2 px-2 w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl pointer-events-auto md:rounded-b-[32px] transition-all duration-300">
        <div className="flex justify-around items-center h-14 pb-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 group ${
                isActive(item.path) ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <div className="relative">
                <Icon 
                  name={item.icon} 
                  filled={isActive(item.path)} 
                  className={`text-[26px] transition-transform ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-105'}`} 
                />
                {item.path === '/community' && (
                   <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};