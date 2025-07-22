"use client";

import CompanyManagerProfile from "@/app/(dashboard)/profile/_components/CompanyManagerProfile";
import EmployeeProfile from "@/app/(dashboard)/profile/_components/EmployeeProfile";


const ProfilePage = () => {
    // Try to change user type to see the effect of dynamic reload elements
    // allowed user types: ['Admin', 'Company-Manager', 'Employee']
    const authUserType = 'Admin';

    const analyticsMap = {
        Admin: <div className="text-xl text-gray-500">Admin Profile Page not-developed yet.</div>,
        'Company-Manager': <CompanyManagerProfile />,
        Employee: <EmployeeProfile />
    };

    return (
        <>
            {analyticsMap[authUserType]}
        </>
    );
};

export default ProfilePage;
