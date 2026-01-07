
import React from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Icon } from '@/components/ui/Icon';

const BANNER_DISMISSED_KEY = 'mr_pwa_banner_dismissed';

export const PWAInstallBanner: React.FC = () => {
    const { isInstallable, triggerInstall } = useInstallPrompt();
    const [isDismissed, setIsDismissed] = React.useState(() => {
        return localStorage.getItem(BANNER_DISMISSED_KEY) === 'true';
    });

    const handleDismiss = () => {
        localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
        setIsDismissed(true);
    };

    const handleInstall = () => {
        triggerInstall();
        handleDismiss();
    };

    if (!isInstallable || isDismissed) return null;

    return (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-transparent border-b border-primary/10 px-4 py-3 flex items-center justify-between backdrop-blur-md sticky top-0 z-[60] animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
                    <Icon name="install_desktop" className="text-sm" />
                </div>
                <div>
                    <p className="text-xs font-bold text-text-main dark:text-white">安装桌面版 App</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">获得沉浸式离线阅读体验</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleInstall}
                    className="px-4 py-1.5 rounded-full bg-white dark:bg-black text-xs font-bold text-primary shadow-sm hover:shadow-md transition-all active:scale-95 border border-primary/20"
                >
                    立即安装
                </button>
                <button
                    onClick={handleDismiss}
                    className="p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                    aria-label="关闭"
                >
                    <Icon name="close" className="text-[16px] text-gray-400" />
                </button>
            </div>
        </div>
    );
};
