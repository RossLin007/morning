import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Image } from '@/components/ui/Image';
import { NavBar } from '@/components/layout/NavBar';
import { usePost, useCommunity } from '@/hooks/useCommunity';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/contexts/ToastContext';

export const PostDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { trigger: haptic } = useHaptics();
    const { showToast } = useToast();

    // Optimistic Post from navigation state (for immediate render)
    const initialPost = location.state?.post;

    // Real Data Hooks
    const { post: fetchedPost, comments, isLoading, addComment, isSendingComment } = usePost(id || '');
    const { toggleLike } = useCommunity();

    const [commentText, setCommentText] = useState('');

    // Use fetched post if available, otherwise fallback to initial state
    const post = fetchedPost || initialPost;

    // Scroll to bottom on comment load if needed (optional)
    // useEffect(() => { ... }, [comments]);

    const handleLike = () => {
        if (!post) return;
        haptic('light');
        toggleLike(post.id);
    };

    const handlePostComment = async () => {
        if (!commentText.trim()) return;

        try {
            haptic('medium');
            await addComment(commentText);
            setCommentText('');
            showToast('评论已发布', 'success');
            haptic('success');
        } catch (error) {
            console.error(error);
            showToast('评论失败', 'error');
        }
    };

    if (!post && isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Icon name="sync" className="animate-spin text-gray-400 text-2xl" />
            </div>
        );
    }

    if (!post && !isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-gray-500 gap-4">
                <Icon name="search_off" className="text-4xl opacity-50" />
                <p>动态不存在或已被删除</p>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-bold">返回</button>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-white dark:bg-black font-sans animate-fade-in flex flex-col pb-20 relative">
            <NavBar
                title={
                    <div className="flex items-center gap-2">
                        <Image
                            src={post.user.avatar}
                            containerClassName="size-8 rounded-full"
                            className="size-8 rounded-full"
                            alt=""
                        />
                        <span className="text-sm font-bold text-text-main dark:text-white">{post.user.name}</span>
                    </div>
                }
            />

            <div className="p-6">
                <p className="text-base text-text-main dark:text-gray-200 leading-relaxed font-serif mb-4 whitespace-pre-wrap">
                    {post.content}
                </p>

                {post.image && (
                    <div className="rounded-2xl overflow-hidden mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
                        <Image src={post.image} className="w-full h-auto object-cover" alt="" />
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400 mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-2">
                        <span>{post.time}</span>
                    </div>
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${post.isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-50 dark:bg-gray-800'}`}
                    >
                        <Icon name="favorite" className="text-sm" filled={post.isLiked} />
                        <span>{post.likes} 赞</span>
                    </button>
                </div>

                <h3 className="font-bold text-sm text-text-main dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="chat" className="text-primary text-xs" />
                    全部评论 ({comments.length})
                </h3>

                <div className="space-y-6">
                    {isLoading && comments.length === 0 ? (
                        <div className="py-4 text-center text-gray-400"><Icon name="sync" className="animate-spin" /></div>
                    ) : comments.length === 0 ? (
                        <div className="py-10 text-center text-gray-400 text-sm bg-gray-50 dark:bg-[#151515] rounded-2xl">
                            抢沙发，发表第一个观点！
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="flex gap-3 animate-fade-in">
                                <Image
                                    src={comment.userAvatar}
                                    containerClassName="size-9 rounded-full shrink-0"
                                    className="size-9 rounded-full"
                                    alt=""
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-text-main dark:text-gray-300">{comment.userName}</span>
                                        <span className="text-[10px] text-gray-400">{comment.time}</span>
                                    </div>
                                    <p className="text-sm text-text-main dark:text-gray-400 mt-1 leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 flex gap-2 items-end z-50">
                <textarea
                    rows={1}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="写下你的想法..."
                    className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-2xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-primary/20 text-text-main dark:text-white transition-all max-h-32"
                    disabled={isSendingComment}
                />
                <button
                    onClick={handlePostComment}
                    disabled={!commentText.trim() || isSendingComment}
                    className="p-3 bg-primary text-white rounded-full shadow-lg disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center w-12 h-12"
                >
                    {isSendingComment ? <Icon name="sync" className="animate-spin text-sm" /> : <Icon name="send" className="text-sm" />}
                </button>
            </div>
        </div>
    );
};
