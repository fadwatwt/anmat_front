"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Page from "@/components/Page.jsx";

import { usePermission } from "@/Hooks/usePermission";
import { selectPermissionsLoaded, selectUserType } from "@/redux/auth/authSlice";
import LeavePoliciesPanel from "./LeavePoliciesPanel";

function LeavesAdminPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const userType = useSelector(selectUserType);
    const permissionsLoaded = useSelector(selectPermissionsLoaded);
    const canTrackAll = usePermission("leaves.track_all");
    const canTrackDept = usePermission("leaves.track_department");
    const canManagePolicies = usePermission("leave_policies.manage_settings");

    const isEmployee = userType === "Employee";

    useEffect(() => {
        if (userType && permissionsLoaded && !canManagePolicies) {
            router.replace(canTrackAll || canTrackDept ? "/hr/short-leaves" : isEmployee ? "/leaves" : "/dashboard");
        }
    }, [userType, permissionsLoaded, canManagePolicies, canTrackAll, canTrackDept, isEmployee, router]);

    if (!canManagePolicies) return null;

    return (
        <Page title={t("Leave Policies")}>
            <LeavePoliciesPanel />
        </Page>
    );
}

export default LeavesAdminPage;
