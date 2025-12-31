
export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  streakDays: number;
  totalMinutes: number;
  badgesCount: number;
  habit: string;
  progress: number; // 0-100
  currentDay: number;
  totalDays: number;
  
  // v2.0 Commercialization Fields
  isVip?: boolean;
  vipExpireDate?: string; // ISO Date String
  coins?: number; // Virtual Currency
  xp?: number; // Experience Points
  bio?: string;
}

export interface Task {
  id: string;
  type: 'reading' | 'audio' | 'writing' | 'partner'; // Added 'partner'
  title: string;
  subtitle?: string;
  status: 'todo' | 'done' | 'locked';
  deadline?: string;
  duration?: number; // minutes
  thumbnail?: string;
  isRequired?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // url or material icon name
  description: string;
  isUnlocked: boolean;
  colorTheme: string; // e.g., 'green', 'blue'
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'live' | 'star' | 'system';
}

// Updated Types for Relationship System matching DB
export interface Partner {
  id: string; // This is the profile ID of the partner
  relationshipId: string; // The ID of the relationship record
  name: string;
  avatar: string;
  level: number;
  relationType: 'buddy' | 'mentor' | 'mentee';
  relationDays: number;
  syncRate: number; // 0-100% similarity in progress
  status: 'online' | 'offline' | 'reading';
  lastInteraction: string;
  treeLevel: number; // For the relationship tree visualization
  wateredToday?: boolean; // Derived from logs
}

export interface RelationLog {
  id: string;
  relationship_id?: string;
  actor_id?: string; // Who did this
  type: 'water' | 'level_up' | 'sync' | 'note' | 'interaction';
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  likes: number;
  comments: number;
  time: string;
  image?: string;
  isLiked?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  courseId?: string;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  time: string;
  likes: number;
}

// --- Dynamic Course Content Types ---

export interface LessonContent {
  id: string;
  day: number;
  title: string;
  duration: string; // e.g. "15 min"
  totalSeconds: number; // for audio player
  image: string;
  points: {
    icon: string;
    title: string;
    desc: string;
  }[];
  content: string; // Markdown supported
  quote?: {
    text: string;
    author: string;
  };
  isLocked?: boolean; // Derived state usually
}

export interface Chapter {
  id: string;
  title: string;
  desc: string;
  lessons: LessonContent[]; // Contains simplified lesson info for list view
  isLocked: boolean;
}

// Gamification Events
export type RewardType = 'xp' | 'coin';
export interface RewardEvent {
  type: RewardType;
  amount: number;
  reason: string;
}

// --- AI Chat Types ---
export interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  sources?: { uri: string; title: string }[];
  created_at?: string;
  // UI helpers
  isTyping?: boolean; 
}