
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Partner, RelationLog } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export const usePartnerQuery = (activeRole: 'buddy' | 'mentor' | 'mentee') => {
  const { user } = useAuth();

  // 1. Fetch Relationships
  const { data: relationships = [], isLoading: isRelLoading } = useQuery({
    queryKey: ['relationships', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const data = await api.relationships.list();

      return (data || []).map((item: any) => {
        const isMeUserId = item.user_id === user.id;
        // Correctly select the "other" profile based on who I am in the relationship
        const otherProfile = isMeUserId ? item.partner_profile : item.user_profile;
        
        if (!otherProfile) return null;

        const partnerData: Partner = {
          id: otherProfile.id,
          relationshipId: item.id,
          name: otherProfile.name || 'Unknown',
          avatar: otherProfile.avatar || '',
          level: otherProfile.level || 1,
          relationType: item.type,
          relationDays: item.relation_days || 0,
          syncRate: item.sync_rate || 0,
          status: 'online', 
          lastInteraction: item.last_interaction ? formatRelativeTime(item.last_interaction) : '刚刚',
          treeLevel: item.tree_level || 0,
          wateredToday: false // Placeholder, will be calculated later
        };
        return partnerData;
      }).filter((p: any): p is Partner => p !== null);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const partner = relationships.find(r => r.relationType === activeRole) || null;

  // 2. Fetch Logs
  const { data: logs = [] } = useQuery({
    queryKey: ['relation_logs', partner?.relationshipId],
    queryFn: async () => {
      if (!partner) return [];
      const data = await api.relationships.getLogs(partner.relationshipId);
      return data as RelationLog[];
    },
    enabled: !!partner?.relationshipId,
  });

  return { relationships, partner, logs, isRelLoading };
};
