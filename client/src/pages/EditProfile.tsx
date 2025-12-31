
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/contexts/ToastContext';
import { useHaptics } from '@/hooks/useHaptics';
import { profileSchema, ProfileForm } from '@/lib/validations';

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, isLoading: isProfileLoading } = useProfile();
  const { showToast } = useToast();
  const { trigger: haptic } = useHaptics();

  const [loading, setLoading] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState('');

  // Form Setup
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', bio: '' }
  });

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name || '');
      setValue('bio', profile.bio || '');

      const avatar = profile.avatar || '';
      if (avatar.includes('seed=')) {
        setAvatarSeed(avatar.split('seed=')[1]);
      } else {
        setAvatarSeed(profile.name || 'user');
      }
    }
  }, [profile, setValue]);

  const handleRandomAvatar = () => {
    haptic('light');
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    setLoading(true);
    const newAvatarUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${avatarSeed}`;

    try {
      await updateProfile({
        name: data.name,
        avatar: newAvatarUrl,
        bio: data.bio
      });

      haptic('success');
      showToast("个人资料已更新", "success");
      setTimeout(() => navigate(-1), 500);
    } catch (error: any) {
      console.error('Update error:', error);
      showToast("保存失败，请稍后重试", "error");
    } finally {
      setLoading(false);
    }
  };

  if (isProfileLoading) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans animate-fade-in flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <Icon name="close" className="text-text-main dark:text-white" />
        </button>
        <h1 className="text-base font-bold text-text-main dark:text-white">编辑资料</h1>
        <button onClick={handleSubmit(onSubmit)} disabled={loading} className="text-sm font-bold text-primary hover:text-primary-dark disabled:opacity-50 transition-colors">
          {loading ? '保存中...' : '完成'}
        </button>
      </header>

      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="relative mb-8 group cursor-pointer" onClick={handleRandomAvatar}>
          <div className="size-28 rounded-full border-4 border-gray-100 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-[#1A1A1A]">
            <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${avatarSeed || 'user'}`} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
          </div>
          <div className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full border-2 border-white dark:border-black shadow-md">
            <Icon name="shuffle" className="text-sm" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-8">点击头像随机生成</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">昵称</label>
            <input
              {...register('name')}
              type="text"
              className={`w-full bg-gray-50 dark:bg-[#1A1A1A] border ${errors.name ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold`}
              placeholder="请输入昵称"
            />
            {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">个性签名</label>
            <textarea
              {...register('bio')}
              className={`w-full bg-gray-50 dark:bg-[#1A1A1A] border ${errors.bio ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none h-24 text-sm leading-relaxed`}
              placeholder="介绍一下你自己..."
            />
            <div className="flex justify-between px-1">
              {errors.bio ? <span className="text-[10px] text-red-500">{errors.bio.message}</span> : <span></span>}
              <span className="text-[10px] text-gray-400">限 50 字</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
