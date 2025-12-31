
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  /**
   * Accessibility label. If provided, role="img" is set.
   * If not provided, aria-hidden="true" is set (decorative icon).
   */
  label?: string; 
  onClick?: (e: React.MouseEvent) => void;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', filled = false, label, onClick }) => {
  return (
    <span 
      className={`material-symbols-outlined select-none ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={!label}
      onClick={onClick}
    >
      {name}
    </span>
  );
};
