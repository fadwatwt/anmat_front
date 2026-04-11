"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { selectUserType } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";

const AnalyticsPage = () => {
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
        return Promise.resolve({ default: () => <div>Unknown User Type</div> });
    }
  }, {
    loading: () => <div className="text-center py-4">Loading analytics...</div>,
    ssr: false, // Disable SSR to avoid hydration mismatches
  });

  return (
    <Suspense fallback={<div className="text-center py-4">Loading analytics...</div>}>
      <DynamicComponent />
    </Suspense>
  );
};

export default AnalyticsPage;