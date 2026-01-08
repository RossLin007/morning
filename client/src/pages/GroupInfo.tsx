import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useHaptics } from '@/hooks/useHaptics';

// Mock group info
const GROUP_INFO: Record<string, any> = {
    'g1': {
        id: 'g1',
        name: '凡人晨读',
        members: [
            { id: '1', name: '林泰君', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me' },
            { id: '2', name: '意蝴 xx', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yi' },
            { id: '3', name: '徐燕...', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xu' },
            { id: '4', name: '刘伟...', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liu' },
        ],
        announcement: '欢迎加入凡人晨读！让我们一起阅读成长。',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=morning_reading_group_g1'
    },
};

export const GroupInfo: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { trigger: haptic } = useHaptics();

    const group = GROUP_INFO[id || 'g1'] || GROUP_INFO['g1'];

    return (
        <div className="min-h-screen bg-[#EDEDED] dark:bg-[#0A0A0A] pb-safe">
            {/* Header */}
            <header className="bg-[#F7F7F7] dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 pt-safe">
                <div className="h-[44px] flex items-center px-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                        <Icon name="arrow_back" className="text-[20px] text-gray-900 dark:text-white" />
                    </button>
                    <h1 className="flex-1 text-center text-[17px] font-medium text-gray-900 dark:text-white">
                        聊天信息({group.members.length})
                    </h1>
                    <button className="p-2 -mr-2">
                        <Icon name="search" className="text-[20px] text-gray-900 dark:text-white" />
                    </button>
                </div>
            </header>

            {/* Members Grid */}
            <div className="bg-white dark:bg-[#191919] px-4 py-5 mb-2">
                <div className="grid grid-cols-5 gap-4">
                    {group.members.map((member: any) => (
                        <div key={member.id} className="flex flex-col items-center gap-2">
                            <img
                                src={member.avatar}
                                alt=""
                                className="w-14 h-14 rounded-md bg-gray-200"
                            />
                            <span className="text-[12px] text-gray-700 dark:text-gray-300 truncate w-full text-center">
                                {member.name}
                            </span>
                        </div>
                    ))}
                    {/* Add Member Button */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                            <Icon name="add" className="text-[28px] text-gray-400" />
                        </div>
                        <span className="text-[12px] text-gray-500">添加</span>
                    </div>
                    {/* Remove Member Button (Optional) */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                            <Icon name="remove" className="text-[28px] text-gray-400" />
                        </div>
                        <span className="text-[12px] text-gray-500">移除</span>
                    </div>
                </div>
            </div>

            {/* Settings List */}
            <div className="bg-white dark:bg-[#191919] mb-2">
                {/* Group Name */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[15px] text-gray-900 dark:text-white">群聊名称</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] text-gray-500 max-w-[200px] truncate">{group.name}</span>
                        <Icon name="chevron_right" className="text-gray-400 text-[18px]" />
                    </div>
                </div>

                {/* QR Code */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[15px] text-gray-900 dark:text-white">群二维码</span>
                    <div className="flex items-center gap-2">
                        <Icon name="qr_code_2" className="text-gray-500 text-[20px]" />
                        <Icon name="chevron_right" className="text-gray-400 text-[18px]" />
                    </div>
                </div>

                {/* Announcement */}
                <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[15px] text-gray-900 dark:text-white">群公告</span>
                    <Icon name="chevron_right" className="text-gray-400 text-[18px]" />
                </div>
            </div>

            {/* More Settings */}
            <div className="bg-white dark:bg-[#191919] mb-2">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[15px] text-gray-900 dark:text-white">群管理</span>
                    <Icon name="chevron_right" className="text-gray-400 text-[18px]" />
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[15px] text-gray-900 dark:text-white">备注</span>
                    <Icon name="chevron_right" className="text-gray-400 text-[18px]" />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[15px] text-gray-900 dark:text-white">查找聊天记录</span>
                    <Icon name="chevron_right" className="text-gray-400 text-[18px]" />
                </div>
            </div>

            {/* Toggles */}
            <div className="bg-white dark:bg-[#191919] mb-2">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[15px] text-gray-900 dark:text-white">消息免打扰</span>
                    <div className="relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer">
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"></div>
                    </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[15px] text-gray-900 dark:text-white">置顶聊天</span>
                    <div className="relative w-12 h-6 bg-[#07C160] rounded-full cursor-pointer">
                        <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full transition-transform"></div>
                    </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[15px] text-gray-900 dark:text-white">保存到通讯录</span>
                    <div className="relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer">
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"></div>
                    </div>
                </div>
            </div>

            {/* My Nickname */}
            <div className="bg-white dark:bg-[#191919]">
                <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[15px] text-gray-900 dark:text-white">我在群里的昵称</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] text-gray-500">林泰君</span>
                        <Icon name="chevron_right" className="text-gray-400 text-[18px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};
