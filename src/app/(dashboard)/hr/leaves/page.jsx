"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Page from "@/components/Page.jsx";
import LeavesTab from "@/app/(dashboard)/hr/employees/tabs/LeavesTab";

import { usePermission } from "@/Hooks/usePermission";
import { selectUserType } from "@/redux/auth/authSlice";

function LeavesAdminPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const userType = useSelector(selectUserType);
    const canTrackAll = usePermission("leaves.track_all");
    const canTrackDept = usePermission("leaves.track_department");

    const isAuthorized = canTrackAll || canTrackDept;
    const scope = canTrackAll ? "track_all" : "track_department";
    const isEmployee = userType === "Employee";

    useEffect(() => {
        if (userType && !isAuthorized) {
            router.replace(isEmployee ? "/leaves" : "/dashboard");
        }
    }, [userType, isAuthorized, isEmployee, router]);

    if (!isAuthorized) return null;

    return (
        <Page title={t("HR — Leaves Management")}>
            <div className="flex flex-col gap-4">
                <LeavesTab />
            </div>
        </Page>
    );
}

export default LeavesAdminPage;
