"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetTaskWorkloadQuery } from "@/redux/tasks/subscriberTasksApi";

const weekDate = (date) => {
  const value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  value.setUTCDate(value.getUTCDate() - ((value.getUTCDay() + 6) % 7));
  return value.toISOString().slice(0, 10);
};

export default function WorkloadPanel() {
  const { t, i18n } = useTranslation();
  const [week, setWeek] = useState(() => weekDate(new Date()));
  const { data, isLoading, isError } = useGetTaskWorkloadQuery(week);
  const locale = i18n.language?.startsWith("ar") ? "ar" : "en";
  const dateLabel = useMemo(() => data?.week_start && data?.week_end
    ? `${new Date(`${data.week_start}T00:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "UTC" })} – ${new Date(`${data.week_end}T00:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "UTC" })}`
    : "", [data?.week_start, data?.week_end, locale]);
  const moveWeek = (days) => {
    const date = new Date(`${week}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    setWeek(date.toISOString().slice(0, 10));
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm" aria-label={t("Weekly workload")}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("Weekly workload")}</h2>
          <p className="text-sm text-gray-500">{t("Planned hours are distributed across task working days.")}</p>
        </div>
        <div className="flex items-center gap-2" dir="ltr">
          <button type="button" onClick={() => moveWeek(-7)} className="rounded-lg border px-3 py-1.5" aria-label={t("Previous week")}>‹</button>
          <span className="min-w-32 text-center text-sm">{dateLabel}</span>
          <button type="button" onClick={() => moveWeek(7)} className="rounded-lg border px-3 py-1.5" aria-label={t("Next week")}>›</button>
        </div>
      </div>
      {isLoading ? <p className="text-sm text-gray-500">{t("Loading workload...")}</p>
        : isError ? <p className="text-sm text-red-600">{t("Failed to load workload.")}</p>
        : !data?.people?.length ? <p className="text-sm text-gray-500">{t("No assigned tasks in this week.")}</p>
        : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.people.map((person) => {
              const percentage = person.capacity_hours > 0 ? Math.min(100, person.planned_hours / person.capacity_hours * 100) : 0;
              const leaveConflicts = person.tasks.filter((task) => task.due_on_leave);
              const missingEstimates = person.tasks.filter((task) => !task.estimated_hours).length;
              return <div key={person.employee_id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-2"><strong className="truncate text-sm">{person.name}</strong>{person.overload && <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">{t("Over capacity")}</span>}</div>
                <p className="mt-2 text-sm text-gray-600">{t("Planned hours")}: {person.planned_hours} / {person.capacity_hours == null ? t("Capacity not configured") : `${person.capacity_hours} ${t("hours")}`}</p>
                {person.capacity_hours != null && <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${person.overload ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${percentage}%` }} /></div>}
                <p className="mt-2 text-xs text-gray-500">{person.tasks.length} {t("Tasks")} · {person.leave_days.length} {t("Leave days")}</p>
                {leaveConflicts.length > 0 && <p className="mt-2 text-xs text-amber-700">{t("Tasks due during leave")}: {leaveConflicts.map((task) => task.title).join("، ")}</p>}
                {missingEstimates > 0 && <p className="mt-1 text-xs text-gray-500">{missingEstimates} {t("Tasks without estimates")}</p>}
                {person.weekend_assumed && <p className="mt-1 text-xs text-gray-500">{t("Default weekend assumed")}</p>}
              </div>;
            })}
          </div>}
    </section>
  );
}
