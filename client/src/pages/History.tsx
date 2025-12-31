
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getLessonById } from '@/data/courseData';
import { GroupedVirtuoso } from 'react-virtuoso';

type TimelineEvent = {
    id: string;
    type: 'lesson' | 'checkin' | 'badge' | 'milestone';
    title: string;
    subtitle: string;
    date: Date;
    icon: string;
    color: string;
};

export const History: React.FC = () => {
  const navigate = useNavigate();
  
  // Get raw data
  const [completedLessons] = useLocalStorage<string[]>('mr_learning_progress', []);
  const [checkins] = useLocalStorage<string[]>('mr_checkins', []);

  // --- Data Processing (Memoized) ---
  const { events, groupCounts, groups } = useMemo(() => {
      const allEvents: TimelineEvent[] = [];

      // 1. Process Lessons
      completedLessons.forEach((id, index) => {
          const lesson = getLessonById(id);
          const date = new Date();
          date.setDate(date.getDate() - (completedLessons.length - index)); // Mock date logic
          
          allEvents.push({
              id: `lesson_${id}`,
              type: 'lesson',
              title: lesson?.title || '未知课程',
              subtitle: `完成第 ${lesson?.day} 天修习`,
              date: date,
              icon: 'menu_book',
              color: 'bg-primary text-white'
          });

          if ((index + 1) % 5 === 0) {
              allEvents.push({
                  id: `lvl_${index}`,
                  type: 'milestone',
                  title: '等级提升',
                  subtitle: `晋升为 Lv.${Math.floor((index + 1) / 5) + 1}`,
                  date: date,
                  icon: 'upgrade',
                  color: 'bg-yellow-500 text-white'
              });
          }
      });

      // 2. Process Checkins
      checkins.forEach(dateStr => {
          const date = new Date(dateStr);
          const hasLesson = allEvents.some(e => e.type === 'lesson' && e.date.toDateString() === date.toDateString());
          
          if (!hasLesson) {
              allEvents.push({
                  id: `chk_${dateStr}`,
                  type: 'checkin',
                  title: '每日打卡',
                  subtitle: '保持了连续记录',
                  date: date,
                  icon: 'check',
                  color: 'bg-green-100 text-green-600'
              });
          }
      });

      // Sort
      allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

      // Grouping Logic for Virtuoso
      const _groups: string[] = [];
      const _groupCounts: number[] = [];
      
      let currentMonth = '';
      let currentCount = 0;

      allEvents.forEach((event) => {
          const monthKey = event.date.toLocaleString('default', { month: 'long', year: 'numeric' });
          if (monthKey !== currentMonth) {
              if (currentMonth) {
                  _groups.push(currentMonth);
                  _groupCounts.push(currentCount);
              }
              currentMonth = monthKey;
              currentCount = 0;
          }
          currentCount++;
      });
      // Push last group
      if (currentMonth) {
          _groups.push(currentMonth);
          _groupCounts.push(currentCount);
      }

      return { events: allEvents, groups: _groups, groupCounts: _groupCounts };
  }, [completedLessons, checkins]);

  return (
    <div className="h-screen bg-[#F5F7F5] dark:bg-black font-sans animate-fade-in flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex-none sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <Icon name="arrow_back" className="text-text-main dark:text-white" />
        </button>
        <h1 className="text-base font-bold text-text-main dark:text-white">我的足迹</h1>
        <div className="w-8"></div>
      </header>

      {/* Content */}
      <div className="flex-1 p-0">
          {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                  <div className="size-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Icon name="footprint" className="text-4xl text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">千里之行，始于足下</p>
                  <button onClick={() => navigate('/reading')} className="mt-6 px-6 py-2 bg-white dark:bg-gray-800 rounded-full text-xs font-bold shadow-sm">开始第一步</button>
              </div>
          ) : (
              <GroupedVirtuoso
                style={{ height: '100%' }}
                groupCounts={groupCounts}
                groupContent={(index) => (
                    <div className="bg-[#F5F7F5]/95 dark:bg-black/95 backdrop-blur-sm py-2 px-6 sticky top-0 z-20 shadow-sm border-b border-gray-100/50 dark:border-gray-800">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{groups[index]}</h3>
                    </div>
                )}
                itemContent={(index) => {
                    const event = events[index];
                    return (
                        <div className="relative pl-14 pr-6 py-3 group">
                            {/* Vertical Line Segment */}
                            <div className="absolute top-0 bottom-0 left-[27px] w-[2px] bg-gray-200 dark:bg-gray-800 -z-10"></div>
                            
                            {/* Node Icon */}
                            <div className={`absolute left-[8px] top-4 size-10 rounded-full border-4 border-[#F5F7F5] dark:border-black flex items-center justify-center z-10 shadow-sm ${event.color}`}>
                                <Icon name={event.icon} className="text-lg" />
                            </div>
                            
                            {/* Content Card */}
                            <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl shadow-sm border border-gray-50 dark:border-gray-800 hover:shadow-md transition-all hover:scale-[1.01] cursor-default">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-text-main dark:text-white text-sm">{event.title}</h4>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                        {event.date.getDate()}日
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{event.subtitle}</p>
                            </div>
                        </div>
                    );
                }}
              />
          )}
      </div>
    </div>
  );
};
