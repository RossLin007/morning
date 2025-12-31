
import { useInfiniteQuery, useQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { api } from '@/lib/api'; // Use new API client
import { Post, Comment } from '@/types';
import { PostSchema, CommentSchema } from '@/lib/schemas';
import { useAuth } from '@/contexts/AuthContext';
import { monitor } from '@/lib/monitor';
import { mapPost, mapComment } from '@/lib/mappers';
import { aiService } from '@/lib/ai';
import { checkRateLimit, postRateLimiter, writeRateLimiter, RateLimitError } from '@/lib/rateLimit';
import { z } from 'zod';

// --- Types ---
const CreatePostSchema = z.object({
  content: z.string().min(1, "内容不能为空").max(2000, "内容不能超过2000字"),
  image_url: z.string().url("图片链接无效").optional(),
});

type CreatePostParams = z.infer<typeof CreatePostSchema>;

const PAGE_SIZE = 10;

export const useCommunity = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    error,
    refetch 
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Use centralized API
      const rawData = await api.community.listPosts(from, to);

      // Zod Validation & Mapping Barrier
      // This logic remains in Hook to act as the "Anti-Corruption Layer" between API DTOs and UI Models
      const validPosts = ((rawData as unknown[]) || []).map((item) => {
          const result = PostSchema.safeParse(item);
          if (!result.success) {
              console.warn(`[Data Safety] Dropped invalid post ${item.id}`, result.error);
              monitor.logError(new Error(`Schema Validation Failed for Post ${item.id}`), { error: result.error, item });
              return null;
          }
          return mapPost(result.data, user?.id);
      }).filter((p): p is Post => p !== null);

      return validPosts;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: Post[], allPages: Post[][]) => {
        return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    enabled: !!user,
  });

  const posts = data?.pages.flatMap(page => page) || [];

  const createPostMutation = useMutation({
    mutationFn: async (params: CreatePostParams) => {
      if (!user) throw new Error("Not authenticated");

      // Rate limiting check
      const rateLimitKey = `${user.id}_post`;
      try {
        checkRateLimit(postRateLimiter, rateLimitKey, `发布太快了，请 ${Math.ceil(postRateLimiter.getResetTime(rateLimitKey) / 1000)} 秒后再试`);
      } catch (err) {
        if (err instanceof RateLimitError) {
          monitor.logError(err, { userId: user.id, action: 'create_post' });
          throw err;
        }
        throw err;
      }

      // 0. Strict Schema Validation
      const parseResult = CreatePostSchema.safeParse(params);
      if (!parseResult.success) {
          throw new Error(parseResult.error.issues[0].message);
      }

      // 1. AI Safety Check
      const safetyResult = await aiService.checkContentSafety(params.content);
      if (!safetyResult.safe) {
          throw new Error(`内容未通过审核: ${safetyResult.reason || '包含敏感信息'}`);
      }

      // 2. Insert via API
      return api.community.createPost({
          user_id: user.id,
          content: params.content,
          image_url: params.image_url
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { liked } = await api.community.toggleLike(postId, user.id);
      return { postId, liked };
    },
    onMutate: async (postId) => {
      // Optimistic Update Implementation
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousData = queryClient.getQueryData<InfiniteData<Post[]>>(['posts']);

      queryClient.setQueryData(['posts'], (old: InfiniteData<Post[]> | undefined) => {
        if (!old) return undefined;
        return {
          ...old,
          pages: old.pages.map((page: Post[]) => 
            page.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLiked: !post.isLiked,
                  likes: post.likes + (post.isLiked ? -1 : 1)
                };
              }
              return post;
            })
          )
        };
      });
      
      // Also update single post view cache if exists
      queryClient.setQueryData(['post', postId], (old: Post | undefined) => {
          if (!old) return undefined;
          return {
              ...old,
              isLiked: !old.isLiked,
              likes: old.likes + (old.isLiked ? -1 : 1)
          };
      });

      return { previousData };
    },
    onError: (err, newTodo, context: { previousData?: InfiniteData<Post[]> } | undefined) => {
      if (context?.previousData) {
        queryClient.setQueryData(['posts'], context.previousData);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables] });
    }
  });

  return {
    posts,
    isLoading,
    error,
    createPost: createPostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    toggleLike: toggleLikeMutation.mutate,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};

export const usePost = (postId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!user) return null;
      
      const data = await api.community.getPost(postId);
      
      const result = PostSchema.safeParse(data);
      if (!result.success) {
          monitor.logError(new Error(`Schema Validation Failed for Post ${postId}`), { error: result.error, data });
          return null;
      }
      
      return mapPost(result.data, user?.id);
    },
    enabled: !!postId && !!user,
  });

  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const data = await api.community.getComments(postId);
      
      return ((data as unknown[]) || []).map(c => {
          const res = CommentSchema.safeParse(c);
          if(!res.success) return null;
          return mapComment(res.data);
      }).filter((c): c is Comment => c !== null);
    },
    enabled: !!postId
  });

  const addCommentMutation = useMutation({
      mutationFn: async (content: string) => {
          if (!user) throw new Error("Not authenticated");

          // Rate limiting check
          const rateLimitKey = `${user.id}_comment`;
          try {
            checkRateLimit(writeRateLimiter, rateLimitKey, `评论太快了，请 ${Math.ceil(writeRateLimiter.getResetTime(rateLimitKey) / 1000)} 秒后再试`);
          } catch (err) {
            if (err instanceof RateLimitError) {
              monitor.logError(err, { userId: user.id, action: 'add_comment' });
              throw err;
            }
            throw err;
          }

          // AI Safety
          const safety = await aiService.checkContentSafety(content);
          if (!safety.safe) throw new Error(`Content unsafe: ${safety.reason}`);

          await api.community.addComment({
              post_id: postId,
              user_id: user.id,
              content
          });
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['comments', postId] });
          queryClient.invalidateQueries({ queryKey: ['post', postId] }); // update count
      }
  });

  return {
      post,
      comments,
      isLoading: isPostLoading || isCommentsLoading,
      addComment: addCommentMutation.mutateAsync,
      isSendingComment: addCommentMutation.isPending
  };
};
