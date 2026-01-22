"use client"

import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { useTranslation } from "react-i18next";
import { useGetAdminPermissionsQuery } from "@/redux/roles/adminRolesAPI";

function AdminPermissionsPage() {
    const { t } = useTranslation();
    const { data: permissionsResponse, isLoading } = useGetAdminPermissionsQuery();
    const permissionsData = permissionsResponse?.data || [];

    const headers = [
        { label: "Permission Name", width: "400px" },
        { label: "Details", width: "400px" },
    ];

    const rows = permissionsData.map(permission => [
        // Name Cell
        <div key={`${permission._id}_name`} className="flex items-center justify-start gap-2">
            <span className="text-md font-medium text-gray-900 dark:text-gray-50">
                {permission.name}
            </span>
        </div>,

        // Details Cell
        <div key={`${permission._id}_details`} className="text-sm text-gray-500 dark:text-gray-400">
            {permission.details}
        </div>
    ]);

    return (
        <Page title="System Admin Permissions" isBtn={false}>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <Table
                    classContainer={"rounded-2xl px-8"}
                    title="All System Admin Permissions"
                    headers={headers}
                    isActions={false}
                    rows={rows}
                    isFilter={true}
                />
            )}
        </Page>
    );
}

export default AdminPermissionsPage;
