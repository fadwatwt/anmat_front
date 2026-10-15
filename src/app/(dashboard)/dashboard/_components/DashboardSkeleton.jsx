"use client";

import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const Pulse = ({ className = "" }) => (
  <div className={`animate-pulse rounded-2xl bg-status-bg border border-status-border ${className}`} />
);

Pulse.propTypes = {
  className: PropTypes.string,
};

export default function DashboardSkeleton() {
  const { t } = useTranslation();

  return (
    <div className="w-full p-3 sm:p-5 md:p-6 space-y-5" role="status" aria-live="polite">
      <span className="sr-only">{t("Loading Dashboard...")}</span>
      <div className="space-y-2">
        <Pulse className="h-7 w-52 max-w-[70%]" />
        <Pulse className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => <Pulse key={item} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Pulse className="h-72" />
        <Pulse className="h-72" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Pulse className="h-72 lg:col-span-2" />
        <Pulse className="h-72" />
      </div>
    </div>
  );
}
