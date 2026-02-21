"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { statusCell as StatusCell } from "@/components/StatusCell";
import {
    useGetEmployeeAuthRequestsQuery,
    useCancelEmployeeRequestMutation
} from "@/redux/employees/employeeAuthRequestsApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { format } from "date-fns";
import CreateRequestModal from "./_components/CreateRequestModal";
import { Add } from "iconsax-react";

function EmployeeRequestsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("DAY_OFF"); // "DAY_OFF", "SALARY_ADVANCE", "WORK_DELAY"
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // API Hooks
    const { data: requestsData, isLoading } = useGetEmployeeAuthRequestsQuery();
    const [cancelRequest] = useCancelEmployeeRequestMutation();

    // Alert states
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        type: "approval", // "approval" or "response"
        status: "",
        message: "",
        title: "",
        onConfirm: null
    });

    const currentData = requestsData?.filter(req => req.type === activeTab) || [];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleCancel = (index) => {
        const request = currentData[index];
        setAlertConfig({
            isOpen: true,
            type: "approval",
            title: t("Cancel Request"),
            message: t("Are you sure you want to cancel this request?"),
            onConfirm: async () => {
                try {
                    await cancelRequest(request._id).unwrap();
                    setAlertConfig({
                        isOpen: true,
                        type: "response",
                        status: "success",
                        message: t("Request cancelled successfully")
                    });
                } catch (error) {
                    setAlertConfig({
                        isOpen: true,
                        type: "response",
                        status: "error",
                        message: error?.data?.message || t("Failed to cancel request")
                    });
                }
            }
        });
    };

    const getHeaders = () => {
        const commonHeaders = [
            { label: t("Request Date"), width: "15%" },
        ];

        if (activeTab === "DAY_OFF") {
            return [...commonHeaders, { label: t("Vacation Date"), width: "15%" }, { label: t("Reason"), width: "35%" }, { label: t("Status"), width: "15%" }, { label: "", width: "5%" }];
        } else if (activeTab === "SALARY_ADVANCE") {
            return [...commonHeaders, { label: t("Advance By"), width: "15%" }, { label: t("Old Salary"), width: "15%" }, { label: t("Reason"), width: "30%" }, { label: t("Status"), width: "15%" }, { label: "", width: "5%" }];
        } else { // WORK_DELAY
            return [...commonHeaders, { label: t("Work Due At"), width: "20%" }, { label: t("Reason"), width: "35%" }, { label: t("Status"), width: "15%" }, { label: "", width: "5%" }];
        }
    };

    const rows = currentData.map((req) => {
        const commonCells = [
            <div key={req._id + "_created_at"} className="text-gray-600 dark:text-gray-400">
                {req.created_at ? format(new Date(req.created_at), "dd MMM yyyy") : "N/A"}
            </div>
        ];

        let specificCells = [];
        if (activeTab === "DAY_OFF") {
            specificCells = [
                <div key={req._id + "_vacation"} className="text-gray-600 dark:text-gray-400">
                    {req.vacation_date ? format(new Date(req.vacation_date), "dd MMM yyyy") : "N/A"}
                </div>,
                <div key={req._id + "_reason"} className="text-gray-600 dark:text-gray-400 truncate max-w-[300px]">{req.reason || "N/A"}</div>
            ];
        } else if (activeTab === "SALARY_ADVANCE") {
            specificCells = [
                <div key={req._id + "_advance"} className="text-gray-600 dark:text-gray-400">{req.advance_salary_by || "N/A"}</div>,
                <div key={req._id + "_old_salary"} className="text-gray-600 dark:text-gray-400">{req.old_salary_amount || "N/A"}</div>,
                <div key={req._id + "_reason"} className="text-gray-600 dark:text-gray-400 truncate max-w-[250px]">{req.reason || "N/A"}</div>
            ];
        } else { // WORK_DELAY
            specificCells = [
                <div key={req._id + "_due"} className="text-gray-600 dark:text-gray-400">
                    {req.work_due_at ? format(new Date(req.work_due_at), "dd MMM yyyy HH:mm") : "N/A"}
                </div>,
                <div key={req._id + "_reason"} className="text-gray-600 dark:text-gray-400 truncate max-w-[300px]">{req.reason || "N/A"}</div>
            ];
        }

        return [
            ...commonCells,
            ...specificCells,
            StatusCell(req.status),
        ];
    });

    const labels = {
        "DAY_OFF": t("Day Off"),
        "WORK_DELAY": t("Delay"),
        "SALARY_ADVANCE": t("Financial")
    };

    const customActions = (rowIndex) => {
        const request = currentData[rowIndex];
        const canCancel = request.status === "open";

        return (
            <div className="flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 min-w-32 overflow-hidden">
                {canCancel && (
                    <button
                        onClick={() => handleCancel(rowIndex)}
                        className="w-full px-4 py-2 text-sm text-left flex items-center text-red-600 gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                        {t("Cancel")}
                    </button>
                )}
            </div>
        );
    };

    const headerActions = (
        <div className="flex flex-wrap gap-4 items-center justify-between w-full md:w-auto">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {Object.keys(labels).map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-4 py-1 text-sm rounded-md transition-all ${activeTab === tab ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
                    >
                        {labels[tab]}
                    </button>
                ))}
            </div>
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-primary-200 text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm"
            >
                <Add size={18} color="white" />
                {t("New Request")}
            </button>
        </div>
    );

    return (
        <Page title={t("My Requests")}>
            <Table
                title={t("Requests History")}
                headers={getHeaders()}
                rows={rows}
                isActions={false}
                customActions={customActions}
                headerActions={headerActions}
                isCheckInput={false}
                isLoading={isLoading}
            />

            <CreateRequestModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {alertConfig.type === "approval" ? (
                <ApprovalAlert
                    isOpen={alertConfig.isOpen}
                    onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={alertConfig.onConfirm}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    confirmBtnText={t("Confirm")}
                    cancelBtnText={t("Back")}
                />
            ) : (
                <ApiResponseAlert
                    isOpen={alertConfig.isOpen}
                    status={alertConfig.status}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                />
            )}
        </Page>
    );
}

export default EmployeeRequestsPage;
