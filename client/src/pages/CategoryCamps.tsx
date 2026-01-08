import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useHaptics } from '@/hooks/useHaptics';

// Mock category data
const CATEGORY_DATA: Record<string, any> = {
    'painting': {
        title: '🎨 画画',
        description: '用画笔记录生活，用色彩表达情感',
        camps: [
            {
                id: 'p-camp-1',
                theme: '水彩入门·21天基础训练',
                cover: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
                instructor: '林老师',
                avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Lin',
                price: 399,
                members: 45,
                startDate: '2026-02-10'
            },
            {
                id: 'p-camp-2',
                theme: '素描基础·从零开始',
                cover: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
                instructor: '王老师',
                avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Wang',
                price: 299,
                members: 32,
                startDate: '2026-02-15'
            },
            {
                id: 'p-camp-3',
                theme: '色彩理论与实践',
                cover: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
                instructor: '张老师',
                avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Zhang',
                price: 499,
                members: 28,
                startDate: '2026-02-20'
            }
        ]
    },
    'cooking': {
        title: '🍳 料理',
        description: '用心烹饪，品味生活的美好',
        camps: [
            {
                id: 'c-camp-1',
                theme: '家常菜精进·21天厨艺提升',
                cover: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
                instructor: '李大厨',
                avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Li',
                price: 299,
                members: 58,
                startDate: '2026-02-08'
            },
            {
                id: 'c-camp-2',
                theme: '烘焙乐趣·甜点入门',
                cover: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=800&q=80',
                instructor: '刘师傅',
                avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Liu',
                price: 399,
                members: 41,
                startDate: '2026-02-12'
            },
            {
                id: 'c-camp-3',
                theme: '健康轻食·营养搭配',
                cover: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
                instructor: '陈营养师',
                avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Chen',
                price: 499,
                members: 35,
                startDate: '2026-02-18'
            }
        ]
    }
};

export const CategoryCamps: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const { trigger: haptic } = useHaptics();

    const data = CATEGORY_DATA[category || 'painting'] || CATEGORY_DATA['painting'];

    const handleCampClick = (id: string) => {
        haptic('light');
        navigate(`/camps/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#050505] pb-24 font-sans">
            {/* Header */}
            <NavBar
                title={<span className="font-serif font-bold text-lg">{data.title}</span>}
                left={<button onClick={() => navigate(-1)}><Icon name="arrow_back" className="text-xl" /></button>}
                className="bg-transparent"
            />

            <div className="px-4 pt-4 space-y-6">
                {/* Category Description */}
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{data.description}</p>
                </div>

                {/* Camps List */}
                <div className="space-y-4">
                    {data.camps.map((camp: any) => (
                        <div
                            key={camp.id}
                            onClick={() => handleCampClick(camp.id)}
                            className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer active:scale-[0.98] transition-transform"
                        >
                            {/* Cover Image */}
                            <div className="h-48 relative">
                                <img src={camp.cover} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="text-white font-bold text-lg mb-1">{camp.theme}</h3>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src={camp.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{camp.instructor}</p>
                                            <p className="text-xs text-gray-500">{camp.members} 人已加入</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-0.5 text-primary">
                                            <span className="text-xs">¥</span>
                                            <span className="font-bold text-xl">{camp.price}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">{camp.startDate} 开营</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
