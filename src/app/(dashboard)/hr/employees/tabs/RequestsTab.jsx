import { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table.jsx";
import ViewRequestModal from "../modals/ViewRequestModal.jsx";
import { statusCell as StatusCell } from "@/components/StatusCell";
import {
    useGetEmployeeRequestsQuery,
    useDeleteEmployeeRequestMutation
} from "@/redux/employees/employeeRequestsApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import { format } from "date-fns";
import { RiFilter2Line, RiCalendarEventLine } from "@remixicon/react";

function RequestsTab() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("DAY_OFF"); // "DAY_OFF", "SALARY_ADVANCE", "WORK_DELAY"
    const [statusFilter, setStatusFilter] = useState(null);
    const [departmentFilter, setDepartmentFilter] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // API Hooks
    const { data: departmentsData } = useGetDepartmentsQuery();
    const { data: requestsData, isLoading } = useGetEmployeeRequestsQuery({
        status: statusFilter?.id,
        department_id: departmentFilter?.id
    });
    const [deleteRequest] = useDeleteEmployeeRequestMutation();

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

    const handleDelete = (index) => {
        const request = currentData[index];
        setAlertConfig({
            isOpen: true,
            type: "approval",
            title: t("Delete Request"),
            message: t("Are you sure you want to delete this request? This action cannot be undone."),
            onConfirm: async () => {
                try {
                    await deleteRequest(request.id).unwrap();
                    setAlertConfig({
                        isOpen: true,
                        type: "response",
                        status: "success",
                        message: t("Request deleted successfully")
                    });
                } catch (error) {
                    setAlertConfig({
                        isOpen: true,
                        type: "response",
                        status: "error",
                        message: error?.data?.message || t("Failed to delete request")
                    });
                }
            }
        });
    };

    const handleEdit = (index) => {
        setSelectedRequest(currentData[index]);
        setIsUpdateModalOpen(true);
    };

    const statusOptions = [
        { id: "open", element: t("Open") },
        { id: "in-progress", element: t("In Progress") },
        { id: "accepted", element: t("Accepted") },
        { id: "rejected", element: t("Rejected") },
        { id: "cancelled", element: t("Cancelled") },
    ];

    const departmentOptions = departmentsData?.map(dept => ({
        id: dept._id,
        element: dept.name
    })) || [];

    const getHeaders = () => {
        const commonHeaders = [
            { label: t("Employee Name"), width: "20%" },
            { label: t("Request Date"), width: "15%" },
        ];

        if (activeTab === "DAY_OFF") {
            return [...commonHeaders, { label: t("Vacation Period"), width: "20%" }, { label: t("Reason"), width: "25%" }, { label: t("Status"), width: "15%" }, { label: "", width: "5%" }];
        } else if (activeTab === "SALARY_ADVANCE") {
            return [...commonHeaders, { label: t("Advance By"), width: "10%" }, { label: t("Old Salary"), width: "10%" }, { label: t("Reason"), width: "25%" }, { label: t("Status"), width: "15%" }, { label: "", width: "5%" }];
        } else { // WORK_DELAY
            return [...commonHeaders, { label: t("Work Due At"), width: "15%" }, { label: t("Reason"), width: "30%" }, { label: t("Status"), width: "15%" }, { label: "", width: "5%" }];
        }
    };

    const rows = currentData.map((req) => {
        const commonCells = [
            <div key={req.id + "_name"} className="flex items-center gap-3">
                <img src={`https://ui-avatars.com/api/?name=${req.employee?.name || "User"}`} className="w-8 h-8 rounded-full border border-status-border" alt="" />
                <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-cell-primary">{req.employee?.name || "N/A"}</span>
                    <span className="text-[10px] text-cell-secondary font-medium">{req.employee?.email || "N/A"}</span>
                </div>
            </div>,
            <div key={req.id + "_created_at"} className="text-cell-secondary font-medium">
                {req.created_at ? format(new Date(req.created_at), "dd MMM yyyy") : "N/A"}
            </div>
        ];

        let specificCells = [];
        if (activeTab === "DAY_OFF") {
            specificCells = [
                <div key={req.id + "_vacation"} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-cell-primary font-bold text-xs">
                        <RiCalendarEventLine size={14} className="text-primary-500" />
                        {req.vacation_date ? format(new Date(req.vacation_date), "dd MMM") : "N/A"}
                        {req.vacation_end_date && (
                            <>
                                <span>-</span>
                                {format(new Date(req.vacation_end_date), "dd MMM yyyy")}
                            </>
                        )}
                        {!req.vacation_end_date && req.vacation_date && format(new Date(req.vacation_date), " yyyy")}
                    </div>
                </div>,
                <div key={req.id + "_reason"} className="text-cell-secondary font-medium truncate max-w-[200px]" title={req.reason}>{req.reason || "N/A"}</div>
            ];
        } else if (activeTab === "SALARY_ADVANCE") {
            specificCells = [
                <div key={req.id + "_advance"} className="text-cell-primary font-bold text-sm">${req.advance_salary_by || "N/A"}</div>,
                <div key={req.id + "_old_salary"} className="text-cell-secondary font-medium text-xs">${req.old_salary_amount || "N/A"}</div>,
                <div key={req.id + "_reason"} className="text-cell-secondary font-medium truncate max-w-[200px]" title={req.reason}>{req.reason || "N/A"}</div>
            ];
        } else { // WORK_DELAY
            specificCells = [
                <div key={req.id + "_due"} className="text-cell-primary font-bold text-xs">
                    {req.work_due_at ? format(new Date(req.work_due_at), "dd MMM yyyy HH:mm") : "N/A"}
                </div>,
                <div key={req.id + "_reason"} className="text-cell-secondary font-medium truncate max-w-[250px]" title={req.reason}>{req.reason || "N/A"}</div>
            ];
        }

        return [
            ...commonCells,
            ...specificCells,
            StatusCell(req.status),
        ];
    });

    const labels = {
        "DAY_OFF": "Day Off",
        "WORK_DELAY": "Delay",
        "SALARY_ADVANCE": "Financial"
    };

    const customActions = (rowIndex) => {
        const request = currentData[rowIndex];
        const isLocked = ["accepted", "rejected", "cancelled"].includes(request.status);

        return (
            <div className="flex flex-col bg-surface shadow-xl rounded-xl border border-status-border min-w-40 overflow-hidden py-1">
                <button
                    onClick={() => handleEdit(rowIndex)}
                    className="w-full px-4 py-2 text-sm text-cell-primary flex gap-3 items-center text-left hover:bg-status-bg transition-colors font-medium"
                >
                    {isLocked ? t("View Details") : t("Update Status")}
                </button>
                <button
                    onClick={() => handleDelete(rowIndex)}
                    className="w-full px-4 py-2 text-sm text-left flex items-center text-red-500 gap-3 hover:bg-status-bg transition-colors font-medium"
                >
                    {t("Delete")}
                </button>
            </div>
        );
    };

    const headerActions = (
        <div className="flex flex-col md:flex-row gap-4 items-center">
             <div className="flex bg-status-bg rounded-xl p-1 border border-status-border shadow-inner">
                {Object.keys(labels).map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all transform active:scale-95 ${activeTab === tab 
                            ? "bg-surface shadow-sm text-primary-500 border border-status-border" 
                            : "text-cell-secondary hover:text-cell-primary"}`}
                    >
                        {t(labels[tab]).toUpperCase()}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center gap-2 bg-surface border border-status-border p-1 rounded-xl shadow-sm">
                <div className="flex items-center gap-1 px-2 border-r border-status-border">
                    <RiFilter2Line size={16} className="text-cell-secondary" />
                    <span className="text-xs font-bold text-cell-secondary uppercase">{t("Filters")}</span>
                </div>
                <div className="min-w-[140px]">
                    <ElementsSelect
                        options={departmentOptions}
                        placeholder={t("All Departments")}
                        onChange={(selection) => setDepartmentFilter(selection[0] || null)}
                        isTitle={false}
                        className="!py-0 !border-none !shadow-none"
                    />
                </div>
                <div className="min-w-[140px] border-l border-status-border">
                    <ElementsSelect
                        options={statusOptions}
                        placeholder={t("All Statuses")}
                        onChange={(selection) => setStatusFilter(selection[0] || null)}
                        isTitle={false}
                        className="!py-0 !border-none !shadow-none"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            <Table
                title={t("Requests Management")}
                headers={getHeaders()}
                rows={rows}
                isActions={false}
                customActions={customActions}
                headerActions={headerActions}
                isCheckInput={true}
                isLoading={isLoading}
            />

            <ViewRequestModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                request={selectedRequest}
            />

            {alertConfig.type === "approval" ? (
                <ApprovalAlert
                    isOpen={alertConfig.isOpen}
                    onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={alertConfig.onConfirm}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    confirmBtnText={t("Confirm")}
                    cancelBtnText={t("Cancel")}
                />
            ) : (
                <ApiResponseAlert
                    isOpen={alertConfig.isOpen}
                    status={alertConfig.status}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                />
            )}
        </div>
    );
}

export default RequestsTab;

