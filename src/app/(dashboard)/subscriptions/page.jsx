"use client";

import AdminCompaniesSubscriptions from "@/app/(dashboard)/subscriptions/_components/AdminCompaniesSubscriptions";
import CompanySubscriptions from "@/app/(dashboard)/subscriptions/_components/CompanySubscriptions";

const SubscriptionsPage = () => {
    // Try to change user type to see the effect of dynamic reload elements
    // allowed user types: ['Admin', 'Company-Manager']
    const authUserType = 'Admin';

    const analyticsMap = {
        Admin: <AdminCompaniesSubscriptions />,
        'Company-Manager': <CompanySubscriptions />,
    };

    return (
        <>
            {analyticsMap[authUserType]}
        </>
    );
};

export default SubscriptionsPage;
