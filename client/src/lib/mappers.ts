
import { Post, Comment, User, Partner } from '@/types';
import { formatRelativeTime } from './utils';
import { ASSETS } from './constants';
import { Database } from './database.types';
import { PostData, CommentData, Profile as ProfileData } from './schemas';

// --- Input Types ---
// These types accommodate both strict DB types and loose Zod Schema types (where fields might be optional/undefined)
type InputProfile = ProfileData | Database['public']['Tables']['profiles']['Row'];

type InputPost = Omit<PostData, 'profiles' | 'post_likes' | 'comments'> & {
    profiles?: {
        name?: string | null;
        avatar?: string | null;
        level?: number;
    } | InputProfile | null;
    post_likes?: { user_id: string }[] | null;
    comments?: { id: string }[] | null;
    comments_count?: number | null;
};

type InputComment = CommentData;

type DbRelationship = Database['public']['Tables']['relationships']['Row'];

/**
 * Maps Database/Schema Profile to UI User Model
 */
export const mapProfile = (dbProfile: InputProfile, authUserMetadata?: { name?: string; avatar?: string }): User => {
    // Fallback logic for avatar and name
    const avatar = dbProfile.avatar || authUserMetadata?.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${dbProfile.id}`;
    const name = dbProfile.name || authUserMetadata?.name || '书友';

    return {
        id: dbProfile.id,
        name: name,
        avatar: avatar,
        level: dbProfile.level || 1,
        xp: dbProfile.xp || 0,
        coins: dbProfile.coins || 0,
        bio: dbProfile.bio || '',
        streakDays: 0, 
        totalMinutes: 0,
        badgesCount: 0,
        habit: '',
        progress: 0,
        currentDay: 1,
        totalDays: 21,
        isVip: false 
    };
};

/**
 * Maps Database/Schema Post to UI Post Model
 */
export const mapPost = (dbPost: InputPost, currentUserId?: string): Post => {
  const profile = dbPost.profiles;
  const isLiked = dbPost.post_likes && Array.isArray(dbPost.post_likes) 
      ? dbPost.post_likes.some((like) => like.user_id === currentUserId) 
      : false;
  
  const likesCount = dbPost.post_likes ? dbPost.post_likes.length : 0;
  const commentsCount = dbPost.comments ? dbPost.comments.length : (dbPost.comments_count || 0);
  
  // Safe extraction of profile data with fallback
  const userName = profile?.name || '未知用户';
  const userAvatar = profile?.avatar || ASSETS.DEFAULT_AVATAR;
  const userLevel = profile?.level || 1;

  return {
    id: dbPost.id,
    user: {
      name: userName,
      avatar: userAvatar,
      level: userLevel,
    },
    content: dbPost.content,
    image: dbPost.image_url || undefined,
    likes: likesCount,
    comments: commentsCount,
    time: formatRelativeTime(dbPost.created_at),
    isLiked: isLiked,
  };
};

/**
 * Maps Database/Schema Comment to UI Comment Model
 */
export const mapComment = (dbComment: InputComment): Comment => {
    const profile = dbComment.profiles;
    return {
        id: dbComment.id,
        userName: profile?.name || '未知用户',
        userAvatar: profile?.avatar || ASSETS.DEFAULT_AVATAR,
        content: dbComment.content,
        time: formatRelativeTime(dbComment.created_at),
        likes: 0
    };
};

/**
 * Maps Relationship + Profile to Partner Model
 */
export const mapPartner = (relationship: DbRelationship, partnerProfile: InputProfile): Partner => {
    return {
        id: partnerProfile.id,
        relationshipId: relationship.id,
        name: partnerProfile.name || 'Unknown',
        avatar: partnerProfile.avatar || ASSETS.DEFAULT_AVATAR,
        level: partnerProfile.level || 1,
        relationType: relationship.type,
        relationDays: relationship.relation_days || 0,
        syncRate: relationship.sync_rate || 0,
        status: 'online', 
        lastInteraction: relationship.last_interaction 
            ? formatRelativeTime(relationship.last_interaction) 
            : '刚刚',
        treeLevel: relationship.tree_level || 0,
        wateredToday: false 
    };
};
