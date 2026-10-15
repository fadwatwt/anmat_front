"use client";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { RiErrorWarningLine, RiFileSearchLine } from "@remixicon/react";

export default function RecordPageState({ loading = false, notFound = false, onRetry, onBack }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="w-full space-y-4" role="status" aria-live="polite">
        <span className="sr-only">{t("Loading...")}</span>
        <div className="h-36 animate-pulse rounded-2xl bg-status-bg border border-status-border" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 animate-pulse rounded-2xl bg-status-bg border border-status-border" />
          <div className="h-64 animate-pulse rounded-2xl bg-status-bg border border-status-border" />
        </div>
      </div>
    );
  }

  return (
    <div role="alert" className="min-h-64 flex flex-col items-center justify-center gap-3 rounded-2xl border border-status-border bg-surface p-6 text-center">
      {notFound ? <RiFileSearchLine size={44} className="text-cell-secondary opacity-50" /> : <RiErrorWarningLine size={44} className="text-red-500" />}
      <h2 className="text-lg font-semibold text-table-title">{notFound ? t("Record not found") : t("Unable to load details")}</h2>
      <p className="max-w-md text-sm text-cell-secondary">
        {notFound ? t("The requested record may have been deleted or is no longer available.") : t("Please check your connection and try again.")}
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        {!notFound && onRetry && <button type="button" onClick={onRetry} className="rounded-xl bg-primary-base px-5 py-2 text-sm font-semibold text-white">{t("Try Again")}</button>}
        {onBack && <button type="button" onClick={onBack} className="rounded-xl border border-status-border px-5 py-2 text-sm font-semibold text-cell-secondary hover:bg-status-bg">{t("Back")}</button>}
      </div>
    </div>
  );
}

RecordPageState.propTypes = {
  loading: PropTypes.bool,
  notFound: PropTypes.bool,
  onRetry: PropTypes.func,
  onBack: PropTypes.func,
};
