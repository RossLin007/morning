
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';

interface SessionInfo {
    id: string;
    number: number;
    theme: string;
    subtitle: string;
    status: 'upcoming' | 'active' | 'completed';
    completedDays?: number;
    totalDays: number;
    completedAt?: string;
}

// Mock session data based on 2025 schedule
const SESSIONS: SessionInfo[] = [
    { id: 's8', number: 8, theme: '静水深流', subtitle: '平静与深度', status: 'active', completedDays: 5, totalDays: 21 },
    { id: 's5', number: 5, theme: '内在罗盘', subtitle: '方向与价值观', status: 'completed', completedDays: 21, totalDays: 21, completedAt: '2025-08-02' },
    { id: 's3', number: 3, theme: '生命本然', subtitle: '回归与本质', status: 'completed', completedDays: 21, totalDays: 21, completedAt: '2025-06-08' },
    { id: 's9', number: 9, theme: '创造之手', subtitle: '行动与实现', status: 'upcoming', totalDays: 21 },
    { id: 's10', number: 10, theme: '光之回响', subtitle: '影响与传承', status: 'upcoming', totalDays: 21 },
];

export const PastSessions: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F7F5] dark:bg-[#0A0A0A] pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center">
                        <Icon name="arrow_back" className="text-text-main dark:text-white" />
                    </button>
                    <h1 className="text-lg font-display font-bold text-text-main dark:text-white">往期回顾</h1>
                </div>
            </header>

            {/* Stats Summary */}
            <div className="px-6 py-4">
                <div className="bg-primary/10 rounded-2xl p-4 flex items-center justify-around">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{SESSIONS.filter(s => s.status === 'completed').length}</p>
                        <p className="text-xs text-text-sub dark:text-gray-400">已完成</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary">1</p>
                        <p className="text-xs text-text-sub dark:text-gray-400">进行中</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-text-sub dark:text-gray-400">{SESSIONS.filter(s => s.status === 'upcoming').length}</p>
                        <p className="text-xs text-text-sub dark:text-gray-400">即将开始</p>
                    </div>
                </div>
            </div>

            {/* Sessions List */}
            <div className="px-6 space-y-4">
                {SESSIONS.map((session) => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>
        </div>
    );
};

interface SessionCardProps {
    session: SessionInfo;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
    const getStatusBadge = () => {
        switch (session.status) {
            case 'active':
                return <span className="text-xs font-bold text-white bg-primary px-2 py-0.5 rounded-full">进行中</span>;
            case 'completed':
                return <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">✓ 已完成</span>;
            case 'upcoming':
                return <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">未开始</span>;
        }
    };

    const getProgress = () => {
        if (!session.completedDays) return 0;
        return Math.round((session.completedDays / session.totalDays) * 100);
    };

    return (
        <div className={`bg-white dark:bg-[#151515] rounded-2xl p-4 border ${session.status === 'active' ? 'border-primary' : 'border-gray-50 dark:border-gray-800'
            }`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge()}
                    </div>
                    <h3 className={`font-bold ${session.status === 'upcoming' ? 'text-gray-400' : 'text-text-main dark:text-white'}`}>
                        第{session.number}期：{session.theme}
                    </h3>
                    <p className="text-xs text-text-sub dark:text-gray-400 mt-1">{session.subtitle}</p>

                    {session.status !== 'upcoming' && (
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-text-sub dark:text-gray-400">
                                    {session.completedDays}/{session.totalDays} 天
                                </span>
                                {session.completedAt && (
                                    <span className="text-xs text-text-sub dark:text-gray-400">
                                        结营：{session.completedAt}
                                    </span>
                                )}
                            </div>
                            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${session.status === 'completed' ? 'bg-primary' : 'bg-primary/70'}`}
                                    style={{ width: `${getProgress()}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {session.status !== 'upcoming' && (
                    <Icon
                        name="chevron_right"
                        className="text-gray-300 ml-2 mt-2"
                    />
                )}
            </div>
        </div>
    );
};

export default PastSessions;
