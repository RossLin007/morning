
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Image } from '@/components/ui/Image';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useProfile } from '@/hooks/useProfile';

interface MenuCellProps {
  icon: string;
  iconColor?: string;
  label: string;
  rightText?: string | React.ReactNode;
  onClick?: () => void;
  isLast?: boolean;
}

const MenuCell: React.FC<MenuCellProps> = ({ icon, iconColor = 'text-gray-600', label, rightText, onClick, isLast }) => (
  <div onClick={onClick} className={`flex items-center justify-between px-5 py-4 bg-white dark:bg-[#191919] active:bg-gray-50 dark:active:bg-white/5 cursor-pointer transition-colors ${!isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
    <div className="flex items-center gap-4">
      <Icon name={icon} className={`text-2xl ${iconColor}`} />
      <span className="text-base font-medium text-text-main dark:text-white">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {rightText && <span className="text-sm text-gray-400 dark:text-gray-500">{rightText}</span>}
      <Icon name="chevron_right" className="text-gray-300 dark:text-gray-600 text-lg" />
    </div>
  </div>
);

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { xp } = useGamification();
  const { profile } = useProfile();
  const [completedLessons] = useLocalStorage<string[]>('mr_learning_progress', []);

  const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Morning";
  // Fallback safe access
  const userName = profile?.name || (user?.email ? user.email.split('@')[0] : '书友');
  const userAvatar = profile?.avatar || DEFAULT_AVATAR;

  // Dummy Data
  const currentTerm = { name: '第八期：静水深流', total: 21, current: completedLessons.length + 1 };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#111] font-sans pb-32">

      {/* 1. Header: Avatar & Mission */}
      <div
        className="bg-white dark:bg-[#191919] px-6 py-8 mb-2 flex items-center justify-between cursor-pointer active:bg-gray-50 dark:active:bg-white/5 transition-colors"
        onClick={() => navigate('/profile/edit')}
      >
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <Image
              src={userAvatar}
              alt={userName}
              className="size-16 rounded-lg object-cover shadow-sm bg-gray-100"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main dark:text-white mb-1.5">{userName}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 italic">“{profile?.bio || '做一个温暖且有力量的人'}”</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">UID: {user?.email?.split('@')[0] || '8888'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Icon name="qr_code_2" className="text-gray-400 text-xl" />
          <Icon name="chevron_right" className="text-gray-300 dark:text-gray-600 text-lg" />
        </div>
      </div>

      {/* 2. Group 1: Renewal (能量与补给) */}
      <div className="mb-2">
        <MenuCell
          icon="diamond"
          iconColor="text-orange-500"
          label="能量补给站"
          rightText="未开通"
          onClick={() => navigate('/membership')}
        />
        <MenuCell
          icon="military_tech"
          iconColor="text-yellow-500"
          label="里程碑"
          rightText={`${xp} XP`}
          onClick={() => navigate('/achievements')}
          isLast
        />
      </div>

      {/* 3. Group 2: Inner Work (内在修习) */}
      <div className="mb-2">
        <MenuCell
          icon="menu_book"
          iconColor="text-emerald-500"
          label="我的晨读"
          rightText={`Day ${currentTerm.current}`}
          onClick={() => navigate('/my-reading')}
        />
        <MenuCell
          icon="edit_note"
          iconColor="text-indigo-500"
          label="觉察日记"
          rightText="45 篇"
          onClick={() => navigate('/diary')}
        />
        <MenuCell
          icon="bar_chart"
          iconColor="text-blue-500"
          label="成长回顾"
          onClick={() => navigate('/report')}
          isLast
        />
      </div>

      {/* 4. Group 3: Outer Work (外在连接) */}
      <div className="mb-2">
        <MenuCell
          icon="diversity_3"
          iconColor="text-pink-500"
          label="情感账户"
          rightText="3 位伙伴"
          onClick={() => navigate('/relationships')}
        />
        <MenuCell
          icon="auto_awesome"
          iconColor="text-purple-500"
          label="晨读分享"
          rightText="38 次"
          onClick={() => navigate('/insights')}
        />
        <MenuCell
          icon="collections_bookmark"
          iconColor="text-red-500"
          label="我的收藏"
          onClick={() => navigate('/favorites')}
          isLast
        />
      </div>

      {/* 5. Group 4: Settings (系统设定) */}
      <div className="mb-8">
        <MenuCell
          icon="settings"
          iconColor="text-gray-500"
          label="系统校准"
          onClick={() => navigate('/settings')}
          isLast
        />
      </div>

    </div>
  );
};
