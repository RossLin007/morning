
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';

export const StorySuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-redirect after 3 seconds if no interaction, but maybe manual is better for celebration

    const handleHome = () => {
        navigate('/');
    };

    const handleView = () => {
        // If we have a post ID passed in state, go there, otherwise home
        const postId = location.state?.postId;
        if (postId) {
            navigate(`/post/${postId}`); // Assuming post detail route exists
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#111] flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-8 animate-fade-in-up">

                {/* Success Icon */}
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping opacity-50" />
                    <Icon name="check" className="text-4xl text-green-600 dark:text-green-400" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                        发布成功
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        你的故事已经分享给书友们了
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full max-w-xs mx-auto pt-8">
                    <button
                        onClick={handleView}
                        className="w-full py-3.5 px-6 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <span>查看动态</span>
                        <Icon name="arrow_forward" className="text-lg" />
                    </button>

                    <button
                        onClick={handleHome}
                        className="w-full py-3.5 px-6 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl font-medium transition-all"
                    >
                        返回首页
                    </button>
                </div>
            </div>
        </div>
    );
};
