
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Image } from '@/components/ui/Image';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useProfile } from '@/hooks/useProfile';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SoulCard } from '@/components/SoulCard';

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
  const { profile } = useProfile();
  const [showSoulCard, setShowSoulCard] = useState(false);

  // Set PWA status bar color to match page background
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  useThemeColor(isDark ? '#111111' : '#F0F2F5');

  const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Morning";
  // Fallback safe access
  const userName = profile?.name || (user?.email ? user.email.split('@')[0] : '书友');
  const userAvatar = profile?.avatar || DEFAULT_AVATAR;

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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSoulCard(true);
            }}
            className="p-2 -mr-2 text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <Icon name="qr_code_2" className="text-xl" />
          </button>
          <Icon name="chevron_right" className="text-gray-300 dark:text-gray-600 text-lg" />
        </div>
      </div>

      {/* Group 1 */}
      <div className="mb-2">
        <MenuCell
          icon="menu_book"
          iconColor="text-emerald-500"
          label="我的晨读"
          onClick={() => navigate('/my-reading')}
        />
        <MenuCell
          icon="diversity_3"
          iconColor="text-pink-500"
          label="情感账户"
          onClick={() => navigate('/relationships')}
        />
        <MenuCell
          icon="bar_chart"
          iconColor="text-blue-500"
          label="成长回顾"
          onClick={() => navigate('/report')}
          isLast
        />
      </div>

      {/* Group 2 */}
      <div className="mb-2">
        <MenuCell
          icon="share"
          iconColor="text-purple-500"
          label="晨读分享"
          onClick={() => navigate('/community')}
        />
        <MenuCell
          icon="edit_note"
          iconColor="text-indigo-500"
          label="觉察日记"
          onClick={() => navigate('/diary')}
        />
        <MenuCell
          icon="collections_bookmark"
          iconColor="text-red-500"
          label="我的收藏"
          onClick={() => navigate('/favorites')}
        />
        <MenuCell
          icon="visibility"
          iconColor="text-orange-500"
          label="我的看见"
          onClick={() => navigate('/insights')}
          isLast
        />
      </div>

      {/* Group 3 */}
      <div className="mb-8">
        <MenuCell
          icon="settings"
          iconColor="text-gray-500"
          label="系统设置"
          onClick={() => navigate('/settings')}
          isLast
        />
      </div>

      {/* Soul Card Modal */}
      {showSoulCard && (
        <SoulCard
          user={user}
          profile={profile}
          onClose={() => setShowSoulCard(false)}
        />
      )}

    </div>
  );
};
