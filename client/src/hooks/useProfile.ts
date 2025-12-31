
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { uniauth } from '@/lib/uniauth';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { ProfileSchema } from '@/lib/schemas';
import { monitor } from '@/lib/monitor';
import { mapProfile } from '@/lib/mappers';

// Define a strict schema for updates (whitelist allowed fields)
const ProfileUpdateSchema = ProfileSchema.pick({
    name: true,
    avatar: true,
    bio: true,
});

export const useProfile = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Create user metadata object from UniAuth user
    const userMeta = user ? { name: user.nickname, avatar: user.avatar_url } : undefined;

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            if (!user) return null;

            // Use API Wrapper
            let data = await api.profile.get(user.id);

            // Handle case where profile doesn't exist yet (e.g. first login)
            if (!data) {
                const newProfilePayload = {
                    id: user.id,
                    name: user.nickname || user.email?.split('@')[0] || '书友',
                    avatar: user.avatar_url || `https://api.dicebear.com/7.x/micah/svg?seed=${user.id}`,
                    level: 1,
                };

                data = await api.profile.create(newProfilePayload);

                // Validate created profile
                const result = ProfileSchema.safeParse(data);
                if (!result.success) {
                    monitor.logError(new Error("Created profile schema validation failed"), { error: result.error, data });
                    return mapProfile(data, userMeta);
                }
                return mapProfile(result.data, userMeta);
            }

            // Validate existing profile
            const result = ProfileSchema.safeParse(data);
            if (!result.success) {
                monitor.logError(new Error(`Profile ${user.id} schema mismatch`), { error: result.error, data });
                // Fallback to mapping raw data when validation fails
                return mapProfile(data, userMeta);
            }

            return mapProfile(result.data, userMeta);
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 10, // 10 minutes cache
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (updates: Partial<User>) => {
            if (!user) throw new Error("Not authenticated");

            // 1. Validation
            const parseResult = ProfileUpdateSchema.partial().safeParse(updates);

            if (!parseResult.success) {
                const error = new Error("Invalid profile update data");
                monitor.logError(error, { validationErrors: parseResult.error });
                throw error;
            }

            const safeUpdates = parseResult.data;

            if (Object.keys(safeUpdates).length === 0) {
                return updates;
            }

            // 2. Persist via API
            await api.profile.update(user.id, safeUpdates);

            return safeUpdates;
        },
        onSuccess: async (updates) => {
            // 3. Optimistic update
            queryClient.setQueryData(['profile', user?.id], (old: User | undefined) => ({ ...old, ...updates }));

            // 4. Sync Auth Metadata via UniAuth
            if (updates.name || updates.avatar) {
                try {
                    await uniauth.updateProfile({
                        nickname: updates.name,
                        avatar_url: updates.avatar
                    });
                } catch {
                    // Ignore - DB is the source of truth
                }
            }
        }
    });

    return {
        profile,
        isLoading,
        error,
        updateProfile: updateProfileMutation.mutateAsync,
        isUpdating: updateProfileMutation.isPending
    };
};
