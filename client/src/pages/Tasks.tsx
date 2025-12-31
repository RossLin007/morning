
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Task } from '@/types';
import { CalendarModal } from '@/components/business/CalendarModal';
import { Modal } from '@/components/ui/Modal'; 
import { useToast } from '@/contexts/ToastContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useTimer } from '@/hooks/useTimer'; 
import { formatDuration } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useTasks } from '@/hooks/useTasks';

const initialTasksData: Task[] = [
  { id: 't1', type: 'reading', title: '晨读：第三章 主动积极', subtitle: '截止 10:00 AM · 预计 15 分钟', status: 'todo', thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAas8Qzq3oTF537fYi93FnoRhPNQ8q1i_bs-qUtYA0cmPhuV0ldTgO66Og1zKGVm41ZOiSRLuATaPAnt3XCwlfFME2jnKJiS86KL-fx53eZYSoRrQybiWGLUtMepdTnh5oXecgqpkYR9BGQ0I_Rbb6d8ceN49mLO7H2zpXtpnvchi2Ww6xZxNbjCmIgXlIIV3f4m33h1D_5ihd9qXnEYaMO_QpcmyT47J_3-T9S-qqGKGxCz8vimsB14V4CArOTEmXqE7cp9eZvWBY', isRequired: true },
  { id: 't2', type: 'audio', title: '早起语音打卡', status: 'done', deadline: '07:15' },
  { id: 't3', type: 'writing', title: '每日心得感悟', status: 'todo', subtitle: '待办 · 截止 22:00' },
  { id: 't4', type: 'reading', title: '晨读：第四章 双赢思维', subtitle: '明日 06:00 解锁', status: 'locked' },
];

export const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addXp, addCoins } = useGamification();
  const { trigger: haptic } = useHaptics();
  const { t } = useTranslation();

  const { tasks: remoteTasks, checkins, completeTask, addCheckin, isLoading } = useTasks();

  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [scrolled, setScrolled] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Merge static metadata with remote status
  const tasks = initialTasksData.map(t => {
      const remote = (remoteTasks as any[]).find((rt: any) => rt.task_id === t.id);
      return remote ? { ...t, status: 'done' as const } : t;
  });

  // Audio Recording State
  const [showRecorder, setShowRecorder] = useState(false);
  const { time: recordTime, isRunning: isRecording, start: startRecord, pause: stopRecord, reset: resetRecord } = useTimer({ type: 'stopwatch' });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTaskClick = async (task: Task) => {
    if (task.status === 'locked') return;

    if (task.type === 'reading') {
      navigate('/course/1');
    } else if (task.type === 'audio') {
      setShowRecorder(true);
      resetRecord(0);
    } else if (task.type === 'writing') {
      navigate('/note/new');
    } else {
        await toggleTaskStatus(task.id, task.status);
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
      if (currentStatus === 'todo') {
          await completeTask(id);
          haptic('success');
          showToast(t('tasks.action.task_completed'), 'success');
          addXp(10, '完成任务');
          addCoins(1, '任务奖励');
      }
  };

  const finishRecording = async () => {
      stopRecord();
      await completeTask('t2'); // Done
      await addCheckin(); // Add today to calendar
      
      setShowRecorder(false);
      showToast(t('tasks.action.checkin_success'), "success");
      addXp(30, '语音打卡');
      addCoins(5, '早起奖励');
  };

  if (isLoading) return null;

  const filteredTasks = tasks.filter(t => {
      if (filter === 'all') return true;
      if (filter === 'todo') return t.status === 'todo' || t.status === 'locked';
      if (filter === 'done') return t.status === 'done';
      return true;
  });

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-[#F5F7F5] dark:bg-black font-sans relative">
      
      <CalendarModal 
         isOpen={showCalendar} 
         onClose={() => setShowCalendar(false)} 
         completedDates={checkins} 
      />

      {/* Dynamic Glass Header */}
      <header className={`sticky top-0 z-40 px-6 py-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
        <div className="w-10"></div>
        <h2 className={`text-lg font-display font-bold text-text-main dark:text-white transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>{t('tasks.title')}</h2>
        <button 
           onClick={() => setShowCalendar(true)}
           className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
        >
          <Icon name="calendar_today" className="text-text-main dark:text-white" />
        </button>
      </header>

      {/* Greeting - Immersive */}
      <div className="px-6 pt-2 pb-6">
        <h1 className="text-text-main dark:text-white font-display text-3xl font-bold leading-tight mb-2">{t('tasks.greeting_title')}</h1>
        <p className="text-text-sub dark:text-gray-400 text-sm font-light">
          {t('tasks.greeting_quote')}
        </p>
      </div>

      {/* Tabs */}
      <div className="sticky top-20 z-30 px-6 pb-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x py-1">
          {[
            { id: 'all', label: t('tasks.tabs.all') },
            { id: 'todo', label: t('tasks.tabs.todo') },
            { id: 'done', label: t('tasks.tabs.done') },
            { id: 'makeup', label: t('tasks.tabs.makeup') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`snap-start flex h-9 shrink-0 items-center justify-center rounded-full px-6 text-sm font-medium transition-all active:scale-95 ${
                filter === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white dark:bg-[#1A1A1A] text-text-sub dark:text-gray-400 border border-transparent shadow-sm'
              }`}
            >
              {tab.label}
              {tab.id === 'todo' && filter !== 'todo' && <span className="ml-1.5 size-1.5 bg-red-500 rounded-full"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* List - Responsive Grid */}
      <div className="flex flex-col gap-5 px-6 pb-6 md:grid md:grid-cols-2">
        {/* Featured Task */}
        {filteredTasks.filter(t => t.id === 't1').map(task => (
           <div key={task.id} className="md:col-span-2 flex flex-col bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-soft dark:shadow-none border border-white dark:border-gray-800 overflow-hidden group cursor-pointer" onClick={() => handleTaskClick(task)}>
            <div className="relative h-36 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                style={{ backgroundImage: `url("${task.thumbnail}")` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              {task.isRequired && (
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                  <Icon name="menu_book" className="text-[12px]" />
                  {t('tasks.required')}
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="text-text-main dark:text-white text-lg font-bold font-display leading-tight">{task.title}</h3>
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                   <Icon name="arrow_forward" className="text-sm" />
                </div>
              </div>
              <p className="text-text-sub dark:text-gray-400 text-xs font-medium">{task.subtitle}</p>
            </div>
          </div>
        ))}

        {/* Other Tasks */}
        {filteredTasks.filter(t => t.id !== 't1').map(task => {
          if (task.status === 'locked') {
            return (
              <div key={task.id} className="mt-4 md:mt-0 opacity-60">
                <div className="flex items-center gap-2 mb-3">
                   <Icon name="lock" className="text-gray-400 text-xs" />
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('tasks.status.tomorrow')}</h3>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-gray-100 dark:bg-gray-800/50 p-4 border border-transparent dark:border-gray-800 h-full">
                  <div className="size-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 text-gray-400">
                    <Icon name="hourglass_empty" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">{task.title}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{task.subtitle}</p>
                  </div>
                </div>
              </div>
            );
          }

          const isDone = task.status === 'done';
          return (
             <div key={task.id} className={`flex items-center justify-between gap-4 rounded-2xl bg-white dark:bg-[#1A1A1A] p-4 shadow-soft dark:shadow-none border border-white dark:border-gray-800 transition-all ${isDone ? 'opacity-80' : 'hover:-translate-y-0.5'}`}>
              <div className="flex items-center gap-4">
                <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${isDone ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'}`}>
                  <Icon name={task.type === 'audio' ? 'mic' : 'edit_note'} className="text-xl" />
                </div>
                <div className="flex flex-col">
                  <p className="text-text-main dark:text-white text-base font-bold">{task.title}</p>
                  {isDone ? (
                    <p className="text-green-600 dark:text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
                      <Icon name="check_circle" className="text-[12px]" filled /> {t('tasks.status.completed')} {task.deadline}
                    </p>
                  ) : (
                    <p className="text-text-sub dark:text-gray-400 text-xs mt-1">{task.subtitle}</p>
                  )}
                </div>
              </div>
              {isDone ? (
                 <button onClick={() => handleTaskClick(task)} className="size-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 text-gray-300 hover:text-green-500 transition-colors">
                    <Icon name="replay" className="text-sm" />
                 </button>
              ) : (
                <button onClick={() => handleTaskClick(task)} className="flex cursor-pointer items-center justify-center rounded-xl h-9 px-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-bold hover:bg-orange-100 transition-colors">
                  {t('tasks.action.go')}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Recorder Modal using Reusable Modal Component */}
      <Modal isOpen={showRecorder} onClose={() => setShowRecorder(false)} type="bottom">
         <div className="flex flex-col items-center pb-6">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-8"></div>
            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">{t('tasks.audio_modal.title')}</h3>
            <p className="text-gray-400 text-sm mb-10">{t('tasks.audio_modal.subtitle')}</p>
            
            <div className="relative mb-12">
               {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div>
               )}
               <button 
                  onClick={() => {
                      if (isRecording) {
                          finishRecording();
                      } else {
                          startRecord();
                      }
                  }}
                  className={`relative z-10 size-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isRecording ? 'bg-red-500 text-white scale-110' : 'bg-primary text-white hover:scale-105'}`}
               >
                  <Icon name={isRecording ? "stop" : "mic"} className="text-4xl" filled />
               </button>
            </div>

            <div className="text-4xl font-mono font-light text-text-main dark:text-white tracking-widest mb-8">
               {formatDuration(recordTime)}
            </div>

            <p className="text-center text-lg font-serif italic text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
               {t('tasks.audio_modal.quote')}
            </p>
         </div>
      </Modal>
    </div>
  );
};
