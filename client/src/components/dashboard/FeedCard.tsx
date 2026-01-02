import React from 'react';
import { Icon } from '@/components/ui/Icon';

export interface FeedCardProps {
    type: 'reading' | 'reflection' | 'partner' | 'system' | 'chat-user' | 'chat-ai' | 'feedback' | 'summary' | 'reward' | 'insight';
    title?: string;
    content: string;
    image?: string;
    meta?: string;
    icon?: string; // Allow override
    onClick?: () => void;
    actionLabel?: string;
    isPinned?: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({ type, title, content, image, meta, icon, onClick, actionLabel, isPinned }) => {

    // Message Bubble Styling for Chat Types
    if (type === 'chat-user' || type === 'chat-ai') {
        const isUser = type === 'chat-user';
        return (
            <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                    max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${isUser
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-white dark:bg-[#1A1A1A] text-text-main dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-bl-sm'}
                `}>
                    {content}
                </div>
            </div>
        );
    }

    // Standard Feed Card Styling
    const getCardStyles = () => {
        if (isPinned) return 'bg-white dark:bg-[#1A1A1A] border-primary/40 dark:border-primary/40 shadow-md ring-1 ring-primary/10';

        switch (type) {
            case 'reading':
                return 'bg-white dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800';
            case 'partner':
                return 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30';
            case 'insight':
                return 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30';
            case 'reward':
                return 'bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-800/30';
            default:
                return 'bg-white dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800';
        }
    };

    const getIcon = () => {
        if (icon) return icon;
        switch (type) {
            case 'reading': return 'auto_stories';
            case 'reflection': return 'edit_note';
            case 'partner': return 'group';
            case 'system': return 'info';
            case 'feedback': return 'done_all';
            case 'summary': return 'summarize';
            case 'reward': return 'military_tech';
            case 'insight': return 'lightbulb';
            default: return 'circle';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'reading': return 'text-primary';
            case 'reflection': return 'text-orange-500';
            case 'partner': return 'text-blue-500';
            case 'system': return 'text-gray-400';
            case 'feedback': return 'text-green-500';
            case 'reward': return 'text-yellow-500';
            case 'insight': return 'text-purple-500';
            case 'summary': return 'text-teal-500';
            default: return 'text-gray-400';
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
                group relative p-5 rounded-[24px] border transition-all duration-300
                ${isPinned ? 'mb-6' : 'mb-3'}
                ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99]' : ''}
                ${getCardStyles()}
            `}
        >
            {/* Pinned Indicator */}
            {isPinned && (
                <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full shadow-sm tracking-wider uppercase flex items-center gap-1">
                    <Icon name="push_pin" className="text-xs" />
                    PINNED
                </div>
            )}

            <div className="flex items-start gap-4">
                {/* Image or Icon */}
                {image ? (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={image} alt={title} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className={`w-10 h-10 rounded-full bg-white dark:bg-black/20 flex items-center justify-center flex-shrink-0 border border-gray-50 dark:border-white/5`}>
                        <Icon name={getIcon()} className={`${getIconColor()} text-xl`} />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    {/* Meta Header */}
                    {meta && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold tracking-wider uppercase ${getIconColor()}`}>
                                {type.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400">• {meta}</span>
                        </div>
                    )}

                    {/* Title */}
                    {title && <h3 className="text-base font-bold text-text-main dark:text-white mb-1 truncate">{title}</h3>}

                    {/* Content Snippet */}
                    <p className="text-sm text-text-sub dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {content}
                    </p>

                    {/* Optional Action Button */}
                    {actionLabel && (
                        <div className="mt-3 flex items-center text-primary text-xs font-bold group-hover:underline">
                            {actionLabel}
                            <Icon name="arrow_forward" className="text-sm ml-1" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
