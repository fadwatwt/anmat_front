"use client";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import { statusCell } from "@/components/StatusCell";
import { RiFlashlightFill } from "@remixicon/react";

function Subscriptions() {
    const { t } = useTranslation();

    const headers = [
        { label: t("Catalog Company"), width: "30%" },
        { label: t("Renewal Date"), width: "20%" },
        { label: t("Users Subscribed"), width: "20%" },
        { label: t("Status"), width: "20%" },
        { label: "", width: "10%" },
    ];

    const data = [
        { id: 1, name: "Basic plan", renewalDate: "May 24, 2025", users: 355, status: "Active" },
        { id: 2, name: "Basic plan", renewalDate: "May 24, 2025", users: 355, status: "In-active" },
        { id: 3, name: "Basic plan", renewalDate: "May 24, 2025", users: 355, status: "Active" },
        { id: 4, name: "Basic plan", renewalDate: "May 24, 2025", users: 355, status: "In-active" },
        { id: 5, name: "Basic plan", renewalDate: "May 24, 2025", users: 355, status: "Active" },
    ];

    const rows = data.map((item) => [
        <div key={item.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <RiFlashlightFill size={18} />
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-medium">{t(item.name)}</span>
        </div>,
        <span key={`date-${item.id}`} className="text-gray-500 dark:text-gray-400 text-sm">{item.renewalDate}</span>,
        <div key={`users-${item.id}`} className="w-full">
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-300">
                {item.users}
            </span>
        </div>,
        statusCell(item.status, item.id),
        // Actions column handled by Table's isActions logic or passed explicitly?
        // AttendanceTable uses isActions={true} and handelEdit/Delete.
        // But if I want just 3 dots without specific edit/delete logic hooked up yet, I might leave it to Table.
        // However, Table's generic actions might be edit/delete buttons.
        // The design shows 3 vertical dots.
        // I will let Table handle it if isActions={true} provides the generic dropdown, 
        // otherwise I might need to pass a custom component.
        // AttendanceTable passes `handelEdit` and `handelDelete`.
        // I'll leave empty functions for now.
    ]);

    return (
        <div className="w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 px-2">{t("Subscriptions")}</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
                <Table
                    headers={headers}
                    rows={rows}
                    isTitle={false}
                    isCheckInput={false}
                    isActions={true}
                    handelEdit={() => { }}
                    handelDelete={() => { }}
                // The design implies a simple list, maybe not full table features like pagination/search are needed,
                // but reusing Table is good.
                // Table normally has padding/bg. I wrapped it.
                />
            </div>
        </div>
    );
}

export default Subscriptions;
