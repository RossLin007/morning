
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/components/ui/Icon';
import { Image } from '@/components/ui/Image';
import { CourseHeader } from '@/components/business/course/CourseHeader'; 
import { PracticeSection } from '@/components/business/course/PracticeSection'; 
import { Comment } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getLessonById } from '@/data/courseData';
import { useHaptics } from '@/hooks/useHaptics';
import { useGamification } from '@/contexts/GamificationContext';
import { useToast } from '@/contexts/ToastContext';
import { aiService } from '@/lib/ai'; 
import { ASSETS, STORAGE_KEYS } from '@/lib/constants'; 
import { AudioPlayer } from '@/components/ui/AudioPlayer'; 

import { practiceSchema } from '@/lib/validations'; 
import { useProgress } from '@/hooks/useProgress';

const initialComments: Comment[] = [
  { id: 'c1', userName: '刘伟', userAvatar: 'https://picsum.photos/50/50?random=30', content: '这一章对于“选择权”的解释真的让我豁然开朗，以前总觉得自己没有选择。', time: '10分钟前', likes: 12 },
  { id: 'c2', userName: 'Amanda', userAvatar: 'https://picsum.photos/50/50?random=31', content: '有没有同学一起组队练习“积极语言”的？求队友！', time: '35分钟前', likes: 8 },
];

export const CourseDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const { trigger: haptic } = useHaptics();
  const { addXp, addCoins } = useGamification(); 
  const { showToast } = useToast(); 
  const { completedLessons, completeLesson } = useProgress();
  
  const lesson = getLessonById(id);
  // Robust ID fallback
  const lessonId = lesson ? lesson.id : `p1-d${id || '1'}`; 

  // Special Day Logic (Day 1 & Day 21)
  const isCeremonyDay = lesson?.day === 1 || lesson?.day === 21;
  const isFinale = lesson?.day === 21;

  // Ambient Sound State
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const [showComments, setShowComments] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  
  // Data Persistence
  const [checkins, setCheckins] = useLocalStorage<string[]>(STORAGE_KEYS.CHECKINS, []);
  
  // Comments Persistence (Local Mock)
  const [localComments, setLocalComments] = useLocalStorage<Comment[]>(`mr_comments_${lessonId}`, initialComments);
  const [newComment, setNewComment] = useState('');

  // AI Summary State
  const [summary, setSummary] = useLocalStorage<string | null>(`mr_summary_${lessonId}`, null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const isCompleted = completedLessons.includes(lessonId);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [textSize, setTextSize] = useState('text-base');
  
  // Selection Highlight
  const [showHighlightBtn, setShowHighlightBtn] = useState(false);
  const [selectionRect, setSelectionRect] = useState<{top:number, left:number} | null>(null);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(Number(totalScroll / windowHeight));
      setHeaderVisible(totalScroll > 280); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ambient Audio
  useEffect(() => {
     if (isAmbientOn) {
         if (!ambientAudioRef.current) {
             ambientAudioRef.current = new Audio(ASSETS.AMBIENT_RAIN);
             ambientAudioRef.current.loop = true;
             ambientAudioRef.current.volume = 0.3;
         }
         ambientAudioRef.current.play();
     } else {
         ambientAudioRef.current?.pause();
     }
     return () => { ambientAudioRef.current?.pause(); };
  }, [isAmbientOn]);

  // Selection Listener
  useEffect(() => {
      const handleSelection = () => {
          const selection = window.getSelection();
          if (selection && selection.toString().length > 0) {
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              setSelectionRect({
                  top: rect.top + window.scrollY - 40,
                  left: rect.left + (rect.width / 2) - 30
              });
              setShowHighlightBtn(true);
          } else {
              setShowHighlightBtn(false);
          }
      };
      document.addEventListener('mouseup', handleSelection);
      return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleGenerateSummary = async () => {
      if (summary) return;
      setIsSummarizing(true);
      haptic('medium');
      
      try {
          const prompt = `
          请将以下晨读课程内容提炼为 3 个简短的核心要点（Bullet Points），作为“今日导读”。
          每点不超过 20 字，保留最精华的理念。
          课程内容：${lesson?.content}
          `;
          
          const text = await aiService.generateText(prompt);
          if (text) {
              setSummary(text);
              showToast("AI 导读已生成", "success");
              haptic('success');
          }
      } catch (error) {
          console.error(error);
          showToast("生成失败，请稍后重试", "error");
      } finally {
          setIsSummarizing(false);
      }
  };

  const handleComplete = () => {
    haptic('success');
    if (!completedLessons.includes(lessonId)) {
        completeLesson(lessonId);
        addXp(isFinale ? 200 : 50, isFinale ? '完成结营' : '完成课程');
        addCoins(isFinale ? 50 : 10, '课程奖励');
    }
    const today = new Date().toISOString().split('T')[0];
    if (!checkins.includes(today)) {
        setCheckins([...checkins, today]);
    }
    setShowCelebration(true);
  };

  const handlePostComment = () => {
     if (!newComment.trim()) return;
     const comment: Comment = {
        id: Date.now().toString(),
        userName: '我',
        userAvatar: ASSETS.DEFAULT_AVATAR,
        content: newComment,
        time: '刚刚',
        likes: 0
     };
     setLocalComments([comment, ...localComments]);
     setNewComment('');
     haptic('medium');
     showToast("评论已发布", 'success');
  };

  // Memoized Content
  const memoizedContent = useMemo(() => (
      <ReactMarkdown>{lesson?.content || ''}</ReactMarkdown>
  ), [lesson?.content]);

  const memoizedSummary = useMemo(() => (
      summary ? <ReactMarkdown>{summary}</ReactMarkdown> : null
  ), [summary]);

  if (!lesson) return <div className="min-h-screen flex items-center justify-center text-gray-500">加载中...</div>;

  return (
    <div className={`relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-white dark:bg-background-dark animate-fade-in font-sans ${isCeremonyDay ? 'selection:bg-yellow-200 dark:selection:bg-yellow-800' : ''}`}>
      
      {/* Componentized Header */}
      <CourseHeader 
        title={lesson.title}
        isVisible={headerVisible}
        scrollProgress={scrollProgress}
        textSize={textSize}
        isAmbientOn={isAmbientOn}
        onBack={() => navigate('/reading')}
        onToggleAmbient={() => { setIsAmbientOn(!isAmbientOn); showToast(isAmbientOn ? "环境音已关闭" : "雨声已开启"); }}
        onToggleSettings={() => setShowSettings(!showSettings)}
        showSettings={showSettings}
        setTextSize={setTextSize}
      />

      {/* Highlight Button */}
      {showHighlightBtn && selectionRect && (
        <button style={{ top: selectionRect.top, left: selectionRect.left }} className="fixed z-50 bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl animate-fade-in-up flex items-center gap-1"
           onClick={() => {
               haptic('medium');
               navigate('/note/new', { state: { content: window.getSelection()?.toString() } });
               setShowHighlightBtn(false);
           }}
        >
           <Icon name="edit_note" className="text-sm" /> 记录灵感
        </button>
      )}

      {/* Hero Section */}
      <div className="-mt-[72px] w-full relative h-[360px] group">
        <Image 
            src={lesson.image || ASSETS.PLACEHOLDER_IMAGE}
            alt={lesson.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
            containerClassName="absolute inset-0"
        />
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-black/30 ${isCeremonyDay ? 'from-yellow-900/50 dark:from-black' : 'from-white dark:from-background-dark'}`}></div>
        
        {/* Ceremony Effect: Particles */}
        {isCeremonyDay && (
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 size-2 bg-yellow-400 rounded-full animate-bounce opacity-70"></div>
                <div className="absolute top-1/2 right-1/3 size-1 bg-white rounded-full animate-pulse delay-75"></div>
                <div className="absolute bottom-1/3 right-10 size-3 bg-orange-300 rounded-full animate-bounce delay-150 opacity-50"></div>
            </div>
        )}

        <div className="absolute bottom-0 left-0 p-6 w-full animate-fade-in-up">
           <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${isCeremonyDay ? 'bg-yellow-500 text-black' : 'bg-primary text-white'}`}>DAY {lesson.day.toString().padStart(2, '0')}</span>
              <span className="text-white/80 dark:text-white/60 text-xs font-bold uppercase tracking-wider">7 Habits Series</span>
           </div>
           <h1 className={`text-3xl md:text-4xl font-black leading-tight tracking-tight font-display mb-2 drop-shadow-md ${isCeremonyDay ? 'text-white' : 'text-text-main dark:text-white'}`}>{lesson.title}</h1>
           <p className={`text-sm font-medium flex items-center gap-1 ${isCeremonyDay ? 'text-white/80' : 'text-text-main/70 dark:text-gray-300'}`}><Icon name="schedule" className="text-xs" /> 预计阅读 {lesson.duration}</p>
        </div>
      </div>

      {/* Media Player */}
      <div className="px-4 w-full max-w-2xl mx-auto -mt-4 relative z-10">
        <AudioPlayer lessonId={lessonId} totalSeconds={lesson.totalSeconds} title={lesson.title} />
      </div>

      {/* Today's Goals */}
      <div className="px-4 mt-8 w-full max-w-2xl mx-auto">
        <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight mb-3 flex items-center gap-2 font-display"><Icon name="target" className="text-primary" /> 本课要点</h3>
        <div className={`rounded-xl p-4 border ${isCeremonyDay ? 'bg-[#FFFDF5] dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800' : 'bg-[#F5F7F5] dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'}`}>
          <ul className="space-y-3">
             {lesson.points.map((point, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <div className={`size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isCeremonyDay ? 'bg-yellow-500/20 text-yellow-600' : 'bg-primary/20 text-primary'}`}><Icon name={point.icon} className="text-xs font-bold" /></div>
                  <div><p className="text-text-main dark:text-gray-200 text-sm font-bold mb-0.5">{point.title}</p><p className="text-text-secondary dark:text-gray-400 text-xs leading-relaxed">{point.desc}</p></div>
                </li>
             ))}
          </ul>
        </div>
      </div>

      {/* Rich Text Content */}
      <article className={`px-6 mt-8 w-full max-w-2xl mx-auto pb-4 transition-all duration-300 ${textSize}`}>
        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-8 prose-headings:font-display first-letter:float-left first-letter:text-5xl first-letter:pr-2 first-letter:font-serif first-letter:text-primary">
          {lesson.quote && (
            <blockquote className="my-8 p-6 bg-gradient-to-br from-primary/5 to-transparent border-l-4 border-primary rounded-r-xl not-italic relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
                <Icon name="format_quote" className="absolute top-2 left-2 text-primary/20 text-4xl" />
                <p className="text-lg font-serif text-text-main dark:text-gray-200 relative z-10 italic">"{lesson.quote.text}"</p>
                <footer className="mt-3 text-sm text-primary font-bold font-sans flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-primary/50"></span>
                    {lesson.quote.author}
                </footer>
            </blockquote>
          )}
          
          <div className="mb-8">
              {!summary ? (
                  <button onClick={handleGenerateSummary} disabled={isSummarizing} className="w-full py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-sm shadow-sm hover:scale-[1.02] transition-transform active:scale-95">
                      {isSummarizing ? <Icon name="auto_awesome" className="animate-spin" /> : <Icon name="auto_awesome" />}
                      {isSummarizing ? 'AI 正在提炼精华...' : '生成 AI 导读'}
                  </button>
              ) : (
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-900/30 animate-fade-in-up">
                      <div className="flex items-center gap-2 mb-3 text-purple-700 dark:text-purple-300"><Icon name="auto_awesome" className="text-sm" filled /><span className="text-xs font-bold uppercase tracking-widest">AI Summary</span></div>
                      <div className="prose prose-sm dark:prose-invert">{memoizedSummary}</div>
                  </div>
              )}
          </div>
          {memoizedContent}
        </div>
      </article>

      <PracticeSection lessonId={lessonId} />

      <div className="px-6 mt-4 w-full max-w-2xl mx-auto flex justify-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
         <button onClick={() => navigate('/note/new')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
            <div className="size-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center"><Icon name="edit_note" /></div><span className="text-xs">笔记</span>
         </button>
      </div>

      <section className="px-4 mt-6 w-full max-w-2xl mx-auto pb-6">
        <button onClick={() => setShowComments(!showComments)} className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4 hover:bg-gray-100 transition-colors">
            <span className="font-bold text-text-main dark:text-white flex items-center gap-2 text-sm"><Icon name="forum" className="text-primary" /> 学员讨论 ({localComments.length})</span>
            <Icon name={showComments ? "expand_less" : "expand_more"} className="text-gray-400" />
        </button>
        {showComments && (
            <div className="flex flex-col gap-4 animate-fade-in-up">
                <div className="flex gap-2 mb-2">
                   <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="发表你的看法..." className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm outline-none text-text-main dark:text-white border border-transparent focus:border-primary/50 transition-colors" onKeyDown={(e) => e.key === 'Enter' && handlePostComment()} />
                   <button onClick={handlePostComment} className="size-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95"><Icon name="send" className="text-sm" /></button>
                </div>
                {localComments.map(comment => (
                    <div key={comment.id} className="flex gap-3 p-3 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-50 dark:border-gray-800">
                        <Image src={comment.userAvatar} containerClassName="size-8 rounded-full" className="size-8 object-cover" alt="" />
                        <div className="flex-1">
                            <div className="flex items-baseline justify-between"><span className="text-sm font-bold text-text-main dark:text-white">{comment.userName}</span><span className="text-xs text-gray-400">{comment.time}</span></div>
                            <p className="text-sm text-text-sub dark:text-gray-300 mt-1 leading-relaxed">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </section>

      <div className="h-20"></div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 p-4 shadow-up z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col relative overflow-hidden">
             {scrollProgress > 0.95 && <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse"></div>}
            <span className="text-xs text-text-secondary dark:text-gray-400">今日任务</span>
            <span className="text-sm font-bold text-primary">阅读并打卡</span>
          </div>
          {isCompleted ? (
              <button disabled className="flex-1 flex items-center justify-center rounded-xl h-12 px-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-base font-bold transition-all cursor-default">
                <Icon name="check_circle" className="text-[20px] mr-2" filled /> 已完成
              </button>
          ) : (
              <button onClick={handleComplete} className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20 group">
                <span className="mr-2">完成打卡</span>
                <Icon name="check_circle" className="text-[20px] group-hover:translate-x-1 transition-transform" />
              </button>
          )}
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in backdrop-blur-sm">
           <div className="relative w-full max-w-sm mx-4 flex flex-col items-center">
              <div className="bg-[#FFFDF9] text-[#1A1A1A] p-6 rounded-[24px] shadow-2xl w-full text-center mb-6 animate-fade-in-up rotate-1 border-[6px] border-white">
                 <div className="uppercase tracking-widest text-[10px] text-gray-400 mb-4 border-b pb-2">Morning Ritual · Daily Wisdom</div>
                 <h2 className="font-serif text-xl font-bold italic leading-relaxed mb-6">"{lesson.quote?.text || '坚持即是胜利'}"</h2>
                 <div className="flex justify-between items-end">
                     <div className="text-left"><div className="text-3xl font-black font-display">{new Date().getDate()}</div><div className="text-xs font-bold uppercase">{new Date().toLocaleString('default', { month: 'short' })}</div></div>
                     <div className="text-right"><div className="size-12 bg-primary rounded-full flex items-center justify-center text-white font-bold"><Icon name="fingerprint" /></div></div>
                 </div>
              </div>
              <div className="w-full p-6 bg-[#1A1A1A] rounded-[32px] text-center border border-white/10 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className={`text-2xl font-black text-white mb-2 font-display ${isFinale ? 'text-yellow-400' : ''}`}>{isFinale ? '伟大旅程圆满' : '修行圆满'}</h2>
                {isFinale && <p className="text-xs text-yellow-500 mb-4">从依赖到独立，从独立到互赖</p>}
                <div className="flex justify-center gap-4 mb-6 mt-4">
                  <div className="flex flex-col items-center bg-white/5 p-3 rounded-2xl w-24"><span className="text-xl font-black text-primary">+{isFinale ? 200 : 50}</span><span className="text-[10px] text-gray-400 uppercase tracking-wide">Points</span></div>
                   <div className="flex flex-col items-center bg-white/5 p-3 rounded-2xl w-24"><span className="text-xl font-black text-orange-500">+{isFinale ? 50 : 10}</span><span className="text-[10px] text-gray-400 uppercase tracking-wide">Coins</span></div>
                </div>
                <button onClick={() => { setShowCelebration(false); navigate(-1); }} className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-transform">继续前行</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
