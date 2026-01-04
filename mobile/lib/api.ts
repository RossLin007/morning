import { storage } from './storage';
import { config } from './config';

const BASE_URL = config.api.baseUrl;

class ApiClient {
    private async fetch(endpoint: string, options: RequestInit = {}) {
        const token = await storage.getAccessToken();

        if (!token) {
            throw new Error('Not authenticated');
        }

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
                body: JSON.stringify(data),
            }),

        getPost: (id: string) => this.fetch(`/posts/${id}`),

        toggleLike: (postId: string, userId: string) =>
            this.fetch(`/posts/${postId}/like`, { method: 'POST' }),

        getComments: (postId: string) => this.fetch(`/posts/${postId}/comments`),

        addComment: (data: { post_id: string; content: string }) =>
            this.fetch(`/posts/${data.post_id}/comments`, {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    };

    // --- Domain: AI ---
    public ai = {
        generate: (prompt: string, systemInstruction?: string, history?: any[]) =>
            this.fetch('/genai', {
                method: 'POST',
                body: JSON.stringify({ prompt, systemInstruction, history }),
            }),
    };

    // --- Domain: Profile ---
    public profile = {
        get: () => this.fetch('/profile'),
        update: (data: any) =>
            this.fetch('/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        create: (data: any) =>
            this.fetch('/profile', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        addReward: (xp: number, coins: number) =>
            this.fetch('/profile/reward', {
                method: 'POST',
                body: JSON.stringify({ xp, coins }),
            }),
    };

    // --- Domain: Progress ---
    public progress = {
        get: () => this.fetch('/progress'),
        updateProgress: (lessonIds: string[]) =>
            this.fetch('/progress', {
                method: 'POST',
                body: JSON.stringify({ lesson_ids: lessonIds }),
            }),
        sync: (lessonIds: string[]) =>
            this.fetch('/progress', {
                method: 'POST',
                body: JSON.stringify({ lesson_ids: lessonIds }),
            }),
    };

    // --- Domain: Tasks ---
    public tasks = {
        listToday: () => this.fetch('/tasks'),
        complete: (taskId: string) =>
            this.fetch(`/tasks/${taskId}/complete`, {
                method: 'POST',
            }),
    };

    // --- Domain: Checkins ---
    public checkins = {
        list: () => this.fetch('/checkins'),
        create: (date?: string) =>
            this.fetch('/checkins', {
                method: 'POST',
                body: JSON.stringify({ date }),
            }),
    };
}

export const api = new ApiClient();
