import React from 'react';
import { FileText, Inbox } from 'lucide-react';

/**
 * EmptyState Component
 * Displays empty state messages when no data is available
 * Used for lists, tables, and content areas
 */
export const EmptyState = ({
  title = 'No data found',
  message,
  icon: Icon = Inbox,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-10 text-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      {message && (
        <p className="text-sm text-gray-600 max-w-sm">{message}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

