"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";

const SubscriptionsPage = () => {
  const authUserType = useSelector(selectUserType);

  const DynamicComponent = dynamic(() => {
    switch (authUserType) {
      // case "Admin":
      //   return import("@/app/(dashboard)/subscriptions/_components/AdminCompaniesSubscriptions");
      case "Subscriber":
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