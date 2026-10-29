"use client";

import { useTranslation } from "react-i18next";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetEmployeeRequestsQuery } from "@/redux/employees/employeeRequestsApi";

const groups = [
    { title: "People", tabs: ["employees", "lifecycle", "contracts", "recruitment", "organization"] },
    { title: "Time and requests", tabs: ["attendance", "leaves", "requests", "rotations"] },
    { title: "Pay", tabs: ["salary", "payroll"] },
    { title: "Growth and feedback", tabs: ["performance", "development", "learning", "surveys"] },
];

export default function HROverview({ sections, onNavigate, canViewEmployees, canViewRequests }) {
    const { t } = useTranslation();
    const { data: employees, isLoading: employeesLoading, isError: employeesError } = useGetEmployeesQuery(undefined, { skip: !canViewEmployees });
    const { data: requests, isLoading: requestsLoading, isError: requestsError } = useGetEmployeeRequestsQuery(undefined, { skip: !canViewRequests });
    const pendingRequests = Array.isArray(requests)
        ? requests.filter((request) => request.status === "open" && !request.is_archived).length
        : null;
    const summary = [
        canViewEmployees && { label: "Total employees", value: employeesLoading ? "…" : employeesError ? "—" : Array.isArray(employees) ? employees.length : "—" },
        canViewRequests && { label: "Open requests", value: requestsLoading ? "…" : requestsError ? "—" : pendingRequests ?? "—" },
    ].filter(Boolean);

    return (
        <div className="space-y-7 pb-8" dir="auto">
            <div className="rounded-2xl border border-status-border bg-white p-6 dark:bg-gray-900">
                <h2 className="text-xl font-semibold text-cell-primary">{t("HR overview")}</h2>
                <p className="mt-2 text-sm text-cell-secondary">{t("Choose an area to review and manage its work.")}</p>
                {summary.length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {summary.map(({ label, value }) => <div key={label} className="rounded-xl border border-status-border p-4">
                        <p className="text-sm text-cell-secondary">{t(label)}</p>
                        <p className="mt-1 text-2xl font-semibold text-cell-primary">{value}</p>
                    </div>)}
                </div>}
            </div>
            {groups.map((group) => {
                const available = group.tabs.map((key) => sections.find((section) => section.key === key)).filter(Boolean);
                if (available.length === 0) return null;
                return <section key={group.title}>
                    <h3 className="mb-3 text-base font-semibold text-cell-primary">{t(group.title)}</h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {available.map((section) => <button key={section.key} type="button"
                            onClick={() => onNavigate(section.key)}
                            className="rounded-xl border border-status-border bg-white p-4 text-start text-cell-primary transition hover:border-primary-500 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 dark:bg-gray-900">
                            <span className="font-medium">{section.title}</span>
                            <span className="mt-2 block text-sm text-primary-500">{t("Open section")} →</span>
                        </button>)}
                    </div>
                </section>;
            })}
        </div>
    );
}
