
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { SageChat } from '@/pages/SageChat';

export const GlobalSageTrigger: React.FC = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Hide trigger if we are already on the Chat Page (if accessed via route)
    if (location.pathname === '/chat') return null;

    return (
        <>
            {/* The Trigger FAB */}
            <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+12px)] left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2">
                <button
                    onClick={() => setIsOpen(true)}
                    className="size-12 rounded-full bg-white dark:bg-[#1A1A1A] text-primary shadow-lg ring-2 ring-gray-100 dark:ring-gray-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group"
                >
                    <Icon name="spa" className="text-xl group-hover:rotate-12 transition-transform" filled />
                </button>
            </div>

            {/* The Sage Chat Modal Overlay - Full Screen Glass */}
            {isOpen && (
                <div className="fixed inset-0 z-[70] bg-white/30 dark:bg-black/40 backdrop-blur-md flex flex-col animate-fade-in">
                    <SageChat
                        isModal
                        onClose={() => setIsOpen(false)}
                    />
                </div>
            )}
        </>
    );
};
