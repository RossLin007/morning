import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ChatMessage, ChatSession } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { checkRateLimit, aiChatRateLimiter, RateLimitError } from '@/lib/rateLimit';
import { monitor } from '@/lib/monitor';

export const useAIChat = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // 1. Fetch Sessions
  const { data: sessions } = useQuery({
    queryKey: ['chat_sessions'],
    queryFn: async () => {
      const data = await api.chat.listSessions();
      return data as ChatSession[];
    },
    enabled: !!user,
  });

  // 2. Initialize or Select Session
  useEffect(() => {
    if (sessions && sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions, currentSessionId]);

  // 3. Create New Session
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      return api.chat.createSession('新对话');
    },
    onSuccess: (newSession) => {
      queryClient.setQueryData(['chat_sessions'], (old: ChatSession[] = []) => [newSession, ...old]);
      setCurrentSessionId(newSession.id);
    },
  });

  // 4. Fetch Messages for Current Session
  const { data: messages = [] } = useQuery({
    queryKey: ['chat_messages', currentSessionId],
    queryFn: async () => {
      if (!currentSessionId) return [];
      const data = await api.chat.getMessages(currentSessionId);
      return data as unknown as ChatMessage[];
    },
    enabled: !!currentSessionId,
  });

  // 5. Send Message Logic
  const sendMessage = useCallback(async (text: string, contextPrompt?: string) => {
    if (!user || !text.trim()) return;

    // Rate limiting check
    const rateLimitKey = `${user.id}_chat`;
    try {
      checkRateLimit(aiChatRateLimiter, rateLimitKey);
    } catch (err) {
      if (err instanceof RateLimitError) {
        monitor.logError(err, { userId: user.id });
        throw new Error(`发送太快了，请 ${Math.ceil(err.resetTime / 1000)} 秒后再试`);
      }
      throw err;
    }

    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession = await createSessionMutation.mutateAsync();
      sessionId = newSession.id;
    }

    // A. Optimistic User Message
    const userMsgId = crypto.randomUUID();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };

    queryClient.setQueryData(['chat_messages', sessionId], (old: ChatMessage[] = []) => [...old, newUserMsg]);
    setIsAiThinking(true);

    try {
      // B. Save User Message via BFF
      await api.chat.saveMessage(sessionId, {
        role: 'user',
        content: text
      });

      // C. Prepare AI Context
      const historyContext = messages.slice(-10).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      // D. Call AI via BFF
      const aiResponse = await api.ai.generate(text, contextPrompt, historyContext);
      
      const fullResponse = aiResponse.text || "";
      const sources = aiResponse.sources;
      const aiMsgId = crypto.randomUUID();

      // E. Update UI with AI Message
      queryClient.setQueryData(['chat_messages', sessionId], (old: ChatMessage[] = []) => [
        ...old,
        { id: aiMsgId, role: 'model', content: fullResponse, sources }
      ]);

      // F. Save AI Message via BFF
      await api.chat.saveMessage(sessionId, {
        role: 'model',
        content: fullResponse,
        sources
      });

      // G. Update Session Timestamp & Title (if first message)
      if (messages.length === 0) {
          const title = text.slice(0, 20) + (text.length > 20 ? '...' : '');
          await api.chat.updateSession(sessionId, { title });
          queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      } else {
          await api.chat.updateSession(sessionId, { title: sessions?.find(s => s.id === sessionId)?.title || '对话' });
      }

    } catch (err) {
      console.error('AI Chat Error:', err);
      queryClient.setQueryData(['chat_messages', sessionId], (old: ChatMessage[] = []) => [
        ...old,
        { id: 'error', role: 'model', content: '连接中断，请重试。' }
      ]);
    } finally {
      setIsAiThinking(false);
      queryClient.invalidateQueries({ queryKey: ['chat_messages', sessionId] });
    }
  }, [currentSessionId, user, createSessionMutation, messages, queryClient, sessions]);

  const clearHistory = async () => {
      if (currentSessionId) {
          await api.chat.deleteSession(currentSessionId);
          setCurrentSessionId(null);
          queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      }
  };

  return {
    messages,
    isAiThinking,
    sendMessage,
    createSession: createSessionMutation.mutate,
    clearHistory
  };
};