
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

const CORE_IDENTITIES = [
  "探索者", "践行者", "创造者",
  "引路人", "观察者", "终身学习者",
  "守护者", "觉醒者", "修习生"
];

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, isLoading: isProfileLoading } = useProfile();
  const { showToast } = useToast();
  const { trigger: haptic } = useHaptics();

  const [loading, setLoading] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState('');

  // Custom State for Energy visualization
  const [energy, setEnergy] = useState(50);

  // Form Setup
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      bio: '',
      title: '',
      vision: '',
      mission: '',
      current_issue: '',
      energy_level: 50
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name || '');
      setValue('bio', profile.bio || '');
      setValue('title', profile.title || '');
      setValue('vision', profile.vision || '');
      setValue('mission', profile.mission || '');
      setValue('current_issue', profile.current_issue || '');
      setValue('energy_level', profile.energy_level || 50);
      setEnergy(profile.energy_level || 50);

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

    // Ensure energy level is sync
    data.energy_level = energy;

    try {
      await updateProfile({
        name: data.name,
        avatar: newAvatarUrl,
        bio: data.bio,
        title: data.title,
        vision: data.vision,
        mission: data.mission,
        current_issue: data.current_issue,
        energy_level: data.energy_level
      });

      haptic('success');
      showToast("Soul Passport 更新成功", "success");
      setTimeout(() => navigate(-1), 500);
    } catch (error: any) {
      console.error('Update error:', error);
      showToast("保存失败，请稍后重试", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper for Energy Color
  const getEnergyColor = (val: number) => {
    if (val < 30) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    if (val < 70) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  }

  const getEnergyLabel = (val: number) => {
    if (val < 30) return '急需充电';
    if (val < 70) return '平稳运行';
    return '能量满格';
  }

  if (isProfileLoading) return null;

  return (
    <div className="min-h-screen bg-[#F5F7F5] dark:bg-[#0A0A0A] font-sans animate-fade-in flex flex-col pb-10">

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#F5F7F5]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <Icon name="close" className="text-text-main dark:text-white" />
        </button>
        <h1 className="text-lg font-serif font-bold text-text-main dark:text-white">Soul Passport</h1>
        <button onClick={handleSubmit(onSubmit)} disabled={loading} className="text-sm font-bold text-primary hover:text-primary-dark disabled:opacity-50 transition-colors bg-primary/10 px-4 py-1.5 rounded-full">
          {loading ? '保存中' : '签发'}
        </button>
      </header>

      <div className="flex-1 px-6 py-6 space-y-8 max-w-lg mx-auto w-full">

        {/* 1. Identity Card */}
        <section className="bg-white dark:bg-[#151515] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Icon name="fingerprint" className="text-8xl" />
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-6 group cursor-pointer" onClick={handleRandomAvatar}>
              <div className="size-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg overflow-hidden bg-gray-50 dark:bg-[#1A1A1A]">
                <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${avatarSeed || 'user'}`} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <div className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-black text-gray-600 dark:text-gray-300 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                <Icon name="refresh" className="text-xs" />
              </div>
            </div>

            <div className="w-full space-y-4">
              {/* Name */}
              <div className="text-center">
                <input
                  {...register('name')}
                  className="text-center w-full bg-transparent text-xl font-bold text-text-main dark:text-white border-b-2 border-transparent hover:border-gray-100 focus:border-primary focus:outline-none transition-colors px-2 py-1 placeholder-gray-300"
                  placeholder="你的名字"
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              {/* Title/Tag */}
              <div className="flex justify-center">
                <div className="bg-gray-50 dark:bg-white/5 rounded-full px-4 py-1 flex items-center gap-2">
                  <Icon name="label" className="text-xs text-gray-400" />
                  <select
                    className="bg-transparent text-xs font-medium text-gray-600 dark:text-gray-300 w-24 text-center focus:outline-none appearance-none cursor-pointer"
                    {...register('title')}
                  >
                    <option value="" disabled>选择核心身份</option>
                    {CORE_IDENTITIES.map(id => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div className="relative">
                <textarea
                  {...register('bio')}
                  className="w-full text-center bg-gray-50 dark:bg-[#0A0A0A] rounded-xl px-4 py-3 text-sm text-gray-600 dark:text-gray-400 resize-none focus:ring-1 focus:ring-primary/20 outline-none scrollbar-hide"
                  placeholder="一句话介绍你自己..."
                  rows={2}
                />
                {errors.bio && <p className="text-[10px] text-red-500 absolute -bottom-4 left-0 right-0 text-center">{errors.bio.message}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* 2. The Now (Status) */}
        <section>
          <div className="bg-white dark:bg-[#151515] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <label className="text-sm font-bold text-text-main dark:text-white">能量水平</label>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getEnergyColor(energy)}`}>
                  {energy}% · {getEnergyLabel(energy)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="mt-2 flex justify-between text-[10px] text-gray-400 font-medium px-1">
                <span>耗竭</span>
                <span>满载</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-text-main dark:text-white mb-2 block">当前课题</label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <Icon name="psychology_alt" className="text-gray-400" />
                </div>
                <input
                  {...register('current_issue')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] rounded-xl text-sm text-text-main dark:text-white focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                  placeholder="当下你正在修炼什么？(如：接纳、耐心...)"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. North Star (Vision & Mission) */}
        <section>
          <div className="bg-gradient-to-br from-[#E0EAFC] to-[#CFDEF3] dark:from-[#2C3E50] dark:to-[#4CA1AF] rounded-[24px] p-6 shadow-md relative overflow-hidden">
            {/* Soft bg simulation */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 space-y-6">
              {/* Vision */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-indigo-800 dark:text-indigo-100 uppercase tracking-wider mb-2">
                  <Icon name="visibility" className="text-sm" /> 志向 (Vision)
                </label>
                <textarea
                  {...register('vision')}
                  className="w-full bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white/80 dark:focus:bg-black/40 focus:border-indigo-300 outline-none transition-all resize-none leading-relaxed"
                  placeholder="我想成为一个什么样的人？描述那个画面..."
                  rows={3}
                />
              </div>

              {/* Mission */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-indigo-800 dark:text-indigo-100 uppercase tracking-wider mb-2">
                  <Icon name="flag" className="text-sm" /> 使命 (Mission)
                </label>
                <textarea
                  {...register('mission')}
                  className="w-full bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white/80 dark:focus:bg-black/40 focus:border-indigo-300 outline-none transition-all resize-none leading-relaxed"
                  placeholder="我为何而存在？我要为这个世界带来什么？这个世界需要我做什么？"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Sage Hint */}
          <div className="mt-4 flex gap-3 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/20">
            <div className="shrink-0 pt-0.5">
              <Icon name="auto_awesome" className="text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-indigo-800 dark:text-indigo-300 font-medium mb-1">Sage 的提示</p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 leading-relaxed">
                如果你想不清楚宏大的使命，可以试着写这周你想在大自然中获得的体验，这也是一种“以终为始”。
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
