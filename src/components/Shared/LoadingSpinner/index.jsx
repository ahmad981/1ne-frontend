import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner Component
 * Displays a loading spinner with optional message
 * Used for async operations and loading states
 */
export const LoadingSpinner = ({
  size = 'md',
  message,
  className = '',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };
  
  const content = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-gray-400`} />
      {message && (
        <p className="text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="flex h-screen items-center justify-center">
        {content}
      </div>
    );
  }
  
  return content;
};

