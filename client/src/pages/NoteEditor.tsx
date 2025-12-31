
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/components/ui/Icon';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Note, Post } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { aiService } from '@/lib/ai';
import { STORAGE_KEYS, ASSETS } from '@/lib/constants';
import { noteSchema, NoteForm } from '@/lib/validations';
import { PROMPTS } from '@/lib/prompts'; // Import

export const NoteEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { note?: Note, content?: string } | null;
  const { showToast } = useToast();
  const { trigger: haptic } = useHaptics();
  const { addXp, addCoins } = useGamification();
  const { user } = useAuth();

  const existingNote = state?.note;
  const initialContent = state?.content;

  // React Hook Form Setup
  const { register, handleSubmit, setValue, watch, getValues, formState: { errors, isValid, isSubmitting } } = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    mode: 'onChange',
    defaultValues: {
      title: existingNote?.title || '',
      content: existingNote?.content || initialContent || '',
      tags: existingNote?.tags || []
    }
  });

  const content = watch('content');
  const tags = watch('tags') || [];
  
  const [currentTag, setCurrentTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.NOTES, []);
  const [posts, setPosts] = useLocalStorage<Post[]>('mr_posts', []);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (tags.length >= 5) {
          showToast("最多添加5个标签", "error");
          return;
      }
      const newTags = [...tags, currentTag.trim()];
      setValue('tags', newTags, { shouldValidate: true });
      setCurrentTag('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setValue('tags', newTags, { shouldValidate: true });
  };

  const insertMarkdown = (syntax: string) => {
      const current = getValues('content');
      setValue('content', current + syntax, { shouldValidate: true });
      textareaRef.current?.focus();
  };

  const handleGenerateInsight = async () => {
      const currentContent = getValues('content');
      if (!currentContent || currentContent.length < 10) {
          showToast("请先写下至少 10 个字的感悟", "error");
          return;
      }
      
      setIsAiThinking(true);
      haptic('medium');

      try {
          // Use Centralized Prompt
          const prompt = PROMPTS.NOTE_INSIGHT.GENERATE(currentContent);

          const text = await aiService.generateText(prompt);
          
          if (text) {
              const newContent = currentContent + "\n\n" + text + "\n";
              setValue('content', newContent, { shouldValidate: true });
              haptic('success');
              showToast("AI 共鸣已生成", "success");
              setTimeout(() => {
                  textareaRef.current?.scrollTo({ top: textareaRef.current.scrollHeight, behavior: 'smooth' });
              }, 100);
          }
      } catch (error) {
          console.error(error);
          showToast("AI 连接中断，请稍后再试", "error");
      } finally {
          setIsAiThinking(false);
      }
  };

  const handleImageUploadTrigger = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          showToast("正在模拟上传图片...");
          setTimeout(() => {
              const mockUrl = "https://picsum.photos/400/300?random=" + Date.now();
              insertMarkdown(`\n![Uploaded Image](${mockUrl})\n`);
              showToast("图片已插入", "success");
          }, 1000);
      }
  };

  const handleDelete = () => {
      if (!existingNote) return;
      if (window.confirm('确定要删除这篇笔记吗？')) {
          setNotes(notes.filter(n => n.id !== existingNote.id));
          haptic('warning');
          showToast('笔记已删除');
          navigate(-1);
      }
  };

  const handleShareToCommunity = async () => {
      const currentContent = getValues('content');
      const currentTitle = getValues('title');
      
      if (!currentContent.trim()) {
          showToast("内容为空，无法分享", "error");
          return;
      }
      
      if(window.confirm('确定要将这篇笔记发布到社区广场吗？')) {
          const newPost: Post = {
              id: Date.now().toString(),
              user: {
                  name: user?.user_metadata?.name || '我',
                  avatar: user?.user_metadata?.avatar || ASSETS.DEFAULT_AVATAR,
                  level: 3 
              },
              content: `${currentTitle ? `【${currentTitle}】\n` : ''}${currentContent}`,
              likes: 0,
              comments: 0,
              time: 'Just now',
              isLiked: false
          };
          
          setPosts([newPost, ...posts]);
          haptic('success');
          showToast("已分享至广场", "success");
          addXp(15, '笔记分享');
          addCoins(2, '分享奖励');
      }
  };

  const onSubmit = (data: NoteForm) => {
    const noteId = existingNote?.id || Date.now().toString();
    const newNote: Note = {
        id: noteId,
        title: data.title || '未命名笔记',
        content: data.content,
        tags: data.tags || [],
        date: new Date().toISOString().split('T')[0]
    };
    
    if (existingNote) {
        setNotes(notes.map(n => n.id === noteId ? newNote : n));
    } else {
        setNotes([newNote, ...notes]);
    }

    showToast("笔记已保存", "success");
    haptic('success');
    setTimeout(() => {
        navigate(-1);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-background-dark animate-fade-in font-sans relative">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="text-gray-500 dark:text-gray-400 font-medium text-sm hover:text-gray-800 dark:hover:text-white transition-colors">取消</button>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button onClick={() => setIsPreview(false)} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!isPreview ? 'bg-white dark:bg-black shadow-sm text-primary' : 'text-gray-400'}`}>编辑</button>
            <button onClick={() => setIsPreview(true)} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${isPreview ? 'bg-white dark:bg-black shadow-sm text-primary' : 'text-gray-400'}`}>预览</button>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={handleShareToCommunity} type="button" className="text-gray-400 hover:text-blue-500 transition-colors tooltip" title="分享到社区"><Icon name="share" className="text-xl" /></button>
            {existingNote && <button onClick={handleDelete} type="button" className="text-gray-400 hover:text-red-500 transition-colors"><Icon name="delete" className="text-xl" /></button>}
            <button 
                onClick={handleSubmit(onSubmit)} 
                disabled={!isValid || isSubmitting}
                className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full hover:bg-primary-dark transition-colors shadow-sm shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
            >
                保存
            </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 relative">
        {!isPreview ? (
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                <input 
                    {...register('title')}
                    type="text" 
                    placeholder="笔记标题" 
                    className="w-full text-2xl font-bold text-text-main dark:text-white bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-600 mb-2" 
                />
                {errors.title && <span className="text-red-500 text-xs mb-2">{errors.title.message}</span>}
                
                <div className="flex flex-wrap gap-2 mb-4">
                   {tags.map((tag, index) => (
                     <span key={index} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">
                        #{tag} <button type="button" onClick={() => removeTag(index)}><Icon name="close" className="text-[14px]" /></button>
                     </span>
                   ))}
                   <input 
                        type="text" 
                        placeholder={tags.length < 5 ? "添加标签..." : "标签已满"} 
                        value={currentTag} 
                        onChange={(e) => setCurrentTag(e.target.value)} 
                        onKeyDown={handleAddTag} 
                        disabled={tags.length >= 5}
                        className="bg-transparent text-sm text-primary placeholder-primary/50 outline-none min-w-[80px]" 
                   />
                </div>
                
                <textarea 
                    {...register('content')}
                    ref={(e) => {
                        register('content').ref(e);
                        textareaRef.current = e;
                    }}
                    placeholder="写下你的感悟 (支持 Markdown)..." 
                    className="flex-1 w-full resize-none text-base text-text-main dark:text-gray-200 bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 leading-relaxed font-mono" 
                />
                {errors.content && <span className="text-red-500 text-xs mt-2 block">{errors.content.message}</span>}
            </form>
        ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-7 prose-headings:font-display prose-img:rounded-xl prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-lg prose-blockquote:not-italic">
                <h1 className="mb-4">{getValues('title') || '未命名笔记'}</h1>
                {tags.length > 0 && <div className="flex gap-2 mb-6 not-prose">{tags.map(tag => <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">#{tag}</span>)}</div>}
                <ReactMarkdown>{content || '*暂无内容*'}</ReactMarkdown>
            </div>
        )}
      </div>

      {!isPreview && (
        <div className="border-t border-gray-100 dark:border-gray-800 p-2 bg-white dark:bg-surface-dark pb-safe relative z-20">
          {content && content.length > 10 && !isAiThinking && (
              <div className="absolute -top-12 right-4 animate-fade-in-up">
                  <button type="button" onClick={handleGenerateInsight} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform text-xs font-bold">
                      <Icon name="auto_awesome" className="text-sm" filled /> AI 共鸣
                  </button>
              </div>
          )}
          {isAiThinking && (
              <div className="absolute -top-10 left-0 right-0 flex justify-center animate-fade-in">
                  <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-md">
                      <Icon name="psychology" className="animate-spin text-sm" /> 思考中...
                  </span>
              </div>
          )}
          <div className="flex justify-between items-center px-2">
             <div className="flex gap-4 text-gray-400 dark:text-gray-500">
                <button type="button" onClick={() => insertMarkdown('**粗体**')} className="hover:text-primary transition-colors tooltip" title="Bold"><Icon name="format_bold" /></button>
                <button type="button" onClick={() => insertMarkdown('\n- 列表项')} className="hover:text-primary transition-colors tooltip" title="List"><Icon name="format_list_bulleted" /></button>
                <button type="button" onClick={() => insertMarkdown('\n# 标题')} className="hover:text-primary transition-colors tooltip" title="Header"><Icon name="title" /></button>
                <button type="button" onClick={() => insertMarkdown('> 引用')} className="hover:text-primary transition-colors tooltip" title="Quote"><Icon name="format_quote" /></button>
                <button type="button" onClick={handleImageUploadTrigger} className="hover:text-primary transition-colors tooltip" title="Insert Image"><Icon name="add_photo_alternate" /></button>
             </div>
             <button type="button" className={`text-xs font-mono transition-colors ${content.length < 10 ? 'text-orange-400' : 'text-gray-400 hover:text-primary'}`}>
                 {content.length} 字
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
