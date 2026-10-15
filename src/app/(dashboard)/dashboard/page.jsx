"use client";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectUserType } from "@/redux/auth/authSlice";
import DashboardSkeleton from "./_components/DashboardSkeleton";

const DashboardLoading = () => <DashboardSkeleton />;

// Keep the component types stable across Redux and query updates. Creating a
// dynamic component during render remounts the dashboard on every update.
const AdminDashboard = dynamic(
  () => import("@/app/(dashboard)/dashboard/_components/AdminDashboard"),
  { loading: DashboardLoading, ssr: false },
);
const SubscriberDashboard = dynamic(
  () => import("@/app/(dashboard)/dashboard/_components/CompanyManagerDashboard"),
  { loading: DashboardLoading, ssr: false },
);
const EmployeeDashboard = dynamic(
  () => import("@/app/(dashboard)/dashboard/_components/EmployeeDashboard"),
  { loading: DashboardLoading, ssr: false },
);

const DashboardPage = () => {
  const authUserType = useSelector(selectUserType);
  const { t } = useTranslation();

  if (!authUserType) return <DashboardSkeleton />;

  return (
    authUserType === "Admin" ? <AdminDashboard /> :
    authUserType === "Subscriber" ? <SubscriberDashboard /> :
    authUserType === "Employee" ? <EmployeeDashboard /> :
    <div role="alert" className="m-4 rounded-2xl border border-status-border bg-surface p-8 text-center text-cell-secondary">
      {t("Unknown User Type")}
    </div>
  );
};

export default DashboardPage;
