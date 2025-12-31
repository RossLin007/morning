
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export const AccountSecurity: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // Mock Bindings State
  const [bindings, setBindings] = useState({
      phone: true,
      wechat: false,
      apple: false,
      email: true
  });

  const handleToggleBinding = (type: keyof typeof bindings) => {
      setLoadingId(type);
      setTimeout(() => {
          setBindings(prev => {
              const newState = !prev[type];
              showToast(newState ? "绑定成功" : "解绑成功", "success");
              return { ...prev, [type]: newState };
          });
          setLoadingId(null);
      }, 1500);
  };

  const AccountRow = ({ type, icon, label, account, isBound, color }: any) => (
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-50 dark:border-gray-800 mb-3">
          <div className="flex items-center gap-4">
              <div className={`size-10 rounded-full flex items-center justify-center ${isBound ? color : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <Icon name={icon} />
              </div>
              <div>
                  <h4 className="text-sm font-bold text-text-main dark:text-white">{label}</h4>
                  <p className="text-[10px] text-gray-400">{isBound ? account : '未绑定'}</p>
              </div>
          </div>
          <button 
            disabled={loadingId === type}
            onClick={() => handleToggleBinding(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                isBound 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500' 
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
              {loadingId === type ? <Icon name="sync" className="animate-spin text-xs" /> : (isBound ? '解绑' : '绑定')}
          </button>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7F5] dark:bg-black font-sans animate-fade-in flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <Icon name="arrow_back" className="text-text-main dark:text-white" />
        </button>
        <h1 className="text-base font-bold text-text-main dark:text-white">账号安全</h1>
        <div className="w-8"></div>
      </header>

      <div className="p-6">
          <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Linked Accounts</h3>
          
          <AccountRow 
             type="phone"
             icon="smartphone"
             label="手机号"
             account="+86 138****8888"
             isBound={bindings.phone}
             color="bg-blue-50 text-blue-500"
          />
          <AccountRow 
             type="email"
             icon="mail"
             label="邮箱"
             account={user?.email || "user@example.com"}
             isBound={bindings.email}
             color="bg-purple-50 text-purple-500"
          />
          <AccountRow 
             type="wechat"
             icon="chat"
             label="微信"
             account="WeChat User"
             isBound={bindings.wechat}
             color="bg-green-50 text-green-500"
          />
          <AccountRow 
             type="apple"
             icon="apple"
             label="Apple ID"
             account="Apple User"
             isBound={bindings.apple}
             color="bg-gray-200 text-black"
          />

          <div className="mt-8 px-2">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                  绑定第三方账号可以作为备用登录方式。解绑所有账号后，您的数据可能会在登出后丢失，请谨慎操作。
              </p>
          </div>
      </div>
    </div>
  );
};
