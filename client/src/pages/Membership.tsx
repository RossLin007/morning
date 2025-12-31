
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useHaptics } from '@/hooks/useHaptics';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext'; // Import

export const Membership: React.FC = () => {
  const navigate = useNavigate();
  const { trigger: haptic } = useHaptics();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [selectedPlan, setSelectedPlan] = useState<'month' | 'year'>('year');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock Persistence for VIP Status
  const [isVip, setIsVip] = useLocalStorage<boolean>('mr_is_vip', false);

  const plans = {
    month: { price: 18, period: '月', save: '', id: 'plan_m' },
    year: { price: 168, period: '年', save: '省 ¥48', id: 'plan_y' }
  };

  const benefits = [
    { icon: 'smart_toy', title: 'AI 晨读教练', desc: '基于 Gemini 的个性化学习指导' },
    { icon: 'headphones', title: '沉浸听书馆', desc: '解锁全站 500+ 小时音频内容' },
    { icon: 'cloud_sync', title: '无限云同步', desc: '笔记、数据多端实时备份' },
    { icon: 'workspace_premium', title: '尊贵身份标识', desc: '专属头像框与金色昵称' },
    { icon: 'card_giftcard', title: '每月赠礼', desc: '每月获赠 2 张好友体验卡' },
  ];

  const handleSubscribe = () => {
    haptic('medium');
    setIsProcessing(true);

    // Mock Payment Processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsVip(true);
      setShowSuccess(true);
      haptic('success');
    }, 2000);
  };

  const handleRestore = () => {
      haptic('light');
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          // Mock: 50% chance to find a purchase
          if (Math.random() > 0.1) {
              setIsVip(true);
              setShowSuccess(true);
              showToast("购买记录已恢复", "success");
          } else {
              showToast("未找到相关购买记录", "error");
          }
      }, 1500);
  };

  if (showSuccess) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
            {/* Celebration Particles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-bounce delay-100"></div>
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
            </div>

            <div className="size-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(234,179,8,0.4)] animate-fade-in-up">
                <Icon name="check" className="text-5xl text-black" filled />
            </div>
            
            <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-2">
                欢迎加入 PRO
            </h2>
            <p className="text-gray-400 text-sm mb-12 text-center">您已解锁所有会员权益，<br/>开启极致修行之旅。</p>

            <button 
                onClick={() => navigate('/profile')}
                className="w-full max-w-xs py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform"
            >
                返回个人中心
            </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-safe">
       {/* Dark/Gold Premium Header */}
       <div className="relative h-[300px] overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#050505] z-0"></div>
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none"></div>
           
           <header className="relative z-10 p-6 flex justify-between items-center">
               <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                   <Icon name="close" />
               </button>
               <button 
                 onClick={handleRestore}
                 disabled={isProcessing}
                 className="text-xs font-bold text-yellow-500/80 tracking-widest uppercase border border-yellow-500/30 px-2 py-1 rounded hover:bg-yellow-500/10 transition-colors"
               >
                   Restore Purchase
               </button>
           </header>

           <div className="relative z-10 px-6 mt-4 text-center">
               <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-2xl mb-4 shadow-lg shadow-yellow-500/20">
                   <Icon name="diamond" className="text-3xl text-black" filled />
               </div>
               <h1 className="text-3xl font-display font-bold mb-2">Morning Reader <span className="text-yellow-400 italic">PRO</span></h1>
               <p className="text-gray-400 text-sm">投资自己，是回报率最高的修行。</p>
           </div>
       </div>

       {/* Plan Selection */}
       <div className="px-6 -mt-8 relative z-20">
          <div className="flex gap-4 mb-8">
              <div 
                onClick={() => setSelectedPlan('month')}
                className={`flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedPlan === 'month' ? 'border-yellow-500 bg-[#1A1A1A]' : 'border-transparent bg-[#1A1A1A]/50 opacity-60'}`}
              >
                  <div className="text-xs text-gray-400 mb-1">月度会员</div>
                  <div className="flex items-baseline gap-1">
                      <span className="text-sm">¥</span>
                      <span className="text-2xl font-bold">{plans.month.price}</span>
                      <span className="text-xs text-gray-500">/{plans.month.period}</span>
                  </div>
              </div>

              <div 
                onClick={() => setSelectedPlan('year')}
                className={`flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative ${selectedPlan === 'year' ? 'border-yellow-500 bg-[#1A1A1A]' : 'border-transparent bg-[#1A1A1A]/50 opacity-60'}`}
              >
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                      推荐
                  </div>
                  <div className="text-xs text-yellow-500 mb-1">年度会员</div>
                  <div className="flex items-baseline gap-1">
                      <span className="text-sm">¥</span>
                      <span className="text-2xl font-bold">{plans.year.price}</span>
                      <span className="text-xs text-gray-500">/{plans.year.period}</span>
                  </div>
                  <div className="text-[10px] text-green-400 mt-1">{plans.year.save}</div>
              </div>
          </div>

          {/* Benefits Grid */}
          <div className="bg-[#111] rounded-[32px] p-6 mb-24">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Member Privileges</h3>
              <div className="space-y-6">
                  {benefits.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 group">
                          <div className="size-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                              <Icon name={item.icon} />
                          </div>
                          <div>
                              <h4 className="font-bold text-sm text-gray-200">{item.title}</h4>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
       </div>

       {/* Sticky Bottom Action */}
       <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
           <p className="text-center text-[10px] text-gray-500 mb-4">
               确认订阅即表示同意 <span className="text-gray-300 underline">用户协议</span> 与 <span className="text-gray-300 underline">自动续费规则</span>
           </p>
           <button 
             onClick={handleSubscribe}
             disabled={isProcessing}
             className="w-full h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
           >
               {isProcessing ? (
                   <Icon name="sync" className="animate-spin" />
               ) : (
                   <>
                     立即开启 
                     <span className="text-xs font-normal bg-black/10 px-2 py-0.5 rounded ml-1">¥{selectedPlan === 'year' ? plans.year.price : plans.month.price}</span>
                   </>
               )}
           </button>
       </div>
    </div>
  );
};
