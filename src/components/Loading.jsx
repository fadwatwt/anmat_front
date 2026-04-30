import React from 'react';
import { RiLoader4Line } from '@remixicon/react';

const Loading = ({ size = 24, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <RiLoader4Line className="animate-spin text-primary-base dark:text-primary-200" size={size} />
    </div>
  );
};

export default Loading;
