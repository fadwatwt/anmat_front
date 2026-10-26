"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Page from "@/components/Page.jsx";
import RequestsTab from "@/app/(dashboard)/hr/employees/tabs/RequestsTab";

import { usePermission } from "@/Hooks/usePermission";
import { selectUserType } from "@/redux/auth/authSlice";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useCreateApprovalDefinitionMutation, useGetApprovalDefinitionsQuery, useGetApprovalInboxQuery, useGetTeamLeaveCalendarQuery } from "@/redux/employees/employeeRequestsApi";

function ApprovalSettings() {
    const { t } = useTranslation();
    const canUpdate = usePermission("employee_requests.update");
    const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canUpdate });
    const { data: definitions = [] } = useGetApprovalDefinitionsQuery(undefined, { skip: !canUpdate });
    const [createDefinition, { isLoading }] = useCreateApprovalDefinitionMutation();
    const [form, setForm] = useState({ request_type: "DAY_OFF", name: "Leave approval" });
    const [stages, setStages] = useState([{ name: "Manager", approver_id: "", delegate_id: "", escalation_hours: 48 }]);
    if (!canUpdate) return null;
    const submit = async event => {
        event.preventDefault();
        await createDefinition({
            request_type: form.request_type,
            name: form.name,
            stages: stages.map(stage => ({ ...stage, delegate_id: stage.delegate_id || undefined, escalation_hours: Number(stage.escalation_hours) })),
        }).unwrap();
    };
    return <section className="rounded-2xl border border-status-border bg-surface p-4">
        <h2 className="font-bold text-cell-primary">{t("Approval Workflows")}</h2>
        <p className="text-sm text-cell-secondary">{t("New requests keep a snapshot of the active workflow. The delegate becomes eligible after escalation time.")}</p>
        <form onSubmit={submit} className="mt-3 grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
            <select value={form.request_type} onChange={e => setForm({ ...form, request_type: e.target.value })} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                {["DAY_OFF", "SHORT_LEAVE", "WORK_DELAY", "SALARY_ADVANCE"].map(type => <option key={type}>{type}</option>)}
            </select>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t("Workflow name")} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            </div>
            {stages.map((stage, index) => <div key={index} className="grid gap-2 rounded-xl bg-status-bg p-3 md:grid-cols-5">
            <input required value={stage.name} onChange={e => setStages(items => items.map((item, i) => i === index ? { ...item, name: e.target.value } : item))} placeholder={`${t("Stage")} ${index + 1}`} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            <select required value={stage.approver_id} onChange={e => setStages(items => items.map((item, i) => i === index ? { ...item, approver_id: e.target.value } : item))} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                <option value="">{t("Select approver")}</option>
                {employees.map(employee => <option key={employee.user_id} value={employee.user_id}>{employee.user?.name}</option>)}
            </select>
            <select value={stage.delegate_id} onChange={e => setStages(items => items.map((item, i) => i === index ? { ...item, delegate_id: e.target.value } : item))} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                <option value="">{t("No escalation delegate")}</option>
                {employees.map(employee => <option key={employee.user_id} value={employee.user_id}>{employee.user?.name}</option>)}
            </select>
            <input type="number" min="1" max="720" value={stage.escalation_hours} onChange={e => setStages(items => items.map((item, i) => i === index ? { ...item, escalation_hours: e.target.value } : item))} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            <button type="button" disabled={stages.length === 1} onClick={() => setStages(items => items.filter((_, i) => i !== index))} className="rounded-lg border border-status-border px-3 py-2 text-sm text-cell-secondary disabled:opacity-40">{t("Remove")}</button>
            </div>)}
            <button type="button" onClick={() => setStages(items => [...items, { name: "", approver_id: "", delegate_id: "", escalation_hours: 48 }])} className="rounded-lg border border-primary-base px-4 py-2 text-sm font-semibold text-primary-base">{t("Add Approval Stage")}</button>
            <button disabled={isLoading} className="rounded-lg bg-primary-base px-4 py-2 font-semibold text-white disabled:opacity-50">{t("Activate Workflow")}</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">{definitions.filter(item => item.is_active).map(item => <span key={item._id} className="rounded-full bg-status-bg px-3 py-1 text-xs text-cell-secondary">{item.request_type}: {item.name}</span>)}</div>
    </section>;
}

function ApprovalInboxAndCalendar() {
    const { t } = useTranslation();
    const canUpdate = usePermission("employee_requests.update");
    const { data: inbox = [] } = useGetApprovalInboxQuery(undefined, { skip: !canUpdate });
    const { data: calendar = { requests: [], coverage: [] } } = useGetTeamLeaveCalendarQuery();
    const conflicts = calendar.coverage.filter(day => day.has_conflict);
    return <div className="grid gap-4 lg:grid-cols-2">
        {canUpdate && <section className="rounded-2xl border border-status-border bg-surface p-4">
            <h2 className="font-bold text-cell-primary">{t("My Approval Inbox")}</h2>
            <div className="mt-3 grid gap-2">{inbox.map(item => <div key={item._id} className="rounded-xl bg-status-bg p-3 text-sm text-cell-secondary"><strong className="text-cell-primary">{item.employee?.name}</strong> · {t(item.type)} · {item.current_stage?.name}{item.is_overdue && <span className="ms-2 text-red-600">{t("Overdue")}</span>}</div>)}{inbox.length === 0 && <p className="text-sm text-cell-secondary">{t("No requests waiting for your approval")}</p>}</div>
        </section>}
        <section className="rounded-2xl border border-status-border bg-surface p-4">
            <h2 className="font-bold text-cell-primary">{t("Team Leave Calendar")}</h2>
            <p className="text-sm text-cell-secondary">{calendar.requests.length} {t("leave requests this month")}</p>
            <div className="mt-3 flex flex-wrap gap-2">{calendar.coverage.map(day => <span key={day.date} className={`rounded-full px-3 py-1 text-xs ${day.has_conflict ? "bg-red-50 text-red-700" : "bg-status-bg text-cell-secondary"}`}>{day.date}: {day.employees_off}</span>)}</div>
            {conflicts.length > 0 && <p className="mt-3 text-sm text-red-600">{t("Coverage conflicts detected")}: {conflicts.length}</p>}
        </section>
    </div>;
}

function RequestsAdminPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const userType = useSelector(selectUserType);
    const canTrackAll = usePermission("employee_requests.track_all");
    const canTrackDept = usePermission("employee_requests.track_department");

    const isAuthorized = canTrackAll || canTrackDept;
    const scope = canTrackAll ? "track_all" : "track_department";
    const isEmployee = userType === "Employee";

    useEffect(() => {
        if (userType && !isAuthorized) {
            router.replace(isEmployee ? "/requests" : "/dashboard");
        }
    }, [userType, isAuthorized, isEmployee, router]);

    if (!isAuthorized) return null;

    return (
        <Page title={t("HR — Requests Management")}>
            <div className="flex flex-col gap-4">
                <RequestsTab />
                <ApprovalInboxAndCalendar />
                <ApprovalSettings />
            </div>
        </Page>
    );
}

export default RequestsAdminPage;
