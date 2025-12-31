
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Partner, RelationLog } from '@/types';

export const usePartnerMutation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const waterMutation = useMutation({
    mutationFn: async ({ relId, currentLevel }: { relId: string, currentLevel: number }) => {
      if (!user) throw new Error("No user");
      return api.relationships.water(relId, currentLevel);
    },
    onMutate: async ({ relId, currentLevel }) => {
      await queryClient.cancelQueries({ queryKey: ['relationships', user?.id] });
      await queryClient.cancelQueries({ queryKey: ['relation_logs', relId] });

      const previousRels = queryClient.getQueryData(['relationships', user?.id]);

      // Optimistic Update: Relationships
      queryClient.setQueryData(['relationships', user?.id], (old: Partner[] = []) => 
        old.map(p => p.relationshipId === relId ? { ...p, treeLevel: currentLevel + 1 } : p)
      );

      // Optimistic Update: Logs
      const fakeLog: RelationLog = {
          id: 'temp-log',
          relationship_id: relId,
          actor_id: user!.id,
          type: 'water',
          content: '为共修树浇了水，愿友谊常青',
          created_at: new Date().toISOString()
      };
      queryClient.setQueryData(['relation_logs', relId], (old: RelationLog[] = []) => [fakeLog, ...old]);

      return { previousRels };
    },
    onError: (err, newTodo, context: any) => {
      if (context?.previousRels) {
        queryClient.setQueryData(['relationships', user?.id], context.previousRels);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['relationships', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['relation_logs', variables.relId] });
    }
  });

  const messageMutation = useMutation({
    mutationFn: async ({ relId, content, type }: { relId: string, content: string, type: 'interaction' | 'note' }) => {
      if (!user) throw new Error("No user");
      return api.relationships.sendMessage(relId, content, type);
    }
  });

  return {
    waterTree: (relId: string, currentLevel: number) => waterMutation.mutateAsync({ relId, currentLevel }),
    sendMessage: (relId: string, content: string, type: 'interaction' | 'note' = 'interaction') => messageMutation.mutateAsync({ relId, content, type }),
    assignPlan: (relId: string, planData: { lessonId: string, note: string, title: string }) => 
      messageMutation.mutateAsync({ 
        relId, 
        content: JSON.stringify({ type: 'plan', ...planData }), 
        type: 'note' 
      }),
    isWatering: waterMutation.isPending
  };
};
