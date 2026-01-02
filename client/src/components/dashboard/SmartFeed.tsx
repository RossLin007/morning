import React from 'react';
import { FeedCard, FeedCardProps } from './FeedCard';

interface SmartFeedProps {
    items: FeedCardProps[];
}

export const SmartFeed: React.FC<SmartFeedProps> = ({ items }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 px-2 mb-2">
                YOUR SMART FEED
            </h2>
            <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                    <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <FeedCard {...item} />
                    </div>
                ))}
            </div>
        </div>
    );
};
