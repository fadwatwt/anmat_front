"use client";

import { useTranslation } from "react-i18next";

export default function AnalyticsPageSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse" role="status" aria-live="polite">
      <span className="sr-only">{t("Loading analytics...")}</span>
      <div className="h-10 w-full sm:w-2/3 lg:w-1/3 rounded-xl bg-status-bg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-72 rounded-2xl bg-status-bg border border-status-border" />
        ))}
      </div>
    </div>
  );
}
