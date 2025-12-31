import React from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Icon } from '@/components/ui/Icon';

interface CourseHeaderProps {
  title: string;
  isVisible: boolean;
  scrollProgress: number;
  textSize: string;
  isAmbientOn: boolean;
  onBack: () => void;
  onToggleAmbient: () => void;
  onToggleSettings: () => void;
  showSettings: boolean;
  setTextSize: (size: string) => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  isVisible,
  scrollProgress,
  textSize,
  isAmbientOn,
  onBack,
  onToggleAmbient,
  onToggleSettings,
  showSettings,
  setTextSize
}) => {
  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isVisible ? 'bg-white/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm' : 'bg-transparent pointer-events-none'}`}>
      <div className="flex items-center justify-between p-4">
          <IconButton 
            icon="arrow_back" 
            label="Back"
            onClick={onBack}
            variant={isVisible ? 'ghost' : 'glass'}
            className="pointer-events-auto"
          />
          
          <h2 className={`text-text-main dark:text-white text-base font-bold leading-tight flex-1 text-center font-display transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {title}
          </h2>
          
          <div className="flex items-center justify-end gap-2 pointer-events-auto">
            <IconButton 
                icon="format_size"
                label="Text Settings"
                onClick={onToggleSettings}
                variant={isVisible ? 'ghost' : 'glass'}
                className={showSettings ? 'bg-primary text-white' : ''}
            />
            <IconButton 
                icon={isAmbientOn ? "water_drop" : "rainy"}
                label="Toggle Ambience"
                onClick={onToggleAmbient}
                variant={isVisible ? 'ghost' : 'glass'}
                className={isAmbientOn ? 'text-blue-300' : ''}
                filled={isAmbientOn}
            />
          </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-100 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ width: `${scrollProgress * 100}%` }}></div>
      
      {/* Settings Panel */}
      {showSettings && (
         <div className="absolute top-16 right-4 w-64 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 animate-fade-in-up pointer-events-auto">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
               {['text-sm', 'text-base', 'text-lg', 'text-xl'].map((size, idx) => (
                  <button key={size} onClick={() => setTextSize(size)} className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${textSize === size ? 'bg-white dark:bg-black shadow-sm text-primary' : 'text-gray-400'}`}>
                     {['A', 'A+', 'A++', 'A+++'][idx]}
                  </button>
               ))}
            </div>
         </div>
      )}
    </header>
  );
};