"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Page from "@/components/Page.jsx";
import LeavesTab from "@/app/(dashboard)/hr/employees/tabs/LeavesTab";
import { usePermission } from "@/Hooks/usePermission";
import { selectPermissionsLoaded, selectUserType } from "@/redux/auth/authSlice";

export default function ShortLeavesPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const userType = useSelector(selectUserType);
    const permissionsLoaded = useSelector(selectPermissionsLoaded);
    const canTrackAll = usePermission("leaves.track_all");
    const canTrackDepartment = usePermission("leaves.track_department");
    const canView = canTrackAll || canTrackDepartment;

    useEffect(() => {
        if (userType && permissionsLoaded && !canView) router.replace(userType === "Employee" ? "/leaves" : "/dashboard");
    }, [userType, permissionsLoaded, canView, router]);

    if (!canView) return null;
    return <Page title={t("Short Leaves")}><LeavesTab /></Page>;
}
