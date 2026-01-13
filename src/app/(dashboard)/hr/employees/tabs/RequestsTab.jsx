"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table.jsx";
import { GoDotFill } from "react-icons/go";
import ViewRequestModal from "../modals/ViewRequestModal.jsx";
import { statusCell as StatusCell } from "@/components/StatusCell";

function RequestsTab() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("Day Off"); // "Day Off", "Delay", "Financial"
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Mock Data
    const requestsData = [
        {
            id: 1,
            name: "Fatima Ahmed Mohamed",
            department: "Digital Advertising Sector Dep",
            date: "9 Nov 2024",
            dayOffDate: "14 Nov 2024",
            status: "pending",
            type: "Day Off",
            reason: "Sick Leave",
            description: "Lorem ipsum dolor sit amet...",
            amount: null
        },
        {
            id: 2,
            name: "Sophia Williams",
            department: "Publishing Dep",
            date: "9 Nov 2024",
            dayOffDate: "14 Nov 2024",
            status: "approved",
            type: "Day Off",
            reason: "Urgent",
            description: "Lorem ipsum dolor sit amet...",
            amount: null
        },
        {
            id: 3,
            name: "James Brown",
            department: "Editorial Software Dep",
            date: "9 Nov 2024",
            amount: "$1500",
            status: "pending",
            type: "Financial",
            reason: "Advance",
            description: "Lorem ipsum dolor sit amet...",
            dayOffDate: null
        },
        {
            id: 4,
            name: "Matthew Johnson",
            department: "Publishing Solutions Dep",
            date: "11 Nov 2024",
            time: "10:30 AM",
            status: "pending",
            type: "Delay",
            reason: "Traffic",
            description: "Late due to heavy traffic",
            dayOffDate: null,
            amount: null
        }
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const currentData = requestsData.filter(req => req.type === activeTab);

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "text-green-500 bg-green-100 dark:bg-green-900";
            case "rejected":
                return "text-red-500 bg-red-100 dark:bg-red-900";
            case "pending":
                return "text-orange-500 bg-orange-100 dark:bg-orange-900";
            default:
                return "text-gray-500 bg-gray-100 dark:bg-gray-800";
        }
    };

    const getStatusBadge = (status) => (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs w-fit ${getStatusColor(status)}`}>
            <GoDotFill />
            <span className="capitalize">{status}</span>
        </div>
    );

    const handleView = (request) => {
        setSelectedRequest(request);
        setIsViewModalOpen(true);
    };

    const handleApprove = (id) => {
        console.log("Approve", id);
    };

    const handleReject = (id) => {
        console.log("Reject", id);
    };

    // Define headers based on active tab
    const getHeaders = () => {
        const commonHeaders = [
            { label: "Employee Name", width: "30%" },
            { label: "Request Date", width: "25%" },
        ];

        if (activeTab === "Day Off") {
            return [...commonHeaders, { label: "Day Off Date", width: "15%" }, { label: "Status", width: "10%" }, { label: "", width: "15%" }, { label: "", width: "5%" }];
        } else if (activeTab === "Financial") {
            return [...commonHeaders, { label: "Value", width: "15%" }, { label: "Status", width: "10%" }, { label: "", width: "15%" }, { label: "", width: "5%" }];
        } else {
            return [...commonHeaders, { label: "Time", width: "15%" }, { label: "Status", width: "10%" }, { label: "", width: "15%" }, { label: "", width: "5%" }];
        }


    };

    // Map rows
    const rows = currentData.map((req) => {
        const commonCells = [
            <div key={req.id + "_name"} className="flex items-center gap-3">
                <img src={`https://ui-avatars.com/api/?name=${req.name}`} className="w-8 h-8 rounded-full" alt="" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium dark:text-gray-200">{req.name}</span>
                    <span className="text-xs text-gray-500">{req.department}</span>
                </div>
            </div>,
            <div key={req.id + "_date"} className="text-gray-600 dark:text-gray-400">{req.date}</div>
        ];

        let specificCell;
        if (activeTab === "Day Off") {
            specificCell = <div key={req.id + "_dayoff"} className="text-gray-600 dark:text-gray-400">{req.dayOffDate}</div>;
        } else if (activeTab === "Financial") {
            specificCell = <div key={req.id + "_amount"} className="text-gray-600 dark:text-gray-400">{req.amount}</div>;
        } else { // Delay
            specificCell = <div key={req.id + "_time"} className="text-gray-600 dark:text-gray-400">{req.time}</div>;
        }

        const actions = (
            <div className="flex items-center w-full gap-2">
                <button onClick={() => handleApprove(req.id)} className="text-xs px-2 py-1 text-green-600 bg-green-50 rounded hover:bg-green-100">Approve</button>
                <button onClick={() => handleReject(req.id)} className="text-xs px-2 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100">Reject</button>
            </div>
        );

        return [...commonCells, specificCell, StatusCell(req.status), <div key={req.id + "_actions"} className="flex gap-2">{actions}</div>];
    });

    const customActions = (rowIndex) => {
        // rowIndex is relative to the current page/rows displayed.
        // But here we need the actual data object.
        // Table component passes rowIndex.
        // Since we map rows directly from currentData, we can use rowIndex if pagination matches, but Table handles pagination.
        // Actually Table `customActions` prop might be executed for each row.
        // Let's check Table implementation. It renders `customActions(actualRowIndex)` or `customActions`.
        // The `rows` array I construct has the actions column explicitly.
        // But the design shows a dropdown or separate buttons?
        // The design shows "Approve" "Reject" buttons directly in the row, AND a vertical dots menu maybe?
        // Wait, Image 3 shows "Approve" "Reject" buttons in a column.
        // AND a vertical 3-dots menu which opens "Edit", "Delete" (or "View").
        // Actually, looking closely at Image 3, the "Requests" table has columns: Employee Name, Request Date, [Specific Col], Status, [Approve/Reject Buttons], [Vertical Dots].

        // So I should add the Approve/Reject buttons as a column in the row (which I did),
        // and let Table handle the vertical dots for "View/Edit".

        const request = currentData[rowIndex]; // This might be wrong if pagination is applied inside Table.
        // However, Table component receives all `rows`. It slices them.
        // But when `customActions` is called, it passes `actualRowIndex`.
        // So `currentData[actualRowIndex]` should be correct.
        return (
            <div className="flex flex-col gap-1 w-full">
                <button onClick={() => handleView(request)} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-sm rounded-md">
                    View
                </button>
            </div>
        );
    };

    const headerActions = (
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {["Day Off", "Delay", "Financial"].map(tab => (
                <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`px-4 py-1 text-sm rounded-md transition-colors ${activeTab === tab ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
                >
                    {t(tab)}
                </button>
            ))}
        </div>
    );

    return (
        <>
            <Table
                title="Requests"
                headers={getHeaders()}
                rows={rows}
                isActions={false}
                customActions={customActions}
                headerActions={headerActions}
                isCheckInput={true}
            />

            <ViewRequestModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                request={selectedRequest}
            />
        </>
    );
}

export default RequestsTab;
