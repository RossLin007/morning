
import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedDates?: string[]; // Format: 'YYYY-MM-DD'
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, completedDates = [] }) => {
  if (!isOpen) return null;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthName = today.toLocaleString('default', { month: 'long' });

  // Get number of days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Get starting day of week (0-6)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = [];
  // Empty slots for prev month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isToday = (day: number) => {
    return day === today.getDate();
  };

  const isCompleted = (day: number) => {
      // Real check against passed completedDates
      // Construct date string 'YYYY-MM-DD'
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return completedDates.includes(dateStr);
  };

  // Calculate stats from completedDates
  const totalCheckins = completedDates.length;
  // Simple streak calc (mocked for now as real streak calc needs sorted array and date diff)
  const streak = completedDates.includes(today.toISOString().split('T')[0]) ? "Active" : "Inactive";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
         className="w-full max-w-sm mx-4 bg-[#FFFDF9] dark:bg-[#1A1A1A] rounded-[32px] p-6 animate-fade-in-up relative overflow-hidden" 
         onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-xl font-display font-bold text-text-main dark:text-white">{monthName}</h2>
                <p className="text-xs text-primary font-medium tracking-widest uppercase">{currentYear}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                <Icon name="close" className="text-gray-500" />
            </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-center text-xs font-bold text-gray-300 dark:text-gray-600 mb-2">{d}</div>
            ))}
            
            {days.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`}></div>;
                
                const active = isCompleted(day);
                const todayActive = isToday(day);

                return (
                    <div key={day} className="flex flex-col items-center justify-center h-10 relative">
                        {todayActive && (
                            <div className="absolute inset-0 border-2 border-primary rounded-xl"></div>
                        )}
                        <span className={`text-sm font-medium z-10 ${active ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                            {day}
                        </span>
                        {active ? (
                            <div className="absolute inset-1 bg-primary rounded-lg -z-0 shadow-sm animate-fade-in"></div>
                        ) : (
                            <div className="absolute inset-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg -z-0"></div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* Stats Footer */}
        <div className="flex gap-4 p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800">
             <div className="flex-1 text-center border-r border-gray-100 dark:border-gray-800">
                 <div className="text-xl font-bold text-text-main dark:text-white">{totalCheckins}</div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-wide">Days Active</div>
             </div>
             <div className="flex-1 text-center">
                 <div className={`text-xl font-bold ${streak === 'Active' ? 'text-orange-500' : 'text-gray-400'}`}>{streak}</div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-wide">Status</div>
             </div>
        </div>

      </div>
    </div>
  );
};
