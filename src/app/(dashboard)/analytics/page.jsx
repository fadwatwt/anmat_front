"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { selectUserType } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import PermissionGuard from "@/components/PermissionGuard";
import AnalyticsPageSkeleton from "@/app/(dashboard)/analytics/_components/AnalyticsPageSkeleton";

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const authUserType = useSelector(selectUserType);

  // Dynamically import components with loading fallback
  const DynamicComponent = dynamic(() => {
    switch (authUserType) {
      case "Admin":
        return import("@/app/(dashboard)/analytics/_components/AdminAnalytics");
      case "Subscriber":
        return import("@/app/(dashboard)/analytics/_components/CompanyManagerAnalytics");
      case "Employee":
        return import("@/app/(dashboard)/analytics/_components/EmployeeAnalytics");
      default:
        return Promise.resolve({ default: () => <div>{t("Unknown User Type")}</div> });
    }
  }, {
    loading: () => <AnalyticsPageSkeleton />,
    ssr: false, // Disable SSR to avoid hydration mismatches
  });

  return (
    <PermissionGuard anyOf={["admin.analytics.view", "analytics.view"]}>
      <Suspense fallback={<AnalyticsPageSkeleton />}>
        <DynamicComponent />
      </Suspense>
    </PermissionGuard>
  );
};

export default AnalyticsPage;
