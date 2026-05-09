import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const ProcessingOverlay = ({ isOpen, message }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-all duration-200">
      <div className="bg-surface px-6 py-5 rounded-xl shadow-lg border border-status-border flex items-center gap-4 animate-scale-in min-w-[260px]">
        <div className="w-6 h-6 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin shrink-0"></div>
        <span className="text-table-title font-medium text-sm">
          {t(message || 'Processing...')}
        </span>
      </div>
    </div>,
    document.body
  );
};

export default ProcessingOverlay;

