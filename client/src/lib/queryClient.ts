
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { monitor } from './monitor';

// Global Error Handler for React Query
const handleError = (error: Error, query: any) => {
    // Skip logging for 401/403 as they are usually handled by AuthContext or UI redirection
    const msg = error.message || '';
    if (msg.includes('401') || msg.includes('403')) return;

    console.error(`[Query Error] ${query?.queryKey || 'Mutation'}:`, error);
    
    monitor.logError(error, {
        type: 'query_error',
        key: query?.queryKey,
        meta: query?.meta
    });
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => handleError(error, query),
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => handleError(error, mutation),
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      retry: 1,
      refetchOnWindowFocus: false, // Prevent too many requests in dev
    },
  },
});
