
import { useAuth } from '@/contexts/AuthContext';
import { usePartnerQuery } from './usePartnerQuery';
import { usePartnerMutation } from './usePartnerMutation';

export const usePartner = (activeRole: 'buddy' | 'mentor' | 'mentee') => {
  const { user } = useAuth();

  // 1. Data Fetching
  const { relationships, partner, logs, isRelLoading } = usePartnerQuery(activeRole);

  // 2. Mutations
  const { waterTree, sendMessage, assignPlan, isWatering } = usePartnerMutation();

  // 4. Derived Logic: Water Status
  // Mock Data for "Fuller" UI
  const mockPartner = {
    id: 'mock_1',
    relationshipId: 'mock_rel_1',
    name: 'Sofia (Mock)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
    level: 7,
    relationType: activeRole,
    relationDays: 45,
    syncRate: 85,
    status: 'online',
    lastInteraction: '2 hours ago',
    treeLevel: 8, // High trust
    wateredToday: true
  };

  const mockLogs = [
    { id: 'm1', content: '存入了一笔款项：「理解：我听到了你心底的声音。」', type: 'interaction', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), actor_id: 'partner' },
    { id: 'm2', content: '完成了今日晨读打卡，双方默契度 +1', type: 'system', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), actor_id: 'system' },
    { id: 'm3', content: '关注了你的学习进度', type: 'water', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), actor_id: user?.id },
    { id: 'm4', content: '存入了一笔款项：「支持：在你需要的时候，我都在。」', type: 'interaction', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), actor_id: 'partner' },
    { id: 'm5', content: '共修树升级到了 Lv.7', type: 'system', created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), actor_id: 'system' },
    { id: 'm6', content: '拍了拍你，提醒该打理账户了', type: 'interaction', created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), actor_id: 'partner' },
  ];

  const finalPartner = partner || mockPartner;
  // If we have real logs, use them; otherwise use mock logs to fill the page
  const finalLogs = logs.length > 0 ? logs : mockLogs;

  const isWatered = finalLogs.some(log => {
    // Logic for real logs... for mock logs we hardcoded `wateredToday: true` in mockPartner if we use it.
    // But let's keep logic consistent.
    if (log.type !== 'water' || log.actor_id !== user?.id) return false;
    const logDate = new Date(log.created_at).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    return logDate === today;
  });

  const activePartner = finalPartner ? { ...finalPartner, wateredToday: isWatered } : null;

  return {
    partner: activePartner,
    relationships,
    logs: finalLogs,
    loading: isRelLoading,
    waterTree,
    sendMessage,
    assignPlan,
    isWatering
  };
};
