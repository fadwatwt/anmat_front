import React from 'react';
import { useTranslation } from 'react-i18next';

const ProcessingOverlay = ({ isOpen, message }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md transition-all duration-300">
      <div className="bg-surface p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-status-border flex flex-col items-center gap-6 animate-scale-in">
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 border-[4px] border-primary-500/10 rounded-full"></div>
          
          {/* Spinning ring */}
          <div className="absolute inset-0 border-[4px] border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          
          {/* Inner pulse */}
          <div className="absolute inset-6 bg-primary-500/20 rounded-full animate-pulse-slow"></div>
          
          {/* Center glow */}
          <div className="absolute inset-0 m-auto w-4 h-4 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(55,93,251,1)]"></div>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <span className="text-table-title font-bold text-2xl tracking-tight">
            {t(message || 'Processing...')}
          </span>
          <p className="text-cell-secondary text-base font-medium opacity-90 text-center max-w-[250px]">
            {t('Please wait while we complete your request')}
          </p>
          
          <div className="flex gap-2 mt-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
