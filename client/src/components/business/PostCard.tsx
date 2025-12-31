
import React, { memo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Image } from '@/components/ui/Image'; 
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  onLike?: (id: string) => void;
  highlightText?: string;
  compact?: boolean; 
}

const PostCardComponent: React.FC<PostCardProps> = ({ 
  post, 
  onClick, 
  onLike, 
  highlightText = '', 
  compact = true 
}) => {
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) onLike(post.id);
  };

  const renderContent = () => {
    if (!highlightText) return post.content;
    
    // Simple regex highlighting
    const parts = post.content.split(new RegExp(`(${highlightText})`, 'gi'));
    return parts.map((part, i) => 
        part.toLowerCase() === highlightText.toLowerCase() 
            ? <span key={i} className="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white rounded px-0.5">{part}</span> 
            : part
    );
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-[#151515] p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 transition-all flex flex-col ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}`}
    >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <Image 
                    src={post.user.avatar} 
                    alt={post.user.name}
                    containerClassName="size-10 rounded-full"
                    className="size-10"
                />
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-main dark:text-white">{post.user.name}</span>
                        <span className="text-[9px] bg-primary/10 text-primary px-1.5 rounded-md font-bold">Lv.{post.user.level}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{post.time}</span>
                </div>
            </div>
            {compact && <button className="text-gray-300 hover:text-gray-500" aria-label="More options"><Icon name="more_horiz" /></button>}
        </div>
        
        {/* Content */}
        <p className={`text-sm text-text-main dark:text-gray-300 leading-7 font-serif mb-4 whitespace-pre-wrap ${compact ? 'flex-1' : ''}`}>
            {renderContent()}
        </p>
        
        {/* Image Attachment */}
        {post.image && (
            <div className="rounded-2xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-800">
                <Image 
                    src={post.image} 
                    alt="Post attachment"
                    className="w-full h-full object-cover"
                    ratio="video" // Enforce 16:9 ratio to prevent CLS
                />
            </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center gap-6 pt-2 border-t border-transparent">
            <button 
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                aria-label={post.isLiked ? "Unlike" : "Like"}
            >
                <Icon name="favorite" className="text-lg" filled={post.isLiked} />
                {post.likes}
            </button>
            <button 
                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Comment"
            >
                <Icon name="chat_bubble" className="text-lg" />
                {post.comments}
            </button>
        </div>
    </div>
  );
};

// Optimization: Memoize the component to prevent re-renders in large lists when unrelated props change
export const PostCard = memo(PostCardComponent, (prev, next) => {
    return (
        prev.post.id === next.post.id &&
        prev.post.isLiked === next.post.isLiked &&
        prev.post.likes === next.post.likes &&
        prev.post.comments === next.post.comments &&
        prev.highlightText === next.highlightText &&
        prev.onClick === next.onClick // Ensure onClick reference stability in parent
    );
});
