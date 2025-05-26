
import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactElement;
  darkMode?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, darkMode, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  const tooltipClasses = `
    absolute z-10 px-2 py-1 text-xs font-medium text-white 
    ${darkMode ? 'bg-slate-600' : 'bg-gray-700'} 
    rounded-md shadow-sm whitespace-nowrap
    transition-opacity duration-150
    ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `;

  let positionClasses = '';
  switch (position) {
    case 'top':
      positionClasses = 'bottom-full left-1/2 -translate-x-1/2 mb-1.5';
      break;
    case 'bottom':
      positionClasses = 'top-full left-1/2 -translate-x-1/2 mt-1.5';
      break;
    case 'left':
      positionClasses = 'right-full top-1/2 -translate-y-1/2 mr-1.5';
      break;
    case 'right':
      positionClasses = 'left-full top-1/2 -translate-y-1/2 ml-1.5';
      break;
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <div className={`${tooltipClasses} ${positionClasses}`} role="tooltip">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
