"use client";
import { ImSpinner2 } from "react-icons/im";

import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectUserType } from "@/redux/auth/authSlice";

const DashboardLoading = () => (
  <div className="flex items-center justify-center w-full p-4">
    <ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} />
  </div>
);

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

  return (
    authUserType === "Admin" ? <AdminDashboard /> :
    authUserType === "Subscriber" ? <SubscriberDashboard /> :
    authUserType === "Employee" ? <EmployeeDashboard /> :
    <div>{t("Unknown User Type")}</div>
  );
};

export default DashboardPage;
