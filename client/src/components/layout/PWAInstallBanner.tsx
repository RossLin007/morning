
import React from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Icon } from '@/components/ui/Icon';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, triggerInstall } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-transparent border-b border-primary/10 px-6 py-3 flex items-center justify-between backdrop-blur-md sticky top-0 z-[60] animate-fade-in">
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
                <Icon name="install_desktop" className="text-sm" />
            </div>
            <div>
                <p className="text-xs font-bold text-text-main dark:text-white">安装桌面版 App</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">获得沉浸式离线阅读体验</p>
            </div>
        </div>
        <button 
            onClick={triggerInstall}
            className="px-4 py-1.5 rounded-full bg-white dark:bg-black text-xs font-bold text-primary shadow-sm hover:shadow-md transition-all active:scale-95 border border-primary/20"
        >
            立即安装
        </button>
    </div>
  );
};
