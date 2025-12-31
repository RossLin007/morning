
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export const useAchievements = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: unlockedBadges = [], isLoading } = useQuery({
        queryKey: ['achievements', user?.id],
        queryFn: async () => {
            if (!user) return [];
            return api.achievements.list();
        },
        enabled: !!user,
    });

    const unlockMutation = useMutation({
        mutationFn: (id: string) => api.achievements.unlock(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['achievements', user?.id] });
        }
    });

    return {
        unlockedBadges, // Array of { achievement_id, unlocked_at }
        isLoading,
        unlockBadge: unlockMutation.mutateAsync,
        isUnlocking: unlockMutation.isPending
    };
};
