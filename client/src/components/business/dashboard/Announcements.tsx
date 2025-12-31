
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Announcement } from '@/types';

interface AnnouncementsProps {
  data: Announcement[];
}

export const Announcements: React.FC<AnnouncementsProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/notifications');
  };

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1 pl-2">Notifications</h4>
      {data.map((item) => (
        <div 
            key={item.id} 
            onClick={handleClick}
            className="group flex items-center gap-4 py-4 px-4 bg-white dark:bg-[#151515] rounded-2xl border border-gray-50 dark:border-gray-800 cursor-pointer hover:border-primary/30 transition-all shadow-sm active:scale-[0.98]"
        >
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon name="notifications" className="text-base" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                <h5 className="text-sm font-bold text-text-main dark:text-white truncate">{item.title}</h5>
                <span className="text-[10px] text-gray-400">{item.time}</span>
                </div>
                <p className="text-xs text-text-sub line-clamp-1">{item.content}</p>
            </div>
            <div className="text-gray-300 group-hover:text-primary transition-colors">
            <Icon name="chevron_right" className="text-sm" />
            </div>
        </div>
      ))}
    </div>
  );
};
