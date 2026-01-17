"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";

const DashboardPage = () => {
  const authUserType = useSelector(selectUserType);

  // Dynamically import based on authUserType with loading fallback
  const DynamicComponent = dynamic(() => {
    switch (authUserType) {
      case "Admin":
        return import("@/app/(dashboard)/dashboard/_components/AdminDashboard");
      case "Subscriber":
        return import("@/app/(dashboard)/dashboard/_components/CompanyManagerDashboard");
      case "Employee":
        return import("@/app/(dashboard)/dashboard/_components/EmployeeDashboard");
      default:
        return Promise.resolve({ default: () => <div>Unknown User Type</div> });
    }
  }, {
    loading: () => <div className="text-center py-4">Loading dashboard...</div>,
    ssr: false, // Disable SSR to avoid hydration mismatches
  });

  return (
    <Suspense fallback={<div className="text-center py-4">Loading dashboard...</div>}>
      <DynamicComponent />
    </Suspense>
  );
};

export default DashboardPage;