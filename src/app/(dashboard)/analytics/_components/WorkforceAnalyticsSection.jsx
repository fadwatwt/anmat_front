"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import {
  RiAlertLine,
  RiBriefcaseLine,
  RiCalendarCheckLine,
  RiGroupLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
} from "@remixicon/react";
import { useGetWorkforceAnalyticsQuery } from "@/redux/analytics/analyticsApi";
import { selectAuth } from "@/redux/auth/authSlice";
import { downloadWorkforceReport } from "@/services/exportService";
import AnalyticsExportMenu from "./AnalyticsExportMenu";

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialDates = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return { startDate: toDateKey(start), endDate: toDateKey(end) };
};

const severityClasses = {
  CRITICAL: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300",
  WARNING: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
  INFO: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300",
};

const StatCard = ({ title, value, note, icon: Icon, color }) => (
  <div className="rounded-2xl border border-status-border bg-surface p-5 shadow-sm">
    <div className="mb-4 flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-cell-secondary">{title}</p>
      <span className="rounded-xl p-2" style={{ backgroundColor: `${color}18`, color }}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
    </div>
    <p className="text-3xl font-bold text-page-title">{value}</p>
    <p className="mt-2 text-xs text-cell-secondary">{note}</p>
  </div>
);

export default function WorkforceAnalyticsSection({ departmentOptions = [], chartTypeFilter = "", alertsOnly = false, hideAlerts = false }) {
  const { t } = useTranslation();
  const { token } = useSelector(selectAuth);
  const dates = useMemo(initialDates, []);
  const [startDate, setStartDate] = useState(dates.startDate);
  const [endDate, setEndDate] = useState(dates.endDate);
  const [departmentId, setDepartmentId] = useState("");

  const filters = useMemo(
    () => ({ startDate, endDate, ...(departmentId ? { departmentId } : {}) }),
    [startDate, endDate, departmentId],
  );
  const { data = {}, isLoading, isFetching, error, refetch } =
    useGetWorkforceAnalyticsQuery(filters);
  const monthlyTrends = data.trends?.monthly || [];
  const hasWorkforceMovement = monthlyTrends.some(
    (item) => item.hires > 0 || item.terminations > 0,
  );
  const hasLateOccurrences = monthlyTrends.some(
    (item) => item.late_occurrences > 0,
  );

  const exportReport = (format) => downloadWorkforceReport(filters, format, token);
  const money = (item) => {
    const divisor = 10 ** (item.minor_unit_digits || 0);
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: item.currency,
      maximumFractionDigits: item.minor_unit_digits || 0,
    }).format((item.net_minor || 0) / divisor);
  };

  if (alertsOnly) {
    if (isLoading || error || !(data.alerts || []).length) return null;
    return <section aria-label={t("Management Alerts")}>            <div className="rounded-2xl border border-status-border bg-surface p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <RiAlertLine className="size-5 text-amber-500" aria-hidden="true" />
                <h3 className="font-bold text-table-title">{t("Management Alerts")}</h3>
              </div>
              <div className="space-y-3">
                {(data.alerts || []).length === 0 ? (
                  <p className="rounded-xl bg-status-bg p-4 text-sm text-cell-secondary">{t("No alerts for the selected period.")}</p>
                ) : data.alerts.map((alert) => (
                  <div key={alert.code} className={`rounded-xl border p-3 ${severityClasses[alert.severity] || severityClasses.INFO}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold">{t(alert.message)}</p>
                      <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-bold dark:bg-black/20">{alert.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div></section>;
  }

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-status-border bg-surface p-6" aria-busy="true">
        <div className="h-7 w-64 animate-pulse rounded bg-status-bg" />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-status-bg" />)}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-label={t("Workforce Analytics")}>
      <div className="flex flex-col gap-4 rounded-2xl border border-status-border bg-surface p-4 shadow-sm xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-xl">
          <h2 className="text-base font-bold text-page-title">
            {t("Report Scope")}
          </h2>
          <p className="mt-1 text-sm text-cell-secondary">
            {t("Choose the period and department for the displayed indicators.")}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-medium text-cell-secondary">
            <span className="mb-1 block">{t("From")}</span>
            <input type="date" value={startDate} max={endDate} onChange={(event) => setStartDate(event.target.value)} className="rounded-xl border border-status-border bg-status-bg px-3 py-2 text-sm text-page-title" />
          </label>
          <label className="text-xs font-medium text-cell-secondary">
            <span className="mb-1 block">{t("To")}</span>
            <input type="date" value={endDate} min={startDate} onChange={(event) => setEndDate(event.target.value)} className="rounded-xl border border-status-border bg-status-bg px-3 py-2 text-sm text-page-title" />
          </label>
          <label className="text-xs font-medium text-cell-secondary">
            <span className="mb-1 block">{t("Department")}</span>
            <select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} className="min-w-44 rounded-xl border border-status-border bg-status-bg px-3 py-2 text-sm text-page-title">
              <option value="">{t("All Departments")}</option>
              {departmentOptions.map((department) => <option key={department.id} value={department.id}>{department.value}</option>)}
            </select>
          </label>
          <button type="button" onClick={refetch} disabled={isFetching} className="rounded-xl border border-status-border bg-status-bg px-4 py-2 text-sm font-medium text-cell-secondary disabled:opacity-60">
            {isFetching ? t("Updating...") : t("Refresh")}
          </button>
          <AnalyticsExportMenu onExport={exportReport} />
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {t("Unable to load workforce analytics. Please try again.")}
        </div>
      )}

      {!error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <StatCard title={t("Headcount")} value={data.headcount?.total ?? 0} note={t("{{count}} new hires", { count: data.headcount?.hires_in_period ?? 0 })} icon={RiGroupLine} color="#4F46E5" />
            <StatCard title={t("Worked Hours")} value={data.attendance?.worked_hours ?? 0} note={t("{{count}} late records", { count: data.attendance?.late_occurrences ?? 0 })} icon={RiTimeLine} color="#0EA5E9" />
            <StatCard title={t("Approved Leaves")} value={data.leaves?.approved ?? 0} note={t("{{count}} pending", { count: data.leaves?.pending ?? 0 })} icon={RiCalendarCheckLine} color="#10B981" />
            <StatCard title={t("Payroll Runs")} value={data.payroll?.runs ?? 0} note={t("{{count}} finalized", { count: data.payroll?.finalized_runs ?? 0 })} icon={RiMoneyDollarCircleLine} color="#F59E0B" />
            <StatCard title={t("Finalized Reviews")} value={data.performance?.finalized ?? 0} note={t("Average rating: {{value}}", { value: data.performance?.average_final_rating ?? 0 })} icon={RiBriefcaseLine} color="#8B5CF6" />
            <StatCard title={t("Active Development Plans")} value={data.development?.active ?? 0} note={t("Average progress: {{value}}%", { value: data.development?.average_progress ?? 0 })} icon={RiBriefcaseLine} color="#EC4899" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className={`rounded-2xl border border-status-border bg-surface p-5 shadow-sm ${hideAlerts ? "xl:col-span-3" : "xl:col-span-2"}`}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="font-bold text-table-title">{t("Monthly Workforce Trends")}</h3>
                <span className="text-xs text-cell-secondary">{data.period?.start} — {data.period?.end}</span>
              </div>
              {(!chartTypeFilter || chartTypeFilter === "line") && (hasWorkforceMovement ? <div className="h-64" aria-label={t("Monthly Workforce Trends")}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends} margin={{ top: 8, right: 20, left: -18, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--status-border)" />
                    <XAxis dataKey="month" tick={{ fill: "var(--text-cell-secondary)", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "var(--text-cell-secondary)", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, borderColor: "var(--status-border)" }} />
                    <Legend />
                    <Line type="monotone" dataKey="hires" name={t("Hires")} stroke="#10B981" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="terminations" name={t("Terminations")} stroke="#EF4444" strokeWidth={2.5} />

                  </LineChart>
                </ResponsiveContainer>
              </div> : <div className="flex h-32 items-center justify-center rounded-xl bg-status-bg px-4 text-center text-sm text-cell-secondary">
                {t("No workforce movement during the selected period.")}
              </div>)}
              {(!chartTypeFilter || chartTypeFilter === "line") && <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold text-table-title">{t("Late Occurrences")}</h4>
                {hasLateOccurrences ? <div className="h-48"><ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends} margin={{ top: 8, right: 20, left: -18, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--status-border)" />
                    <XAxis dataKey="month" tick={{ fill: "var(--text-cell-secondary)", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "var(--text-cell-secondary)", fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="late_occurrences" name={t("Late Occurrences")} stroke="#F59E0B" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer></div> : <div className="flex h-24 items-center justify-center rounded-xl bg-status-bg px-4 text-center text-sm text-cell-secondary">
                  {t("No late occurrences during the selected period.")}
                </div>}
              </div>}
            </div>

{!hideAlerts && <div className="rounded-2xl border border-status-border bg-surface p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <RiAlertLine className="size-5 text-amber-500" aria-hidden="true" />
                <h3 className="font-bold text-table-title">{t("Management Alerts")}</h3>
              </div>
              <div className="space-y-3">
                {(data.alerts || []).length === 0 ? (
                  <p className="rounded-xl bg-status-bg p-4 text-sm text-cell-secondary">{t("No alerts for the selected period.")}</p>
                ) : data.alerts.map((alert) => (
                  <div key={alert.code} className={`rounded-xl border p-3 ${severityClasses[alert.severity] || severityClasses.INFO}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold">{t(alert.message)}</p>
                      <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-bold dark:bg-black/20">{alert.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-status-border bg-surface shadow-sm">
              <h3 className="border-b border-status-border p-5 font-bold text-table-title">{t("Payroll by Currency")}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-status-bg text-cell-secondary"><tr><th className="px-5 py-3 text-start">{t("Currency")}</th><th className="px-5 py-3 text-start">{t("Runs")}</th><th className="px-5 py-3 text-start">{t("Employees")}</th><th className="px-5 py-3 text-start">{t("Net Payroll")}</th></tr></thead>
                  <tbody>
                    {(data.payroll?.by_currency || []).map((item) => <tr key={item.currency} className="border-t border-status-border"><td className="px-5 py-3 font-semibold text-page-title">{item.currency}</td><td className="px-5 py-3 text-cell-secondary">{item.runs}</td><td className="px-5 py-3 text-cell-secondary">{item.employees}</td><td className="px-5 py-3 text-cell-secondary">{money(item)}</td></tr>)}
                    {(data.payroll?.by_currency || []).length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-cell-secondary">{t("No payroll data for the selected period.")}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-status-border bg-surface p-5 shadow-sm">
              <h3 className="mb-5 font-bold text-table-title">{t("Employee Journey Status")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-status-bg p-4"><p className="text-xs text-cell-secondary">{t("Active Lifecycle Cases")}</p><p className="mt-2 text-2xl font-bold text-page-title">{data.lifecycle?.active ?? 0}</p></div>
                <div className="rounded-xl bg-status-bg p-4"><p className="text-xs text-cell-secondary">{t("Overdue Tasks")}</p><p className="mt-2 text-2xl font-bold text-page-title">{data.lifecycle?.overdue_tasks ?? 0}</p></div>
                <div className="rounded-xl bg-status-bg p-4"><p className="text-xs text-cell-secondary">{t("Completed Lifecycle Cases")}</p><p className="mt-2 text-2xl font-bold text-page-title">{data.lifecycle?.completed ?? 0}</p></div>
                <div className="rounded-xl bg-status-bg p-4"><p className="text-xs text-cell-secondary">{t("Completed Development Plans")}</p><p className="mt-2 text-2xl font-bold text-page-title">{data.development?.completed ?? 0}</p></div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

