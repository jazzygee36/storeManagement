import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className='relative flex items-center cursor-pointer'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg transition-opacity duration-300'>
          {text}
          <div className='absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
