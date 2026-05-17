"use client";
import { ImSpinner2 } from "react-icons/im";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";

const SubscriptionsPage = () => {
  const authUserType = useSelector(selectUserType);

  const DynamicComponent = dynamic(() => {
    switch (authUserType) {
      case "Admin":
        return import("@/app/(dashboard)/subscriptions/_components/AdminCompaniesSubscriptions");
      case "Subscriber":
        return import("@/app/(dashboard)/subscriptions/_components/CompanySubscriptions");
      default:
        return Promise.resolve({ default: () => <div>Unknown User Type</div> });
    }
  }, {
    loading: () => <div className="text-center py-4"> <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div> </div>,
    ssr: false,
  });

  return (
    <Suspense fallback={<div className="text-center py-4"> <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div> </div>}>
      <DynamicComponent />
    </Suspense>
  );
};

export default SubscriptionsPage;