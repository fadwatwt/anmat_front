"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const ProfilePage = () => {
  const authUserType = "Company-Manager"; // Should come from context/state in real app

  const DynamicComponent = dynamic(() => {
    switch (authUserType) {
      case "Admin":
        return Promise.resolve({ default: () => <div className="text-xl text-gray-500">Admin Profile Page not-developed yet.</div> });
      case "Company-Manager":
        return import("@/app/(dashboard)/profile/_components/CompanyManagerProfile");
      case "Employee":
        return import("@/app/(dashboard)/profile/_components/EmployeeProfile");
      default:
        return Promise.resolve({ default: () => <div>Unknown User Type</div> });
    }
  }, {
    loading: () => <div className="text-center py-4">Loading profile...</div>,
    ssr: false,
  });

  return (
    <Suspense fallback={<div className="text-center py-4">Loading profile...</div>}>
      <DynamicComponent />
    </Suspense>
  );
};

export default ProfilePage;