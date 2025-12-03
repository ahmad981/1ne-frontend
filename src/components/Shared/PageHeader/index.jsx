import React from 'react';

/**
 * PageHeader Component
 * Standardized page header with title, description, and optional actions
 * Used at the top of pages throughout the application
 */
export const PageHeader = ({
  title,
  description,
  badge,
  actions,
  className = '',
}) => {
  return (
    <header className={`space-y-2 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
            {badge && (
              <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-2 text-sm text-gray-600 max-w-3xl">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

