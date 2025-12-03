import React from 'react';

/**
 * InputField Component
 * Standardized input field with consistent styling
 * Used throughout forms in the application
 */
export const InputField = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  min,
  max,
  rows,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';
  
  if (type === 'textarea' || rows) {
    return (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows || 4}
        className={`${baseClasses} ${disabledClasses} resize-none ${className}`}
        {...props}
      />
    );
  }
  
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      min={min}
      max={max}
      className={`${baseClasses} ${disabledClasses} ${className}`}
      {...props}
    />
  );
};

