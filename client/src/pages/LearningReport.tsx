
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useGamification } from '@/contexts/GamificationContext';

export const LearningReport: React.FC = () => {
  const navigate = useNavigate();
  const { level, xp } = useGamification();
  const [completedLessons] = useLocalStorage<string[]>('mr_learning_progress', []);
  const [checkins] = useLocalStorage<string[]>('mr_checkins', []);
  
  // Stats Calculation
  const totalMinutes = completedLessons.length * 15;
  const estimatedWords = completedLessons.length * 2500; // Approx words per lesson
  const consistencyRate = Math.min(100, Math.round((checkins.length / (new Date().getDate())) * 100)) || 0;

  // Mock Weekly Data (Last 7 days)
  const weeklyData = [20, 45, 30, 60, 15, 90, 45]; // Mins per day
  const maxVal = Math.max(...weeklyData, 60); // Ensure at least 60 scaling

  // Mock Heatmap Data (Last 28 days)
  const generateHeatmap = () => {
      const days = [];
      for (let i = 0; i < 28; i++) {
          const intensity = Math.random() > 0.6 ? (Math.random() > 0.8 ? 2 : 1) : 0;
          days.push(intensity);
      }
      return days;
  };
  const [heatmapData] = useState(generateHeatmap());

  return (
    <div className="min-h-screen bg-[#F5F7F5] dark:bg-black font-sans animate-fade-in pb-10">
      
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <Icon name="arrow_back" className="text-text-main dark:text-white" />
        </button>
        <h1 className="text-base font-bold text-text-main dark:text-white">数据周报</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
           <Icon name="share" className="text-text-main dark:text-white" />
        </button>
      </header>

      <div className="p-6 space-y-6">
          
          {/* 1. Hero Summary Card */}
          <div className="relative overflow-hidden bg-[#2C3E3E] dark:bg-[#151515] rounded-[32px] p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[60px]"></div>
              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Focus</p>
                          <h2 className="text-4xl font-display font-bold">{totalMinutes}<span className="text-lg font-sans font-normal opacity-60 ml-1">min</span></h2>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                          <span className="text-xs font-bold">Lv.{level} Scholar</span>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                      <div>
                          <p className="text-[10px] text-white/50 uppercase tracking-wide">Words Read</p>
                          <p className="text-lg font-bold">{estimatedWords > 1000 ? (estimatedWords/1000).toFixed(1) + 'k' : estimatedWords}</p>
                      </div>
                      <div>
                          <p className="text-[10px] text-white/50 uppercase tracking-wide">Check-ins</p>
                          <p className="text-lg font-bold">{checkins.length}</p>
                      </div>
                      <div>
                          <p className="text-[10px] text-white/50 uppercase tracking-wide">Consistency</p>
                          <p className="text-lg font-bold text-primary">{consistencyRate}%</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* 2. Consistency Heatmap */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-text-main dark:text-white flex items-center gap-2">
                      <Icon name="calendar_view_month" className="text-primary" />
                      修行热力图
                  </h3>
                  <span className="text-[10px] text-gray-400">Last 4 Weeks</span>
              </div>
              
              <div className="flex gap-2 justify-between">
                  {heatmapData.map((intensity, idx) => (
                      <div 
                        key={idx} 
                        className={`flex-1 aspect-[1/1] rounded-md transition-all hover:scale-110 ${
                            intensity === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                            intensity === 1 ? 'bg-primary/40' :
                            'bg-primary'
                        }`}
                        title={intensity === 0 ? '未打卡' : '已修行'}
                      ></div>
                  ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-3 text-center">
                  每一次点亮，都是对平庸生活的反击。
              </p>
          </div>

          {/* 3. Weekly Trend Chart */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-sm text-text-main dark:text-white">专注时长趋势</h3>
                  <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full font-bold">
                      <Icon name="trending_up" className="text-xs" />
                      <span>+12%</span>
                  </div>
              </div>
              
              <div className="flex items-end justify-between h-32 gap-3">
                  {weeklyData.map((val, idx) => {
                      const heightPct = (val / maxVal) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-end overflow-hidden h-full">
                                <div 
                                    style={{ height: `${heightPct}%` }}
                                    className={`w-full transition-all duration-1000 ease-out rounded-lg ${
                                        val === Math.max(...weeklyData) ? 'bg-primary shadow-[0_0_15px_rgba(107,142,142,0.5)]' : 'bg-primary/30 group-hover:bg-primary/50'
                                    }`}
                                ></div>
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold font-mono">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}</span>
                        </div>
                      );
                  })}
              </div>
          </div>

          {/* 4. AI Insight Report */}
          <div className="bg-[#FFFDF9] dark:bg-[#1F1F1F] p-6 rounded-[24px] border border-orange-100 dark:border-orange-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon name="psychology" className="text-7xl text-orange-500" />
              </div>
              
              <div className="flex items-center gap-2 mb-4 relative z-10">
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">AI COACH</div>
                  <h3 className="font-bold text-sm text-text-main dark:text-white">本周深度复盘</h3>
              </div>

              <div className="space-y-4 relative z-10">
                  <div className="flex gap-3">
                      <div className="mt-1 size-1.5 rounded-full bg-orange-400 shrink-0"></div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          你的高效时段集中在 <span className="font-bold text-orange-600 dark:text-orange-400">早晨 06:00 - 08:00</span>，这是非常宝贵的“黄金时间”，建议将最难的阅读任务安排在此。
                      </p>
                  </div>
                  <div className="flex gap-3">
                      <div className="mt-1 size-1.5 rounded-full bg-blue-400 shrink-0"></div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          相比上周，你的阅读连贯性提升了 <span className="font-bold text-blue-600 dark:text-blue-400">15%</span>。保持这个节奏，你将在 3 天后达成“全勤之王”成就。
                      </p>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};
