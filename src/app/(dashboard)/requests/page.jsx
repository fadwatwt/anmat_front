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
import { useProcessing } from "@/app/providers";

function EmployeeRequestsPage() {
    const { t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();
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
                    showProcessing(t("Cancelling request..."));
                    await cancelRequest(request._id).unwrap();
                    hideProcessing();
                    setAlertConfig({
                        isOpen: true,
                        type: "response",
                        status: "success",
                        message: t("Request cancelled successfully")
                    });
                } catch (error) {
                    hideProcessing();
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
            <div key={req._id + "_created_at"} className="text-cell-primary">
                {req.created_at ? format(new Date(req.created_at), "dd MMM yyyy") : "N/A"}
            </div>
        ];

        let specificCells = [];
        if (activeTab === "DAY_OFF") {
            specificCells = [
                <div key={req._id + "_vacation"} className="text-cell-primary">
                    {req.vacation_date ? format(new Date(req.vacation_date), "dd MMM yyyy") : "N/A"}
                </div>,
                <div key={req._id + "_reason"} className="text-cell-secondary truncate max-w-[300px]">{req.reason || "N/A"}</div>
            ];
        } else if (activeTab === "SALARY_ADVANCE") {
            specificCells = [
                <div key={req._id + "_advance"} className="text-cell-primary">{req.advance_salary_by || "N/A"}</div>,
                <div key={req._id + "_old_salary"} className="text-cell-secondary">{req.old_salary_amount || "N/A"}</div>,
                <div key={req._id + "_reason"} className="text-cell-secondary truncate max-w-[250px]">{req.reason || "N/A"}</div>
            ];
        } else { // WORK_DELAY
            specificCells = [
                <div key={req._id + "_due"} className="text-cell-primary">
                    {req.work_due_at ? format(new Date(req.work_due_at), "dd MMM yyyy HH:mm") : "N/A"}
                </div>,
                <div key={req._id + "_reason"} className="text-cell-secondary truncate max-w-[300px]">{req.reason || "N/A"}</div>
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
            <div className="flex flex-col bg-surface shadow-xl rounded-xl border border-status-border min-w-40 overflow-hidden transform scale-95 transition-all duration-200 origin-top-right">
                {canCancel && (
                    <button
                        onClick={() => handleCancel(rowIndex)}
                        className="w-full px-5 py-3 text-sm text-left flex items-center text-red-error gap-3 hover:bg-status-bg transition-colors font-medium border-l-4 border-transparent hover:border-red-error"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-error"></span>
                        {t("Cancel")}
                    </button>
                )}
            </div>
        );
    };

    const headerActions = (
        <div className="flex flex-wrap gap-5 items-center justify-between w-full md:w-auto">
            <div className="flex bg-status-bg rounded-2xl p-1.5 border border-status-border/50">
                {Object.keys(labels).map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-6 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === tab ? "bg-surface shadow-md text-primary-base border border-status-border" : "text-cell-secondary hover:text-cell-primary hover:bg-status-bg/50"}`}
                    >
                        {labels[tab]}
                    </button>
                ))}
            </div>
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-base text-white dark:bg-primary-200 dark:text-black rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary-500/20"
            >
                <Add size={20} variant="Bold" />
                {t("New Request")}
            </button>
        </div>
    );

    if (isLoading) {
        return (
            <Page title={t("My Requests")}>
                <div className="flex items-center justify-center h-64 bg-surface rounded-2xl border border-status-border">
                    <div className="text-primary-base animate-pulse font-bold text-lg flex items-center gap-3">
                        <div className="w-3 h-3 bg-primary-base rounded-full animate-bounce"></div>
                        {t("Loading your requests...")}
                    </div>
                </div>
            </Page>
        );
    }

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
