"use client";

import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import AttendanceTab from "@/app/(dashboard)/hr/employees/tabs/AttendanceTab";

import { usePermission } from "@/Hooks/usePermission";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
            </div>
        </Page>
    );
}

export default AttendancesAdminPage;
