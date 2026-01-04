
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

/**
 * @deprecated Use <NavBar /> directly instead.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, rightAction, className = '' }) => {
  return (
    <NavBar
      title={title}
      onBack={onBack}
      right={rightAction}
      className={className}
    />
  );
};
