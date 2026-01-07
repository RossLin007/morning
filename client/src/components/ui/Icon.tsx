
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

/**
 * Icon component using Google Material Symbols.
 * Optimized for mobile with OPSZ 24 (optical size for small icons)
 * and wght 200 (standard weight for clarity).
 */
export const Icon: React.FC<IconProps> = ({ name, className = '', filled = false, label, onClick }) => {
  // Mobile-optimized settings: OPSZ 24 for tab bar icons, wght 200 for clarity
  const baseSettings = "'OPSZ' 24, 'wght' 300";
  const fillSetting = filled ? ", 'FILL' 1" : "";

  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{ fontVariationSettings: baseSettings + fillSetting }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={!label}
      onClick={onClick}
    >
      {name}
    </span>
  );
};
