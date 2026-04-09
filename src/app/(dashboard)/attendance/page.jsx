"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { format, parse } from "date-fns";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import {
    useGetMyAttendancesQuery,
    useCheckInMutation,
    useCheckOutMutation,
} from "@/redux/attendance/employeeAttendanceApi";
import { useProcessing } from "@/app/providers";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { BsClockFill, BsSlashCircleFill } from "react-icons/bs";
import { GoCheckCircleFill } from "react-icons/go";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import PropTypes from "prop-types";

/* ─── Status Badge ─────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const { t } = useTranslation();
    let Icon;
    let colors;

    switch (status) {
        case "On Time":
            Icon = <GoCheckCircleFill size={14} className="text-green-600" />;
            colors = "bg-green-50 text-green-700 border-green-200";
            break;
        case "Late":
            Icon = <BsClockFill size={14} className="text-[#C2540A]" />;
            colors = "bg-[#FFF9F5] text-[#C2540A] border-[#FFD9C2]";
            break;
        case "Absent":
            Icon = <BsSlashCircleFill size={14} className="text-cell-secondary" />;
            colors = "bg-status-bg text-cell-secondary border-status-border";
            break;
        default:
            Icon = <BsClockFill size={14} className="text-[#C2540A]" />;
            colors = "bg-status-bg text-cell-secondary border-status-border";
    }

    return (
        <div className={`flex items-center gap-1.5 border rounded-full px-2.5 py-1 w-fit ${colors}`}>
            {Icon}
            <span className="text-[11px] font-medium">{t(status)}</span>
        </div>
    );
};

StatusBadge.propTypes = { status: PropTypes.string.isRequired };

/* ─── Check-In / Check-Out Action Card ─────────────────────────── */
const AttendanceActionCard = ({ hasCheckedIn, checkOutDone, isCheckingIn, isCheckingOut, onClickCheckIn, onClickCheckOut }) => {
    const { t } = useTranslation();
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateString = now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="rounded-2xl border border-status-border bg-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            {/* Date / Time */}
            <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold text-cell-primary tracking-tight">{timeString}</p>
                <p className="text-sm text-cell-secondary">{dateString}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span
                        className={`w-2.5 h-2.5 rounded-full ${
                            hasCheckedIn ? "bg-green-500 animate-pulse" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                    />
                    <span className="text-xs font-medium text-cell-secondary">
                        {hasCheckedIn ? t("Currently Checked In") : t("Not Checked In")}
                    </span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
                {/* Check-In — hidden once successfully checked in */}
                {!hasCheckedIn && (
                    <button
                        id="btn-checkin"
                        onClick={onClickCheckIn}
                        disabled={isCheckingIn}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 ${
                            isCheckingIn
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
                                : "bg-primary-base hover:bg-primary-600 active:scale-95 text-white"
                        }`}
                    >
                        <LuLogIn size={17} />
                        {isCheckingIn ? t("Checking In…") : t("Check In")}
                    </button>
                )}

                {/* Check-Out — visible after check-in, hidden immediately on success */}
                {hasCheckedIn && !checkOutDone && (
                    <button
                        id="btn-checkout"
                        onClick={onClickCheckOut}
                        disabled={isCheckingOut}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 ${
                            isCheckingOut
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
                                : "bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 border border-red-200 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-400 dark:border-red-800"
                        }`}
                    >
                        <LuLogOut size={17} />
                        {isCheckingOut ? t("Checking Out…") : t("Check Out")}
                    </button>
                )}
            </div>
        </div>
    );
};

AttendanceActionCard.propTypes = {
    hasCheckedIn: PropTypes.bool.isRequired,
    checkOutDone: PropTypes.bool.isRequired,
    isCheckingIn: PropTypes.bool.isRequired,
    isCheckingOut: PropTypes.bool.isRequired,
    onClickCheckIn: PropTypes.func.isRequired,
    onClickCheckOut: PropTypes.func.isRequired,
};

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function EmployeeAttendancePage() {
    const { t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();

    const { data: attendances = [], isLoading } = useGetMyAttendancesQuery();
    const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();
    const [checkOut, { isLoading: isCheckingOut }] = useCheckOutMutation();

    /* ── Derived State ── */
    // Employee is considered "checked in" when today has a record with start_time but no end_time
    const hasCheckedIn = useMemo(() => {
        if (!attendances || attendances.length === 0) return false;
        const todayLocal = format(new Date(), "yyyy-MM-dd");
        return attendances.some((a) => a.date === todayLocal && a.start_time && !a.end_time);
    }, [attendances]);

    /* ── Local check-in success flag ── */
    // Flips true immediately when the checkIn API succeeds so the button hides
    // right away — before the RTK Query cache refetch has settled.
    const [checkInDone, setCheckInDone] = useState(false);
    const isCheckedIn = hasCheckedIn || checkInDone;

    /* ── Local check-out success flag ── */
    // Same pattern: hides the checkout button immediately on success.
    const [checkOutDone, setCheckOutDone] = useState(false);

    /* ── Alert / Dialog state ── */
    // Approval alerts
    const [checkInApproval, setCheckInApproval] = useState(false);
    const [checkOutApproval, setCheckOutApproval] = useState(false);

    // API response alert
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const closeApiResponse = () => setApiResponse((prev) => ({ ...prev, isOpen: false }));

    /* ── Handlers ── */
    // Step 1 — open confirmation dialog
    const handleClickCheckIn = () => setCheckInApproval(true);
    const handleClickCheckOut = () => setCheckOutApproval(true);

    // Step 2 — execute after confirmation
    const confirmCheckIn = async () => {
        // Build start_time as HH:MM (zero-padded) from the current moment
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const start_time = `${hh}:${mm}`; // e.g. "09:05", "17:30"

        showProcessing(t("Recording Check-In…"));
        try {
            await checkIn({ start_time }).unwrap();
            // Mark as done immediately — hides the check-in button
            setCheckInDone(true);
            // Ensure the check-out button is shown (resetting any past flags)
            setCheckOutDone(false);
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("You have successfully checked in!"),
            });
        } catch (err) {
            // On failure keep (or restore) the button as enabled
            setCheckInDone(false);
            setApiResponse({
                isOpen: true,
                status: "error",
                message: err?.data?.message || err?.message || t("Failed to check in. Please try again."),
            });
        } finally {
            hideProcessing();
        }
    };

    const confirmCheckOut = async () => {
        // Build end_time as HH:MM (zero-padded) from the current moment
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const end_time = `${hh}:${mm}`; // e.g. "09:05", "17:30"

        showProcessing(t("Recording Check-Out…"));
        try {
            await checkOut({ end_time }).unwrap();
            // Hide checkout button immediately before query refetch settles
            setCheckOutDone(true);
            // Allow check-in to reappear after checking out
            setCheckInDone(false);
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("You have successfully checked out!"),
            });
        } catch (err) {
            // On failure restore the button
            setCheckOutDone(false);
            setApiResponse({
                isOpen: true,
                status: "error",
                message: err?.data?.message || err?.message || t("Failed to check out. Please try again."),
            });
        } finally {
            hideProcessing();
        }
    };

    /* ── Table definition ── */
    const headers = [
        { label: t("Date"), width: "150px" },
        { label: t("Check In"), width: "120px" },
        { label: t("Check Out"), width: "120px" },
    ];

    const rows = useMemo(() => {
        return attendances.map((record) => [
            <span key={`date-${record._id}`} className="text-sm text-cell-primary">
                {record.date
                    ? format(parse(record.date, "yyyy-MM-dd", new Date()), "dd MMM, yyyy")
                    : "N/A"}
            </span>,

            <span key={`start-${record._id}`} className="text-sm text-cell-primary font-medium">
                {record.start_time || "—"}
            </span>,

            <span key={`end-${record._id}`} className="text-sm text-cell-primary font-medium">
                {record.end_time ? (
                    record.end_time
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-[#C2540A] text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2540A] animate-pulse" />
                        {t("In Progress")}
                    </span>
                )}
            </span>,
        ]);
    }, [attendances, t]);

    /* ── Render ── */
    return (
        <Page title={t("My Attendance")}>
            <div className="flex flex-col gap-6">

                {/* ── Check-In / Check-Out card ── */}
                <AttendanceActionCard
                    hasCheckedIn={isCheckedIn}
                    checkOutDone={checkOutDone}
                    isCheckingIn={isCheckingIn}
                    isCheckingOut={isCheckingOut}
                    onClickCheckIn={handleClickCheckIn}
                    onClickCheckOut={handleClickCheckOut}
                />

                {/* ── Attendance history table ── */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64 bg-surface rounded-2xl border border-status-border">
                        <div className="text-primary-base font-bold text-lg flex items-center gap-3 animate-pulse">
                            <div className="w-3 h-3 bg-primary-base rounded-full animate-bounce" />
                            {t("Loading attendance records…")}
                        </div>
                    </div>
                ) : (
                    <Table
                        title={t("Attendance History")}
                        headers={headers}
                        rows={rows}
                        isCheckInput={false}
                        isActions={false}
                        isTitle={true}
                        showDatePicker={true}
                        showStatusFilter={true}
                        classContainer="w-full"
                    />
                )}
            </div>

            {/* ── Check-In Approval Alert ── */}
            <ApprovalAlert
                isOpen={checkInApproval}
                onClose={() => setCheckInApproval(false)}
                onConfirm={confirmCheckIn}
                title={t("Confirm Check In")}
                message={t("Are you sure you want to check in now? Your check-in time will be recorded immediately.")}
                confirmBtnText={t("Check In")}
                cancelBtnText={t("Cancel")}
                type="info"
            />

            {/* ── Check-Out Approval Alert ── */}
            <ApprovalAlert
                isOpen={checkOutApproval}
                onClose={() => setCheckOutApproval(false)}
                onConfirm={confirmCheckOut}
                title={t("Confirm Check Out")}
                message={t("Are you sure you want to check out now? Your check-out time will be recorded immediately.")}
                confirmBtnText={t("Check Out")}
                cancelBtnText={t("Cancel")}
                type="warning"
            />

            {/* ── API Response Alert ── */}
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={closeApiResponse}
                successTitle={t("Success")}
                errorTitle={t("Error")}
            />
        </Page>
    );
}
