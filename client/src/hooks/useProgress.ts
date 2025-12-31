
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useCallback } from 'react';

const PROGRESS_KEY = 'mr_learning_progress';

export const useProgress = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // 1. Fetch from BFF (Remote Source of Truth)
    const { data: remoteProgress = [], isLoading } = useQuery({
        queryKey: ['progress', user?.id],
        queryFn: async () => {
            if (!user) return [];
            return api.progress.get();
        },
        enabled: !!user,
    });

    // 2. Sync Mutation
    const syncMutation = useMutation({
        mutationFn: (lessonIds: string[]) => api.progress.sync(lessonIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['progress', user?.id] });
        }
    });

    // 3. Local + Sync Wrapper
    const updateProgress = useCallback(async (lessonIds: string[]) => {
        // Update LocalStorage for immediate feedback
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(lessonIds));
        
        // Sync to Backend
        if (user) {
            await syncMutation.mutateAsync(lessonIds);
        }
    }, [user, syncMutation]);

    const completeLesson = useCallback(async (lessonId: string) => {
        const current = remoteProgress;
        if (!current.includes(lessonId)) {
            const next = [...current, lessonId];
            await updateProgress(next);
        }
    }, [remoteProgress, updateProgress]);

    // Initial Sync: Local -> Remote (Merge)
    useEffect(() => {
        if (user && remoteProgress.length === 0) {
            const local = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
            if (local.length > 0) {
                syncMutation.mutate(local);
            }
        }
    }, [user, remoteProgress.length]); // Only sync once when remote is empty

    return {
        completedLessons: remoteProgress,
        isLoading,
        completeLesson,
        updateProgress
    };
};
