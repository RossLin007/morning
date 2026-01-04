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
    { name: '书友', icon: 'group', path: '/community' },
    { name: '我的', icon: 'person', path: '/profile' },
  ];

  return (
    <div className="w-full bg-[#F7F7F7] dark:bg-[#111] pb-safe transition-all duration-300 border-t border-gray-100 dark:border-gray-800">
      <div className="flex justify-around items-center h-[60px]">
        {navItems.map((item, index) => (
          <React.Fragment key={item.path}>
            {index === 2 && <div className="w-16 flex-shrink-0" />}
            <button
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full gap-0 group ${isActive(item.path)
                ? 'text-[#07C160]'
                : 'text-[#181818] dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
            >
              <div className="relative">
                <Icon
                  name={item.icon}
                  filled={isActive(item.path)}
                  className="text-[29px]"
                />
              </div>
              <span className="text-[12px] font-normal">{item.name}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};