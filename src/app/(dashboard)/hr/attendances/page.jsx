"use client";

import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import AttendanceTab from "@/app/(dashboard)/hr/employees/tabs/AttendanceTab";

import { usePermission } from "@/Hooks/usePermission";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCreateShiftAssignmentMutation, useGetAttendanceCorrectionsQuery, useGetShiftAssignmentsQuery, useReviewAttendanceCorrectionMutation } from "@/redux/attendance/attendancesApi";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";

function ShiftScheduler() {
    const { t } = useTranslation();
    const canCreate = usePermission("attendances.create");
    const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canCreate });
    const { data: shifts = [] } = useGetShiftAssignmentsQuery(undefined, { skip: !canCreate });
    const [createShift, { isLoading }] = useCreateShiftAssignmentMutation();
    const [form, setForm] = useState({ employee_id: "", date: "", start_time: "09:00", end_time: "17:00", break_minutes: 0, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    if (!canCreate) return null;
    const submit = async event => {
        event.preventDefault();
        await createShift({ ...form, break_minutes: Number(form.break_minutes) }).unwrap();
    };
    return <section className="rounded-2xl border border-status-border bg-surface p-4">
        <h2 className="font-bold text-cell-primary">{t("Shift Schedule")}</h2>
        <form onSubmit={submit} className="mt-3 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <select required value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary"><option value="">{t("Employee")}</option>{employees.map(employee => <option key={employee.user_id} value={employee.user_id}>{employee.user?.name}</option>)}</select>
            <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            <input required type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            <input required type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            <input type="number" min="0" value={form.break_minutes} onChange={e => setForm({ ...form, break_minutes: e.target.value })} placeholder={t("Break minutes")} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            <button disabled={isLoading} className="rounded-lg bg-primary-base px-3 py-2 text-sm font-semibold text-white">{t("Assign Shift")}</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">{shifts.slice(0, 10).map(shift => <span key={shift._id} className="rounded-full bg-status-bg px-3 py-1 text-xs text-cell-secondary">{shift.date} · {shift.employee_id?.name} · {shift.start_time}–{shift.end_time}{shift.end_date !== shift.date ? " +1" : ""}</span>)}</div>
    </section>;
}

function CorrectionInbox() {
    const { t } = useTranslation();
    const canReview = usePermission("attendances.update");
    const { data: corrections = [] } = useGetAttendanceCorrectionsQuery(undefined, { skip: !canReview });
    const [review, { isLoading }] = useReviewAttendanceCorrectionMutation();
    const pending = corrections.filter(item => item.status === "OPEN");
    if (!canReview) return null;
    return <section className="rounded-2xl border border-status-border bg-surface p-4">
        <h2 className="font-bold text-cell-primary">{t("Attendance Correction Requests")}</h2>
        <div className="mt-3 grid gap-2">
            {pending.map(item => <div key={item._id} className="flex flex-col justify-between gap-3 rounded-xl bg-status-bg p-3 md:flex-row md:items-center">
                <div className="text-sm text-cell-secondary">
                    <strong className="text-cell-primary">{item.employee_id?.name}</strong> — {item.attendance_id?.date}: {item.proposed_start_time}–{item.proposed_end_time}
                    <p>{item.reason}</p>
                </div>
                <div className="flex gap-2">
                    <button disabled={isLoading} onClick={() => review({ id: item._id, approved: true }).unwrap()} className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white">{t("Approve")}</button>
                    <button disabled={isLoading} onClick={() => review({ id: item._id, approved: false, comment: t("Correction rejected") }).unwrap()} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">{t("Reject")}</button>
                </div>
            </div>)}
            {pending.length === 0 && <p className="text-sm text-cell-secondary">{t("No pending corrections")}</p>}
        </div>
    </section>;
}

function AttendancesAdminPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const userType = useSelector(selectUserType);
    const canTrackAll = usePermission("attendances.track_all");
    const canTrackDept = usePermission("attendances.track_department");

    const isAuthorized = canTrackAll || canTrackDept;
    const scope = canTrackAll ? "track_all" : "track_department";
    const isEmployee = userType === "Employee";

    useEffect(() => {
        if (userType && !isAuthorized) {
            router.replace(isEmployee ? "/attendance" : "/dashboard");
        }
    }, [userType, isAuthorized, isEmployee, router]);

    if (!isAuthorized) return null;

    return (
        <Page title={t("HR — Attendances Management")}>
            <div className="flex flex-col gap-4">
                <AttendanceTab />
                <ShiftScheduler />
                <CorrectionInbox />
            </div>
        </Page>
    );
}

export default AttendancesAdminPage;
