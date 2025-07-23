"use client";

import dynamic from 'next/dynamic';

const DashboardPage = () => {

    const authUserType = 'Company-Manager';

    const DynamicComponent = dynamic(() => {
        switch (authUserType) {
            case 'Company-Manager':
                return import('@/app/(dashboard)/dashboard/_components/CompanyManagerDashboard');
            case 'Employee':
                return import('@/app/(dashboard)/dashboard/_components/EmployeeDashboard');
            default:
                return Promise.resolve({ default: () => <div>Unknown User Type</div> });
        }
    });

    return (
        <>
            <DynamicComponent />
        </>
    );
};

export default DashboardPage;