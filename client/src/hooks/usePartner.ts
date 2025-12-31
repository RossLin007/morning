
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
  const isWatered = logs.some(log => {
      if (log.type !== 'water' || log.actor_id !== user?.id) return false;
      const logDate = new Date(log.created_at).setHours(0,0,0,0);
      const today = new Date().setHours(0,0,0,0);
      return logDate === today;
  });

  const activePartner = partner ? { ...partner, wateredToday: isWatered } : null;

  return {
    partner: activePartner,
    relationships,
    logs,
    loading: isRelLoading,
    waterTree,
    sendMessage,
    assignPlan,
    isWatering
  };
};
