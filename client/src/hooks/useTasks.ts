
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types';

export const useTasks = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // 1. Fetch Today's Tasks
    const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
        queryKey: ['tasks', user?.id],
        queryFn: async () => {
            if (!user) return [];
            return api.tasks.listToday();
        },
        enabled: !!user,
    });

    // 2. Fetch Checkins (for Calendar)
    const { data: checkins = [], isLoading: isCheckinsLoading } = useQuery({
        queryKey: ['checkins', user?.id],
        queryFn: async () => {
            if (!user) return [];
            return api.checkins.list();
        },
        enabled: !!user,
    });

    // 3. Complete Task Mutation
    const completeTaskMutation = useMutation({
        mutationFn: (taskId: string) => api.tasks.complete(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
        }
    });

    // 4. Add Checkin Mutation
    const addCheckinMutation = useMutation({
        mutationFn: (date?: string) => api.checkins.create(date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checkins', user?.id] });
        }
    });

    return {
        tasks,
        checkins,
        isLoading: isTasksLoading || isCheckinsLoading,
        completeTask: completeTaskMutation.mutateAsync,
        addCheckin: addCheckinMutation.mutateAsync
    };
};
