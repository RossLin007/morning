
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useTranslation } from '@/hooks/useTranslation';
import { courseData } from '@/data/courseData';
import { Icon } from '@/components/ui/Icon';

interface LearningPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (lessonId: string, title: string, note: string) => void;
}

export const LearningPlanModal: React.FC<LearningPlanModalProps> = ({ isOpen, onClose, onAssign }) => {
  const { t } = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');
  const [note, setNote] = useState('');

  // Flatten lessons for selection
  const allLessons = courseData.flatMap(chapter => chapter.lessons.map(lesson => ({
      ...lesson,
      chapterTitle: chapter.title
  })));

  const handleAssign = () => {
      if (selectedLesson && selectedLessonTitle) {
          onAssign(selectedLesson, selectedLessonTitle, note);
          onClose();
          // Reset
          setSelectedLesson(null);
          setNote('');
      }
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={t('relationships.plan_modal_title')} 
        type="bottom"
        className="max-h-[85vh] flex flex-col"
    >
        <div className="flex flex-col h-full overflow-hidden">
            <p className="text-xs text-gray-400 mb-4">{t('relationships.plan_modal_subtitle')}</p>
            
            <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1">
                {allLessons.map(lesson => (
                    <div 
                        key={lesson.id}
                        onClick={() => { setSelectedLesson(lesson.id); setSelectedLessonTitle(lesson.title); }}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                            selectedLesson === lesson.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-transparent bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedLesson === lesson.id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                            {lesson.day}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-text-main dark:text-white">{lesson.title}</h4>
                            <p className="text-[10px] text-gray-400">{lesson.duration} • {lesson.chapterTitle}</p>
                        </div>
                        {selectedLesson === lesson.id && <Icon name="check_circle" className="text-primary" filled />}
                    </div>
                ))}
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="给学员的寄语 (可选)..."
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-sm outline-none resize-none mb-4 focus:ring-1 focus:ring-primary/30"
                    rows={2}
                />
                <button 
                    onClick={handleAssign}
                    disabled={!selectedLesson}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                >
                    {t('relationships.assign_action')}
                </button>
            </div>
        </div>
    </Modal>
  );
};
