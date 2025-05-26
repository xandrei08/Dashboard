
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  darkMode?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message, darkMode }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const spinnerColor = darkMode ? 'border-accent-400' : 'border-primary-500';
  const textColor = darkMode ? 'text-slate-300' : 'text-gray-600';

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${spinnerColor}`}
      ></div>
      {message && <p className={`mt-2 text-sm ${textColor}`}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
