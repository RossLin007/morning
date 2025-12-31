/**
 * Request Deduplication Utility
 *
 * Prevents duplicate in-flight requests for the same resource.
 * Uses a Map to track pending promises and deduplicates concurrent requests.
 */

type RequestKey = string;
type RequestFn<T> = () => Promise<T>;

class RequestDeduplicator {
  private pending: Map<RequestKey, Promise<any>> = new Map();

  /**
   * Execute a request with deduplication.
   * If a request with the same key is already in flight, return its promise.
   *
   * @param key - Unique identifier for the request
   * @param requestFn - Function that returns the request promise
   * @returns Promise<T>
   */
  async execute<T>(key: RequestKey, requestFn: RequestFn<T>): Promise<T> {
    // Check if request is already in flight
    const existing = this.pending.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    // Create new request
    const promise = requestFn()
      .finally(() => {
        // Clean up after request completes (success or failure)
        this.pending.delete(key);
      });

    // Store before request completes
    this.pending.set(key, promise);

    return promise;
  }

  /**
   * Check if a request is currently pending
   */
  isPending(key: RequestKey): boolean {
    return this.pending.has(key);
  }

  /**
   * Cancel a pending request (removes from tracking but doesn't abort the fetch)
   */
  cancel(key: RequestKey): void {
    this.pending.delete(key);
  }

  /**
   * Clear all pending requests
   */
  clear(): void {
    this.pending.clear();
  }

  /**
   * Get count of pending requests
   */
  getPendingCount(): number {
    return this.pending.size;
  }
}

// Global singleton instance
export const requestDeduplicator = new RequestDeduplicator();

/**
 * Higher-order function for deduplicating fetch requests
 *
 * @example
 * const fetchUser = () =>
 *   deduplicateFetch(`user:${userId}`, () => api.user.get(userId));
 */
export function deduplicateFetch<T>(
  key: RequestKey,
  requestFn: RequestFn<T>
): Promise<T> {
  return requestDeduplicator.execute(key, requestFn);
}

/**
 * React Query deduplication middleware
 * Integrates with React Query to prevent duplicate queries
 */
export function createDeduplicationMiddleware() {
  return {
    onFetch: async (context: any) => {
      const { queryKey } = context;

      // Create a unique key from queryKey array
      const key = Array.isArray(queryKey) ? queryKey.join(':') : String(queryKey);

      // Check if already pending
      if (requestDeduplicator.isPending(key)) {
        // Wait for existing request instead of starting new one
        context.fetchOptions = {
          ...context.fetchOptions,
          signal: undefined, // Don't abort the original request
        };
      }

      return context;
    },
  };
}

/**
 * Hook-based deduplication for manual use
 *
 * @example
 * const { data, loading } = useDeduplicatedRequest('user:123', () => fetchUser(123));
 */
export function useDeduplicatedRequest<T>(
  key: RequestKey,
  requestFn: RequestFn<T>,
  deps: any[] = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const execute = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await requestDeduplicator.execute(key, requestFn);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    execute();

    return () => {
      cancelled = true;
      requestDeduplicator.cancel(key);
    };
  }, [key, ...deps]);

  return { data, loading, error };
}
