"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RiDownloadLine, RiLoader4Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { usePermission } from "@/Hooks/usePermission";

const FORMATS = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel (XLSX)" },
  { value: "pdf", label: "PDF" },
];

export default function AnalyticsExportMenu({ onExport }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);
  const firstItemRef = useRef(null);
  const menuId = useId();
  const canExport = usePermission("reports.export");
  const isRtl = (i18n.resolvedLanguage || i18n.language || "").startsWith("ar");

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    firstItemRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const runExport = async (format) => {
    if (exporting) return;
    setOpen(false);
    setError("");
    setExporting(true);
    try {
      await onExport(format);
    } catch (exportError) {
      console.error("Analytics export failed:", exportError);
      setError(t("Export failed. Please try again."));
    } finally {
      setExporting(false);
    }
  };

  if (!canExport) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !exporting && setOpen((value) => !value)}
        disabled={exporting}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex items-center gap-2 bg-primary-base text-white rounded-xl px-4 py-2 text-sm shadow-sm font-medium hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
      >
        {exporting ? <RiLoader4Line className="size-4 animate-spin" aria-hidden="true" /> : <RiDownloadLine className="size-4" aria-hidden="true" />}
        {exporting ? t("Exporting...") : t("Export")}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("Export")}
          className={`absolute top-full mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden ${isRtl ? "right-0" : "left-0"}`}
        >
          {FORMATS.map((format, index) => (
            <button
              key={format.value}
              ref={index === 0 ? firstItemRef : undefined}
              type="button"
              role="menuitem"
              onClick={() => runExport(format.value)}
              className={`block w-full px-4 py-2.5 text-sm hover:bg-status-bg focus:bg-status-bg focus:outline-none text-cell-secondary ${isRtl ? "text-right" : "text-left"}`}
            >
              {t(format.label)}
            </button>
          ))}
        </div>
      )}
      <span className="sr-only" role="status" aria-live="polite">{exporting ? t("Exporting...") : ""}</span>
      {error && <p role="alert" className={`absolute top-full mt-2 text-xs text-red-600 whitespace-nowrap ${isRtl ? "right-0" : "left-0"}`}>{error}</p>}
    </div>
  );
}

AnalyticsExportMenu.propTypes = {
  onExport: PropTypes.func.isRequired,
};
