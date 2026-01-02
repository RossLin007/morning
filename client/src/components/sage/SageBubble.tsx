import React, { useEffect, useState } from 'react';

interface SageBubbleProps {
    text: string;
    className?: string;
}

export const SageBubble: React.FC<SageBubbleProps> = ({ text, className = '' }) => {
    const [displayedText, setDisplayedText] = useState('');

    // Simple typing effect
    useEffect(() => {
        let index = 0;
        setDisplayedText(''); // Reset on new text

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 30); // Typing speed

        return () => clearInterval(interval);
    }, [text]);

    return (
        <div className={`relative bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl rounded-tl-sm shadow-md border border-gray-100 dark:border-gray-800 ${className}`}>
            <p className="text-text-main dark:text-gray-200 text-sm leading-relaxed font-medium">
                {displayedText}
                <span className="animate-pulse inline-block w-1 h-3 bg-primary ml-1 align-middle opacity-50"></span>
            </p>
        </div>
    );
};
