import { Partner } from '@/types';

export const potentialPartners: Partner[] = [
  {
    id: 'p_mentor',
    relationshipId: 'rel_mock_001',
    name: '林静',
    avatar: 'https://picsum.photos/50/50?random=44',
    level: 8,
    relationType: 'mentor',
    relationDays: 1,
    syncRate: 98,
    status: 'online',
    lastInteraction: '刚刚',
    treeLevel: 3,
  },
  {
    id: 'p_buddy',
    relationshipId: 'rel_mock_002',
    name: 'Alex Chen',
    avatar: 'https://picsum.photos/50/50?random=12',
    level: 3,
    relationType: 'buddy',
    relationDays: 1,
    syncRate: 85,
    status: 'reading',
    lastInteraction: '5分钟前',
    treeLevel: 1,
  },
  {
    id: 'p_mentee',
    relationshipId: 'rel_mock_003',
    name: '小汤圆',
    avatar: 'https://picsum.photos/50/50?random=22',
    level: 1,
    relationType: 'mentee',
    relationDays: 1,
    syncRate: 92,
    status: 'offline',
    lastInteraction: '1小时前',
    treeLevel: 0,
  }
];

export const getRandomPartner = (): Partner => {
  const randomIndex = Math.floor(Math.random() * potentialPartners.length);
  return potentialPartners[randomIndex];
};