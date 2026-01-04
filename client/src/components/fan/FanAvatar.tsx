import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface FanAvatarProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const FanAvatar: React.FC<FanAvatarProps> = ({ className = '', size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className={`relative ${sizeClasses[size]} ${className}`}>
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>

            {/* Avatar Container */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white to-primary/10 border-2 border-white/50 backdrop-blur-sm overflow-hidden flex items-center justify-center shadow-sm">
                {/* Fan Icon */}
                <div className="text-primary opacity-80">
                    <Icon name="spa" className={size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-lg'} />
                </div>

                {/* Subtle sheen */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-white/40 to-transparent rounded-bl-full"></div>
            </div>

            {/* Online/Active Status Indicator */}
            <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
    );
};
