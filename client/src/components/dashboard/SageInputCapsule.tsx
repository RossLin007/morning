import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface SageInputProps {
    onSend: (message: string) => void;
}

export const SageInputCapsule: React.FC<SageInputProps> = ({ onSend }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage('');
            // Optional: keep expanded or collapse? 
            // For a stream feel, maybe keep it focused? 
            // For now, collapse to show the 'Feed' view again.
            setIsExpanded(false);
        }
    };

    // Design: A floating capsule at the bottom center.
    // When inactive: A simplified "Ask Sage..." button.
    // When active: Expands to a full width input bar.

    return (
        <>
            {/* Backdrop when expanded to focus attention */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsExpanded(false)}
                ></div>
            )}

            <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 w-full max-w-md px-6`}>
                <form
                    onSubmit={handleSubmit}
                    className={`
                        relative flex items-center gap-3 overflow-hidden
                        bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md 
                        border border-primary/20 dark:border-primary/20 shadow-2xl
                        transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                        ${isExpanded ? 'rounded-[24px] p-2 pr-2 ring-2 ring-primary/20' : 'rounded-full py-3 px-5 hover:scale-105 cursor-pointer'}
                    `}
                    onClick={() => !isExpanded && setIsExpanded(true)}
                >
                    {/* Sage Icon / Indicator */}
                    <div className={`
                        flex items-center justify-center rounded-full transition-all duration-300
                        ${isExpanded ? 'w-8 h-8 bg-primary/10 text-primary' : 'w-6 h-6 text-primary'}
                    `}>
                        <Icon name="spa" className={isExpanded ? "text-lg" : "text-xl"} />
                    </div>

                    {/* Input Area */}
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Talk to Sage..."
                        className={`
                            flex-1 bg-transparent border-none outline-none text-text-main dark:text-white placeholder-gray-400 font-medium
                            ${isExpanded ? 'opacity-100' : 'cursor-pointer select-none'}
                        `}
                        readOnly={!isExpanded} // Prevent typing when collapsed to force click-to-expand logic if needed, or just let it focus.
                        autoFocus={isExpanded}
                    />

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className={`
                            flex items-center justify-center rounded-full transition-all duration-300
                            ${isExpanded
                                ? 'w-10 h-10 bg-primary text-white hover:bg-primary/90'
                                : 'w-8 h-8 bg-transparent text-gray-400 opacity-50'}
                        `}
                    >
                        <Icon name={isExpanded ? "arrow_upward" : "mic"} className="text-xl" />
                    </button>
                </form>
            </div>
        </>
    );
};
