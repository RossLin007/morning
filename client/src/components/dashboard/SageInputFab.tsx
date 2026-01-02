import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface SageInputFabProps {
    onSend: (message: string) => void;
}

export const SageInputFab: React.FC<SageInputFabProps> = ({ onSend }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage('');
            setIsExpanded(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2">

            {/* Expanded Input Area */}
            {isExpanded && (
                <div className="mb-2 w-[calc(100vw-48px)] max-w-sm animate-fade-in-up origin-bottom-right">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1A1A1A] p-2 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex gap-2 items-center">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell Sage anything..."
                            className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-text-main dark:text-white placeholder-gray-400"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="p-2 bg-primary rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                        >
                            <Icon name="send" className="text-lg" />
                        </button>
                    </form>
                </div>
            )}

            {/* FAB Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 ${isExpanded
                        ? 'bg-white dark:bg-[#1A1A1A] text-text-main dark:text-white border border-gray-200 dark:border-gray-700'
                        : 'bg-primary text-white hover:scale-105'
                    }`}
            >
                <Icon name={isExpanded ? "close" : "chat_bubble"} className="text-xl" />
                <span className={`font-bold text-sm ${isExpanded ? 'hidden' : 'inline-block'}`}>Talk to Sage</span>
            </button>
        </div>
    );
};
