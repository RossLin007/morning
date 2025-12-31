import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  user: string;
  avatar?: string;
  content: string;
  isSystem?: boolean;
  timestamp: number;
  type?: 'chat' | 'broadcast';
}

export const useLiveChat = (roomId: string = 'morning_live') => {
  const [messages] = useState<ChatMessage[]>([]);

  // Realtime is temporarily disabled as direct Supabase access is removed from frontend.
  // Backend WebSocket relay is needed for full restoration.
  const status = 'offline';
  const onlineCount = 1;

  const sendMessage = async (content: string) => {
    console.log("Chat message sent (Offline mode):", content);
  };

  return { messages, onlineCount, status, sendMessage };
};