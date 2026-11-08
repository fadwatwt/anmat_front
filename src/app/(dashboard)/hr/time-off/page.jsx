"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePermission } from "@/Hooks/usePermission";
import HolidaysPage from "../holidays/page";
import ShortLeavesPage from "../short-leaves/page";
import LeaveBalancesPage from "../leave-balances/page";

export default function TimeOffPage() {
    const { t } = useTranslation();
    const canSeeHolidays = usePermission("holidays.list");
    const canTrackAllLeaves = usePermission("leaves.track_all");
    const canTrackDepartmentLeaves = usePermission("leaves.track_department");
    const canSeeShortLeaves = canTrackAllLeaves || canTrackDepartmentLeaves;
    const canManageBalances = usePermission("leave_policies.manage_settings");
    const tabs = [
        canSeeHolidays && { id: "holidays", label: t("Public and group holidays"), content: <HolidaysPage /> },
        canSeeShortLeaves && { id: "short", label: t("Short Leaves"), content: <ShortLeavesPage /> },
        canManageBalances && { id: "balances", label: t("Employee leave balances"), content: <LeaveBalancesPage /> },
    ].filter(Boolean);
    const [selected, setSelected] = useState(null);
    const active = tabs.find((tab) => tab.id === selected) || tabs[0];

    if (!active) return <p className="p-5 text-cell-secondary">{t("You do not have permission to view this page.")}</p>;
    return <div className="space-y-4">
        <nav aria-label={t("Holidays")} className="flex flex-wrap gap-2 border-b border-status-border pb-3">
            {tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setSelected(tab.id)} aria-current={active.id === tab.id ? "page" : undefined} className={`rounded-lg px-4 py-2 text-sm ${active.id === tab.id ? "bg-primary-500 text-white" : "bg-surface text-cell-secondary hover:text-cell-primary"}`}>{tab.label}</button>)}
        </nav>
        {active.content}
    </div>;
}
