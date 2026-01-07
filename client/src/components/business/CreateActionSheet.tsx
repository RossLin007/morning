import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useHaptics } from '@/hooks/useHaptics';

interface CreateActionSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CreateOption {
    id: string;
    icon: string;
    iconBg: string;
    title: string;
    subtitle: string;
    path?: string;
    action?: () => void;
}

export const CreateActionSheet: React.FC<CreateActionSheetProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { trigger: haptic } = useHaptics();

    const createOptions: CreateOption[] = [
        {
            id: 'story',
            icon: 'add_a_photo',
            iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
            title: '发 Story',
            subtitle: '记录此刻的觉察瞬间',
            path: '/story/new',
        },
        {
            id: 'diary',
            icon: 'edit_note',
            iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
            title: '写觉察日记',
            subtitle: '深度记录与反思',
            path: '/diary/new',
        },
        {
            id: 'share',
            icon: 'lightbulb',
            iconBg: 'bg-gradient-to-br from-purple-400 to-indigo-500',
            title: '分享感悟',
            subtitle: '发布到社区广场',
            path: '/community', // TODO: Create dedicated post page
        },
        {
            id: 'voice',
            icon: 'mic',
            iconBg: 'bg-gradient-to-br from-teal-400 to-emerald-500',
            title: '语音分享',
            subtitle: '用声音表达',
            path: '/fan', // Use AI coach for voice
        },
    ];

    const handleOptionClick = (option: CreateOption) => {
        haptic('medium');
        onClose();
        if (option.path) {
            setTimeout(() => navigate(option.path!), 150);
        } else if (option.action) {
            option.action();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] animate-fade-in"
                onClick={() => {
                    haptic('light');
                    onClose();
                }}
            />

            {/* Action Sheet */}
            <div className="fixed bottom-0 left-0 right-0 z-[85] animate-slide-up">
                <div className="bg-white dark:bg-[#1A1A1A] rounded-t-[28px] shadow-2xl pb-safe">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="px-6 pb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            记录你的觉察
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            说通及心通 — 通过表达实现内心的通透
                        </p>
                    </div>

                    {/* Options Grid */}
                    <div className="px-4 pb-6 grid grid-cols-2 gap-3">
                        {createOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionClick(option)}
                                className="flex flex-col items-center p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 
                                    hover:bg-gray-100 dark:hover:bg-gray-800 
                                    active:scale-95 transition-all duration-200
                                    border border-gray-100 dark:border-gray-700/50"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${option.iconBg} flex items-center justify-center shadow-lg mb-3`}>
                                    <Icon name={option.icon} className="text-white text-2xl" />
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {option.title}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center">
                                    {option.subtitle}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Cancel Button */}
                    <div className="px-4 pb-4">
                        <button
                            onClick={() => {
                                haptic('light');
                                onClose();
                            }}
                            className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-base
                                hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-[0.98] transition-all"
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
