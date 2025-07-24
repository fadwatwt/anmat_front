"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const SubscriptionsPage = () => {
  const authUserType = "Company-Manager"; // Should come from context/state in real app

  const DynamicComponent = dynamic(() => {
    switch (authUserType) {
      case "Admin":
        return import("@/app/(dashboard)/subscriptions/_components/AdminCompaniesSubscriptions");
      case "Company-Manager":
        return import("@/app/(dashboard)/subscriptions/_components/CompanySubscriptions");
      default:
        return Promise.resolve({ default: () => <div>Unknown User Type</div> });
    }
  }, {
    loading: () => <div className="text-center py-4">Loading subscriptions...</div>,
    ssr: false,
  });

  return (
    <Suspense fallback={<div className="text-center py-4">Loading subscriptions...</div>}>
      <DynamicComponent />
    </Suspense>
  );
};

export default SubscriptionsPage;