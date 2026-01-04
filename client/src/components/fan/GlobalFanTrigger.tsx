import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { FanChat } from '@/pages/FanChat';
import { useAuth } from '@/contexts/AuthContext';

export const GlobalFanTrigger: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // Hide trigger if we are already on the Chat Page (if accessed via route)
    if (location.pathname === '/fan' || location.pathname === '/ai-coach') return null;

    const handleClick = () => {
        if (!user) {
            // Redirect to login if not authenticated
            navigate('/login', { state: { from: '/fan' } });
            return;
        }
        setIsOpen(true);
    };

    return (
        <>
            {/* The Trigger FAB */}
            <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+12px)] left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2">
                <button
                    onClick={handleClick}
                    className="size-12 rounded-full bg-white dark:bg-[#1A1A1A] text-primary shadow-lg ring-2 ring-gray-100 dark:ring-gray-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group"
                >
                    <Icon name="spa" className="text-xl group-hover:rotate-12 transition-transform" filled />
                </button>
            </div>

            {/* The Fan Chat Modal Overlay - Full Screen Glass */}
            {isOpen && (
                <div className="fixed inset-0 z-[70] bg-white/90 dark:bg-black/90 backdrop-blur-sm flex flex-col animate-fade-in">
                    <FanChat
                        isModal
                        onClose={() => setIsOpen(false)}
                    />
                </div>
            )}
        </>
    );
};
