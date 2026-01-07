import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface FanrenCardProps {
    id: string;
    authorName: string;
    authorAvatar: string;
    actionType: string; // 动作类型: "写了日记", "分享了金句" 等
    highlightText?: string; // 只有在有特定高亮词时才传
    timestamp: string;
}

export const FanrenCard: React.FC<FanrenCardProps> = ({
    id,
    authorName,
    authorAvatar,
    actionType,
    highlightText,
    timestamp,
}) => {
    const navigate = useNavigate();

    // 提取动作文本和高亮文本，如果没有高亮词，就尝试自动匹配常见的
    // 这里为了简单，直接根据 props 渲染

    return (
        <div
            onClick={() => navigate(`/post/${id}`)}
            className="flex items-center gap-4 px-5 py-3.5 bg-white active:bg-gray-50 dark:bg-[#0A0A0A] dark:active:bg-white/5 transition-colors"
        >
            {/* Avatar */}
            <div className="relative">
                <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-11 h-11 rounded-full object-cover shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-800"
                />
            </div>

            {/* Content Content - Centered vertically */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-[15px] text-[#1a1a1a] dark:text-white">
                        {authorName}
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                        {timestamp}
                    </span>
                </div>

                <p className="text-[14px] text-gray-500 dark:text-gray-400">
                    <span>{actionType.replace(highlightText || '', '')}</span>
                    {highlightText && (
                        <span className="text-[#4E7CFE] font-medium ml-1">
                            {highlightText}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};
