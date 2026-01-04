
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';

interface NavBarProps {
    title: string;
    right?: React.ReactNode;
    showBack?: boolean;
    onBack?: () => void;
    className?: string; // Allow custom overrides if absolutely necessary
}

export const NavBar: React.FC<NavBarProps> = ({
    title,
    right,
    showBack = true,
    onBack,
    className = ''
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className={`sticky top-0 z-50 pt-safe bg-[#FAFAFA] dark:bg-[#111] transition-all ${className}`}>
            <div className="relative h-[44px] flex items-center justify-between px-4">
                {/* Left: Back Button */}
                <div className="flex-1 flex items-center justify-start">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="w-[44px] h-[44px] flex items-center justify-center -ml-2 rounded-full active:bg-gray-100 dark:active:bg-white/10 transition-colors"
                            aria-label="Go back"
                        >
                            <Icon name="arrow_back" className="text-[24px] text-text-main dark:text-white" />
                        </button>
                    )}
                </div>

                {/* Center: Title */}
                <div className="flex-none max-w-[50%] flex items-center justify-center">
                    <h1 className="text-[17px] font-bold text-text-main dark:text-white truncate">
                        {title}
                    </h1>
                </div>

                {/* Right: Actions or Placeholder */}
                <div className="flex-1 flex items-center justify-end">
                    {right}
                </div>
            </div>
        </header>
    );
};
