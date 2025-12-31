
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso'; 
import { Icon } from '@/components/ui/Icon';
import { PostCard } from '@/components/business/PostCard'; 
import { useCommunity } from '@/hooks/useCommunity';
import { useToast } from '@/contexts/ToastContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useGamification } from '@/contexts/GamificationContext';
import { useNetwork } from '@/hooks/useNetwork';
import { useTranslation } from '@/hooks/useTranslation';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { trigger: haptic } = useHaptics();
  const { addXp, addCoins } = useGamification();
  const isOnline = useNetwork();
  const { t } = useTranslation();
  
  const { 
      posts, 
      isLoading, 
      error, 
      createPost, 
      toggleLike, 
      isCreating, 
      refetch,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage
  } = useCommunity();
  
  // UI State
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleLike = (id: string) => {
     if (!isOnline) {
         showToast(t('community.offline_like_error'), "error");
         return;
     }
     haptic('light');
     toggleLike(id);
  };

  const handleImageClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          showToast(t('community.upload_image'));
          setTimeout(() => {
              setUploadedImage(`https://picsum.photos/400/300?random=${Date.now()}`);
              showToast(t('community.image_added'), "success");
          }, 1000);
      }
  };

  const handleTriggerPost = () => {
      if (!isOnline) {
          haptic('error');
          showToast(t('community.check_network'), "error");
          return;
      }
      setShowNewPostModal(true);
  };

  const handlePublish = async () => {
     if (!newPostContent.trim()) {
         showToast(t('community.input_empty'), "error");
         return;
     }

     if (!isOnline) {
         showToast(t('community.check_network'), "error");
         return;
     }

     try {
         await createPost({
             content: newPostContent,
             image_url: uploadedImage || undefined
         });

         setNewPostContent('');
         setUploadedImage(null);
         setShowNewPostModal(false);
         
         // Gamification & Feedback
         haptic('success');
         showToast(t('community.publish_success'), "success");
         addXp(20, '社区分享');
         addCoins(2, '活跃奖励');
     } catch (err) {
         showToast(t('community.publish_fail'), "error");
         console.error(err);
     }
  };

  // Filter posts locally for search (Virtualization works best with flat arrays)
  const filteredPosts = posts.filter(post => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return post.content.toLowerCase().includes(q) || post.user.name.toLowerCase().includes(q);
  });

  // --- Header Component for Virtuoso ---
  const FeedHeader = () => (
      <div className="pt-2 pb-4 px-6">
        {/* Live Room Banner */}
        {!showSearch && (
            <div 
            onClick={() => navigate('/live')}
            className="relative mb-6 overflow-hidden rounded-2xl bg-[#1A1A1A] p-4 shadow-lg cursor-pointer group border border-gray-800 md:max-w-2xl mx-auto"
            >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative size-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping"></div>
                        <Icon name="podcasts" className="text-white text-xl" />
                        <div className="absolute top-0 right-0 size-3 bg-red-500 rounded-full border-2 border-[#1A1A1A]"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                        {t('community.live_banner_title')}
                        <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Live</span>
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">{t('community.live_banner_desc', { count: 328 })}</p>
                    </div>
                </div>
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Icon name="arrow_forward" className="text-white text-sm" />
                </div>
            </div>
            </div>
        )}
        
        {/* Input Trigger */}
        {!showSearch && (
            <div 
            onClick={handleTriggerPost}
            className={`bg-white dark:bg-[#151515] p-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 mb-2 cursor-pointer transition-colors md:max-w-2xl mx-auto ${isOnline ? 'hover:bg-gray-50 dark:hover:bg-white/5' : 'opacity-60 grayscale'}`}
            >
                <div className="flex gap-4 items-center">
                <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    <Icon name={isOnline ? "edit" : "wifi_off"} />
                </div>
                <span className="text-sm text-gray-400">{isOnline ? t('community.share_hint') : t('community.offline_hint')}</span>
                </div>
            </div>
        )}

        {/* Empty / Error States inside list */}
        {isLoading && posts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <Icon name="sync" className="text-2xl mb-2 animate-spin opacity-50" />
                <p>{t('community.loading_sync')}</p>
            </div>
        )}
        {error && posts.length === 0 && (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                <Icon name="cloud_off" className="text-4xl mb-2 opacity-50" />
                <p className="mb-4">{t('community.error_connect')}</p>
                <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-white rounded-full text-xs font-bold">{t('community.retry')}</button>
            </div>
        )}
        {!isLoading && !error && filteredPosts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <Icon name="search_off" className="text-4xl mb-2 opacity-50" />
                <p>{searchQuery ? t('community.empty_search') : t('community.empty_list')}</p>
            </div>
        )}
      </div>
  );

  const FeedFooter = () => {
      if (!searchQuery && hasNextPage) {
          return (
            <div className="py-8 flex justify-center opacity-50">
                {isFetchingNextPage ? (
                    <Icon name="sync" className="animate-spin text-gray-400" />
                ) : (
                    <span className="text-xs text-gray-400">{t('community.load_more')}</span>
                )}
            </div>
          );
      }
      if (!hasNextPage && posts.length > 0) {
          return (
            <div className="py-8 flex flex-col items-center opacity-50">
                <Icon name="bedtime" className="text-lg text-gray-300 mb-1" />
                <p className="text-[10px] text-gray-300">{t('community.end_of_list')}</p>
            </div>
          );
      }
      return <div className="py-8"></div>;
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7F5] dark:bg-[#0A0A0A] font-sans">
      
      {/* Sticky Header */}
      <header className="flex-none sticky top-0 z-40 px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800 transition-all">
         {showSearch ? (
             <div className="flex-1 flex items-center gap-2 animate-fade-in">
                 <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1.5 flex items-center">
                     <Icon name="search" className="text-gray-400 text-sm mr-2" label="Search Icon" />
                     <input 
                        autoFocus
                        type="text" 
                        placeholder={t('community.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full text-text-main dark:text-white placeholder-gray-400"
                     />
                 </div>
                 <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-sm font-bold text-gray-500">{t('common.cancel')}</button>
             </div>
         ) : (
             <>
                <h2 className="text-lg font-display font-bold text-text-main dark:text-white">{t('community.title')}</h2>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/relationships')} className="relative" aria-label="Relationships">
                        <Icon name="spa" className="text-gray-500 dark:text-gray-400 text-xl hover:text-primary transition-colors" />
                        <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
                    </button>
                    <button onClick={() => setShowSearch(true)} className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors" aria-label="Search">
                        <Icon name="search" className="text-xl" />
                    </button>
                </div>
             </>
         )}
      </header>

      {/* Virtualized List Container */}
      <div className="flex-1 overflow-hidden">
          <Virtuoso
            style={{ height: '100%' }}
            data={filteredPosts}
            endReached={() => {
                if (hasNextPage && !isFetchingNextPage && isOnline && !searchQuery) {
                    fetchNextPage();
                }
            }}
            components={{
                Header: FeedHeader,
                Footer: FeedFooter,
            }}
            itemContent={(index, post) => (
                <div className="px-6 mb-4 md:max-w-2xl mx-auto">
                    <PostCard 
                        key={post.id}
                        post={post}
                        onClick={() => navigate(`/post/${post.id}`, { state: { post } })}
                        onLike={handleToggleLike}
                        highlightText={searchQuery}
                    />
                </div>
            )}
          />
      </div>

      {/* Bottom Padding for Navigation */}
      <div className="h-20 flex-none"></div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
           <div className="w-full max-w-sm bg-white dark:bg-[#1A1A1A] rounded-[32px] p-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-text-main dark:text-white">{t('community.publish_modal_title')}</h3>
                 <button onClick={() => setShowNewPostModal(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                    <Icon name="close" className="text-gray-500" />
                 </button>
              </div>
              
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={t('community.publish_placeholder')}
                className="w-full h-24 bg-gray-50 dark:bg-black/20 rounded-xl p-4 text-sm outline-none resize-none mb-4 text-text-main dark:text-white border border-transparent focus:border-primary/20"
                autoFocus
              />

              {uploadedImage && (
                  <div className="relative mb-4 rounded-xl overflow-hidden h-32 w-full">
                      <img src={uploadedImage} className="w-full h-full object-cover" alt="Preview" />
                      <button onClick={() => setUploadedImage(null)} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white">
                          <Icon name="close" className="text-xs" />
                      </button>
                  </div>
              )}

              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

              <div className="flex justify-end gap-3">
                 <button onClick={handleImageClick} className="p-2 text-gray-400 hover:text-primary transition-colors" aria-label="Add Image">
                    <Icon name="image" />
                 </button>
                 <button 
                   onClick={handlePublish}
                   disabled={isCreating}
                   className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 flex items-center gap-2"
                 >
                    {isCreating && <Icon name="sync" className="animate-spin text-xs" />}
                    {t('common.send')}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Community;
