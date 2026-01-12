"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import useAuthStore from '@/store/authStore.js';

const ProfilePage = () => {
  const { authUserType } = useAuthStore();

  const DynamicComponent = dynamic(() => {
    switch (authUserType) {
      case "Admin":
        return import("@/app/(dashboard)/profile/_components/AdminProfile");
      case "Subscriber":
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