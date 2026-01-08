import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";

function ChatPermissionsTab() {
    const { t } = useTranslation();

    const headers = [
        { label: "Permission Title", width: "60%" },
        { label: "Description", width: "40%" },
    ];

    const rows = Array.from({ length: 9 }).map((_, index) => [
        <div key={`title-${index}`} className="text-gray-900 dark:text-gray-200 font-medium">
            Lorem Ipsum
        </div>,
        <div key={`desc-${index}`} className="text-gray-500 dark:text-gray-400">
            Lorem Ipsum dummy text, Lorem Ipsum dummy text...
        </div>
    ]);

    return (
        <Table
            title="Chat Permissions"
            headers={headers}
            rows={rows}
            isActions={false}
            isCheckInput={false}
            showStatusFilter={false}
            showListOfDepartments={false}
        />
    );
}

export default ChatPermissionsTab;
