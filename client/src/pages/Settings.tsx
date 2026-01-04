import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/contexts/ToastContext';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useTranslation } from '@/hooks/useTranslation';

export const Settings: React.FC = () => {
   const navigate = useNavigate();
   const { showToast } = useToast();
   const { isInstallable, triggerInstall } = useInstallPrompt();
   const { t } = useTranslation();

   // Persistent Settings
   const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage<boolean>('mr_setting_notify', false);
   const [soundEffects, setSoundEffects] = useLocalStorage<boolean>('mr_setting_sound', true);
   const [privacyMode, setPrivacyMode] = useLocalStorage<boolean>('mr_setting_privacy', false);

   // Sync State
   const [isSyncing, setIsSyncing] = useState(false);
   const [lastSyncTime, setLastSyncTime] = useLocalStorage<string>('mr_last_sync', '从未同步');

   const handleNotificationToggle = async (newValue: boolean) => {
      if (newValue) {
         if (!('Notification' in window)) {
            showToast("您的浏览器不支持通知", "error");
            return;
         }

         const permission = await Notification.requestPermission();
         if (permission === 'granted') {
            setNotificationsEnabled(true);
            new Notification("凡人晨读", { body: "通知已开启，不错过每一次修行。" });
            showToast("通知权限已获取", "success");
         } else {
            setNotificationsEnabled(false);
            showToast("权限被拒绝，请在系统设置中开启", "error");
         }
      } else {
         setNotificationsEnabled(false);
         showToast("通知已关闭");
      }
   };

   const handleClearData = () => {
      if (window.confirm(t('settings.data.clear_confirm'))) {
         localStorage.clear();
         showToast(t('settings.data.reset_success'), "success");
         setTimeout(() => {
            window.location.reload();
         }, 1000);
      }
   };

   const handleSync = () => {
      setIsSyncing(true);
      setTimeout(() => {
         setIsSyncing(false);
         const now = new Date();
         const timeStr = `${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
         setLastSyncTime(timeStr);
         showToast(t('settings.cloud.success'), "success");
      }, 2000);
   };

   const OptionRow = ({ icon, title, type = 'toggle', value, onChange, desc }: any) => (
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-50 dark:border-gray-800 mb-3">
         <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
               <Icon name={icon} />
            </div>
            <div>
               <h4 className="text-sm font-bold text-text-main dark:text-white">{title}</h4>
               {desc && <p className="text-[10px] text-gray-400">{desc}</p>}
            </div>
         </div>

         {type === 'toggle' && (
            <button
               onClick={() => onChange(!value)}
               className={`w-12 h-7 rounded-full transition-colors relative ${value ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
               <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
         )}

         {type === 'arrow' && (
            <Icon name="chevron_right" className="text-gray-300" />
         )}
      </div>
   );

   return (
      <div className="min-h-full bg-[#F5F7F5] dark:bg-black font-sans pb-12 animate-fade-in">

         <NavBar title={t('settings.title')} />

         <div className="p-6">

            {/* Install PWA Prompt - Only show if installable */}
            {isInstallable && (
               <div className="mb-8 animate-fade-in-up">
                  <button
                     onClick={triggerInstall}
                     className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary-dark rounded-2xl shadow-lg shadow-primary/30 mb-3 text-white active:scale-[0.98] transition-transform"
                  >
                     <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                           <Icon name="download" />
                        </div>
                        <div className="text-left">
                           <h4 className="text-sm font-bold">{t('settings.install.title')}</h4>
                           <p className="text-[10px] opacity-80">{t('settings.install.desc')}</p>
                        </div>
                     </div>
                     <Icon name="chevron_right" className="opacity-80" />
                  </button>
               </div>
            )}

            {/* Section: Cloud Sync */}
            <div className="mb-8">
               <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('settings.cloud.title')}</h3>
               <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-50 dark:border-gray-800 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${isSyncing ? 'bg-blue-50 text-blue-500 animate-pulse' : 'bg-green-50 text-green-500'}`}>
                        <Icon name={isSyncing ? "sync" : "cloud_done"} className={isSyncing ? "animate-spin" : ""} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-text-main dark:text-white">{t('settings.cloud.sync_data')}</h4>
                        <p className="text-[10px] text-gray-400">{t('settings.cloud.last_sync', { time: lastSyncTime })}</p>
                     </div>
                  </div>
                  <button
                     onClick={handleSync}
                     disabled={isSyncing}
                     className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                     {isSyncing ? t('settings.cloud.syncing') : t('settings.cloud.sync_now')}
                  </button>
               </div>
            </div>

            {/* Section: Preferences */}
            <div className="mb-8">
               <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('settings.preferences.title')}</h3>
               <OptionRow
                  icon="notifications"
                  title={t('settings.preferences.notifications')}
                  desc={t('settings.preferences.notifications_desc')}
                  value={notificationsEnabled}
                  onChange={handleNotificationToggle}
               />
               <OptionRow
                  icon="volume_up"
                  title={t('settings.preferences.haptics')}
                  value={soundEffects}
                  onChange={setSoundEffects}
               />
               <OptionRow
                  icon="visibility_off"
                  title={t('settings.preferences.privacy')}
                  desc={t('settings.preferences.privacy_desc')}
                  value={privacyMode}
                  onChange={setPrivacyMode}
               />
            </div>

            {/* Section: Account */}
            <div className="mb-8">
               <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('settings.account.title')}</h3>
               <div onClick={() => navigate('/profile/edit')} className="cursor-pointer">
                  <OptionRow icon="person" title={t('profile.edit_profile')} type="arrow" />
               </div>
               <div onClick={() => navigate('/security')} className="cursor-pointer">
                  <OptionRow icon="lock" title={t('profile.account_security')} type="arrow" />
               </div>
            </div>

            {/* Section: Data */}
            <div className="mb-8">
               <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('settings.data.title')}</h3>
               <button
                  onClick={handleClearData}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-red-100 dark:border-red-900/30 mb-3 group active:scale-[0.98] transition-transform"
               >
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                        <Icon name="delete_forever" />
                     </div>
                     <div className="text-left">
                        <h4 className="text-sm font-bold text-red-500">{t('settings.data.clear')}</h4>
                        <p className="text-[10px] text-red-300">{t('settings.data.clear_desc')}</p>
                     </div>
                  </div>
               </button>
            </div>

            <div className="text-center mt-12 pb-6">
               <p className="text-xs text-gray-400 font-medium">{t('login.app_name')}</p>
               <p className="text-[10px] text-gray-300 mt-1">{t('settings.footer.slogan')}</p>
            </div>

         </div>
      </div>
   );
};
