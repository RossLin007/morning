import { uniauth } from './uniauth';

const BASE_URL = '/api';

class ApiClient {
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const token = await uniauth.getAccessToken(); // Ensure we have a valid token
    
    if (!token) {
        throw new Error('Not authenticated');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  // --- Domain: Community ---
  public community = {
    listPosts: (from: number, to: number) => 
        this.fetch(`/posts?from=${from}&to=${to}`),
    
    createPost: (data: { user_id: string; content: string; image_url?: string }) => 
        this.fetch('/posts', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    getPost: (id: string) => this.fetch(`/posts/${id}`),
    
    toggleLike: (postId: string, userId: string) => 
        this.fetch(`/posts/${postId}/like`, { method: 'POST' }), // Need to implement this in backend
        
    getComments: (postId: string) => this.fetch(`/posts/${postId}/comments`),
    
    addComment: (data: any) => this.fetch(`/posts/${data.post_id}/comments`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
  };

  // --- Domain: AI ---
  public ai = {
      generate: (prompt: string, systemInstruction?: string, history?: any[]) => 
          this.fetch('/genai', {
              method: 'POST',
              body: JSON.stringify({ prompt, systemInstruction, history })
          })
  }

  // --- Domain: Profile ---
  public profile = {
      get: (id: string) => this.fetch('/profile'),
      update: (id: string, data: any) => this.fetch('/profile', {
          method: 'PUT',
          body: JSON.stringify(data)
      }),
      create: (data: any) => this.fetch('/profile', {
          method: 'POST',
          body: JSON.stringify(data)
      }),
      addReward: (xp: number, coins: number) => this.fetch('/profile/reward', {
          method: 'POST',
          body: JSON.stringify({ xp, coins })
      })
  };

  // --- Domain: Relationships ---
  public relationships = {
      list: () => this.fetch('/relationships'),
      getLogs: (relId: string) => this.fetch(`/relationships/${relId}/logs`),
      water: (relId: string, currentLevel: number) => this.fetch(`/relationships/${relId}/water`, {
          method: 'POST',
          body: JSON.stringify({ currentLevel })
      }),
      sendMessage: (relId: string, content: string, type: string) => this.fetch(`/relationships/${relId}/messages`, {
          method: 'POST',
          body: JSON.stringify({ content, type })
      })
  };

  // --- Domain: Chat ---
  public chat = {
      listSessions: () => this.fetch('/chat/sessions'),
      createSession: (title?: string) => this.fetch('/chat/sessions', {
          method: 'POST',
          body: JSON.stringify({ title })
      }),
      deleteSession: (id: string) => this.fetch(`/chat/sessions/${id}`, {
          method: 'DELETE'
      }),
      getMessages: (sessionId: string) => this.fetch(`/chat/sessions/${sessionId}/messages`),
      saveMessage: (sessionId: string, data: { role: string; content: string; sources?: any }) => 
          this.fetch(`/chat/sessions/${sessionId}/messages`, {
              method: 'POST',
              body: JSON.stringify(data)
          }),
      updateSession: (sessionId: string, data: { title: string }) => 
          this.fetch(`/chat/sessions/${sessionId}`, {
              method: 'PUT',
              body: JSON.stringify(data)
          })
  };

  // --- Domain: Progress ---
  public progress = {
      get: () => this.fetch('/progress'),
      updateProgress: (lessonIds: string[]) => this.fetch('/progress', {
          method: 'POST',
          body: JSON.stringify({ lesson_ids: lessonIds })
      })
  };

  // --- Domain: Tasks ---
  public tasks = {
      listToday: () => this.fetch('/tasks'),
      complete: (taskId: string) => this.fetch(`/tasks/${taskId}/complete`, {
          method: 'POST'
      })
  };

  // --- Domain: Checkins ---
  public checkins = {
      list: () => this.fetch('/checkins'),
      create: (date?: string) => this.fetch('/checkins', {
          method: 'POST',
          body: JSON.stringify({ date })
      })
  };

  // --- Domain: Achievements ---
  public achievements = {
      list: () => this.fetch('/achievements'),
      unlock: (id: string) => this.fetch(`/achievements/${id}/unlock`, {
          method: 'POST'
      })
  };

  // --- Domain: Match ---
  public match = {
      find: () => this.fetch('/match/find'),
      connect: (data: { partner_id: string; type: string; sync_rate: number }) => 
          this.fetch('/match/connect', {
              method: 'POST',
              body: JSON.stringify(data)
          })
  };

  // --- Domain: Shop ---
  public shop = {
      listMyItems: () => this.fetch('/shop/items'),
      buy: (itemId: string, price: number) => this.fetch('/shop/buy', {
          method: 'POST',
          body: JSON.stringify({ itemId, price })
      })
  };

  // --- Domain: Shares (Reflections & AI Insights) ---
  public shares = {
      get: (lessonId: string) => this.fetch(`/shares/${lessonId}`),
      create: (data: { lessonId: string; content: string; aiInsight?: string }) => 
          this.fetch('/shares', {
              method: 'POST',
              body: JSON.stringify(data)
          })
  };
}

export const api = new ApiClient();