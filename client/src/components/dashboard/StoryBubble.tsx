import React from 'react';
import { Icon } from '@/components/ui/Icon';

export interface StoryBubbleProps {
    id: string;
    name: string;
    avatar: string;
    hasNew?: boolean;
    isAddButton?: boolean;
    ringColor?: string; // gradient start color
}

export const StoryBubble: React.FC<StoryBubbleProps> = ({
    id,
    name,
    avatar,
    hasNew = false,
    isAddButton = false,
    ringColor = '#FF9A56',
}) => {
    if (isAddButton) {
        return (
            <div className="flex flex-col items-center gap-1.5 min-w-[72px]">
                <div className="relative">
                    <div className="w-[60px] h-[60px] rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-[#1A1A1A]">
                        <Icon name="add" className="text-2xl text-gray-400" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white dark:border-[#0A0A0A]">
                        <Icon name="add" className="text-xs text-white" />
                    </div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[64px]">{name}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer">
            <div
                className="p-[3px] rounded-full"
                style={{
                    background: hasNew
                        ? `linear-gradient(135deg, ${ringColor}, #FF6B6B, #FFE66D)`
                        : 'transparent',
                }}
            >
                <div className="p-[2px] rounded-full bg-white dark:bg-[#0A0A0A]">
                    <img
                        src={avatar}
                        alt={name}
                        className="w-[54px] h-[54px] rounded-full object-cover"
                    />
                </div>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[64px]">{name}</span>
        </div>
    );
};
