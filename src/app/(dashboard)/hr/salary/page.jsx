"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Page from "@/components/Page.jsx";
import SalaryTab from "@/app/(dashboard)/hr/employees/tabs/SalaryTab";

import { usePermission } from "@/Hooks/usePermission";
import { selectUserType } from "@/redux/auth/authSlice";

function SalaryAdminPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const userType = useSelector(selectUserType);
    const canTrackAll = usePermission("salary_transactions.track_all");
    const canTrackDept = usePermission("salary_transactions.track_department");

    const isAuthorized = canTrackAll || canTrackDept;
    const scope = canTrackAll ? "track_all" : "track_department";
    const isEmployee = userType === "Employee";

    useEffect(() => {
        if (userType && !isAuthorized) {
            router.replace(isEmployee ? "/salary" : "/dashboard");
        }
    }, [userType, isAuthorized, isEmployee, router]);

    if (!isAuthorized) return null;

    return (
        <Page title={t("HR — Salary Management")}>
            <div className="flex flex-col gap-4">
                <SalaryTab />
            </div>
        </Page>
    );
}

export default SalaryAdminPage;
