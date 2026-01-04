
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Note } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { NavBar } from '@/components/layout/NavBar';

const initialNotes: Note[] = [
  { id: 'n1', title: '积极主动的核心定义', content: '积极主动不仅仅是主动行动，还包括对选择负责。刺激和回应之间有空间，那个空间就是我们的自由。', date: '2023-10-24', tags: ['习惯一', '感悟'] },
  { id: 'n2', title: '关于关注圈', content: '今天发现我太关注天气和别人的看法了，这些都是关注圈的事。我要把精力收回到影响圈，比如多读书，多运动。', date: '2023-10-23', tags: ['反思'] },
];

export const Notes: React.FC = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const [notes] = useLocalStorage<Note[]>('mr_notes', initialNotes);

  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleNoteClick = (note: Note) => {
    navigate('/note/new', { state: { note } });
  };

  // Filter Logic
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q) || note.tags.some(t => t.toLowerCase().includes(q));
  });

  return (
    <div className="pb-24 animate-fade-in bg-background-light dark:bg-background-dark min-h-full font-sans">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-fade-in-up">
          {toast}
        </div>
      )}

      <NavBar
        title={
          !showSearch ? (
            `我的笔记 (${notes.length})`
          ) : (
            <div className="w-full px-2">
              <input
                type="text"
                placeholder="搜索关键词..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1.5 text-sm outline-none text-text-main dark:text-white"
                style={{ maxWidth: '200px' }}
              />
            </div>
          )
        }
        right={
          <button
            onClick={() => {
              if (showSearch) {
                setSearchQuery('');
              }
              setShowSearch(!showSearch);
            }}
            className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Icon name={showSearch ? "close" : "search"} className="text-gray-600 dark:text-gray-300" />
          </button>
        }
      />

      <div className="p-4 grid grid-cols-1 gap-4">
        {notes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Icon name="edit_note" className="text-4xl mb-2 opacity-50" />
            <p>暂无笔记，去写一篇吧</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Icon name="search_off" className="text-4xl mb-2 opacity-50" />
            <p>未找到相关笔记</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleNoteClick(note)}
              className="bg-white dark:bg-surface-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer group active:scale-[0.99] transition-transform"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                  {/* Simple generic highlight if searching */}
                  {searchQuery && note.title.includes(searchQuery) ? (
                    <span>
                      {note.title.split(searchQuery).map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white rounded px-0.5">{searchQuery}</span>}
                        </React.Fragment>
                      ))}
                    </span>
                  ) : (
                    note.title || '无标题'
                  )}
                </h3>
                <span className="text-xs text-gray-400">{note.date}</span>
              </div>
              <p className="text-sm text-text-sub dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">{note.content}</p>
              <div className="flex gap-2">
                {note.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">#{tag}</span>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Empty State / Add Suggestion */}
        {!showSearch && (
          <div
            onClick={() => navigate('/note/new')}
            className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer active:scale-[0.99]"
          >
            <Icon name="add_circle" className="text-3xl text-gray-300" />
            <p className="text-sm text-gray-400 font-medium">记录新的学习想法</p>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/note/new')}
        className="fixed bottom-6 right-6 size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
      >
        <Icon name="edit" className="text-2xl" />
      </button>
    </div>
  );
};
