"use client";

import CompanyManagerAnalytics from "@/app/(dashboard)/analytics/_components/CompanyManagerAnalytics";
import AdminAnalytics from "@/app/(dashboard)/analytics/_components/AdminAnalytics";
import EmployeeAnalytics from "@/app/(dashboard)/analytics/_components/EmployeeAnalytics";


const AnalyticsPage = () => {
    // Try to change user type to see the effect of dynamic reload elements
    // allowed user types: ['Admin', 'Company-Manager', 'Employee']
    const authUserType = 'Employee';

    const analyticsMap = {
        Admin: <AdminAnalytics />,
        'Company-Manager': <CompanyManagerAnalytics />,
        Employee: <EmployeeAnalytics />
    };

    return (
        <>
            {analyticsMap[authUserType]}
        </>
    );
};

export default AnalyticsPage;
