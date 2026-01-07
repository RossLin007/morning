import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { FanChat } from '@/pages/FanChat';
import { useAuth } from '@/contexts/AuthContext';
import { useHaptics } from '@/hooks/useHaptics';

export const GlobalFanTrigger: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { trigger: haptic } = useHaptics();
    const [isOpen, setIsOpen] = useState(false);

    // Hide trigger if we are already on the Chat Page (if accessed via route)
    if (location.pathname === '/fan' || location.pathname === '/ai-coach' || location.pathname === '/coach') return null;

    const handleClick = () => {
        haptic('medium');
        if (!user) {
            // Redirect to login if not authenticated
            navigate('/login', { state: { from: '/fan' } });
            return;
        }
        setIsOpen(true);
    };

    return (
        <>
            {/* The Trigger FAB - Moved to bottom right corner */}
            <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+80px)] right-4 z-[60]">
                <button
                    onClick={handleClick}
                    className="relative w-12 h-12 rounded-full 
                        bg-gradient-to-br from-purple-500 to-indigo-600
                        shadow-lg shadow-purple-500/30
                        flex items-center justify-center 
                        hover:scale-110 active:scale-95 transition-all duration-300
                        group"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 blur-md opacity-50 group-hover:opacity-70 transition-opacity" />

                    {/* Icon */}
                    <Icon name="spa" className="text-white text-xl relative z-10 group-hover:rotate-12 transition-transform" filled />
                </button>

                {/* Label */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-900/80 backdrop-blur-sm rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    小凡
                </div>
            </div>

            {/* The Fan Chat Modal Overlay - Full Screen Glass */}
            {isOpen && (
                <div className="fixed inset-0 z-[70] bg-white/95 dark:bg-black/95 backdrop-blur-sm flex flex-col animate-fade-in">
                    <FanChat
                        isModal
                        onClose={() => setIsOpen(false)}
                    />
                </div>
            )}
        </>
    );
};
