"use client";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import { useUpdateEmployeeRequestStatusMutation, useGetRequestAttachmentsQuery, useUploadRequestAttachmentMutation, useDeleteRequestAttachmentMutation } from "@/redux/employees/employeeRequestsApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ProcessingOverlay from "@/components/Feedback/ProcessingOverlay";
import AttachmentsList from "@/app/(dashboard)/projects/[slug]/_components/AttachmentsList.jsx";
import { translateDate } from "@/functions/Days";

function ViewRequestModal({ isOpen, onClose, request, readOnly = false, initialStatus = null }) {
    const { t } = useTranslation();
    const [status, setStatus] = useState("");
    const [comment, setComment] = useState("");
    const [updateStatus, { isLoading: isUpdating }] = useUpdateEmployeeRequestStatusMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const requestId = request?.id || request?._id;
    const { data: attachments = [] } = useGetRequestAttachmentsQuery(requestId, { skip: !requestId });
    const [uploadAttachment, { isLoading: isUploading }] = useUploadRequestAttachmentMutation();
    const [deleteAttachment] = useDeleteRequestAttachmentMutation();

    useEffect(() => {
        if (request) {
            setStatus(initialStatus || request.status);
            setComment(request.comment || "");
        }
    }, [request, initialStatus]);

    const handleSave = async () => {
        if (readOnly) return;
        if (!status) return;
        if (status === "rejected" && !comment.trim()) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("A rejection reason is required")
            });
            return;
        }

        try {
            await updateStatus({ id: requestId, status, comment }).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Request status updated successfully")
            });
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update status")
            });
        }
    };

    const handleUploadAttachment = async (file, description) => {
        if (!requestId) return;
        const formData = new FormData();
        formData.append("file", file);
        if (description) formData.append("description", description);
        try {
            await uploadAttachment({ id: requestId, formData }).unwrap();
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to upload attachment")
            });
            throw error;
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        if (!requestId) return;
        try {
            await deleteAttachment({ id: requestId, attachmentId }).unwrap();
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to delete attachment")
            });
        }
    };

    if (!request) return null;

    const getAvailableStatusOptions = () => {
        // Must stay within EmployeeRequestStatus: open, in-progress, accepted, rejected, cancelled.
        return [
            { id: "open", element: request.type === "SHORT_LEAVE" ? t("Under Review") : t("Open") },
            { id: "in-progress", element: t("In Progress") },
            { id: "accepted", element: t("Accepted") },
            { id: "rejected", element: t("Rejected") },
        ];
    };

    const options = getAvailableStatusOptions();
    const requestTypeLabels = {
        DAY_OFF: t("Day Off"),
        SALARY_ADVANCE: t("Salary Advance"),
        WORK_DELAY: t("Delay Request"),
        SHORT_LEAVE: t("Short Leave"),
    };

    const requestDetails = (() => {
        switch (request.type) {
            case "DAY_OFF":
                return [
                    [t("Start Date"), request.vacation_date],
                    [t("End Date"), request.vacation_end_date || request.vacation_date],
                ];
            case "SALARY_ADVANCE":
                return [
                    [t("Advance By"), request.advance_salary_by],
                    [t("Old Salary"), request.old_salary_amount],
                ];
            case "WORK_DELAY":
                return [[t("Work Due At"), request.work_due_at]];
            case "SHORT_LEAVE":
                return [
                    [t("Date"), request.leave_date ? translateDate(request.leave_date) : null],
                    [t("Start Time"), request.leave_start_time],
                    [t("End Time"), request.leave_end_time],
                ];
            default:
                return [];
        }
    })().filter(([, value]) => value !== null && value !== undefined && value !== "");

    return (
        <>
            <ProcessingOverlay isOpen={isUpdating} message={t("Updating Status...")} />
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                className="max-w-xl p-0"
                title={readOnly ? t("Request Details") : t("Update Status")}
                size="md"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1 rounded-xl bg-status-bg border border-status-border p-3">
                        <span className="text-sm text-cell-secondary">{t("Update status for")}</span>
                        <span className="font-medium text-table-title">{request.employee?.name}</span>
                        <span className="text-xs text-cell-secondary">{requestTypeLabels[request.type] || t("Request")}</span>
                    </div>

                    {requestDetails.length > 0 && (
                        <div className="flex flex-col gap-2 p-3 bg-status-bg rounded-lg border border-status-border">
                            <span className="text-sm font-semibold text-cell-primary">{t("Request Details")}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-cell-secondary">
                                {requestDetails.map(([label, value]) => (
                                    <span key={label}>
                                        <span className="font-medium text-cell-primary">{label}:</span> {String(value)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {readOnly ? (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-cell-primary">{t("Status")}</span>
                            <div className="p-3 bg-status-bg rounded-lg text-sm text-cell-secondary border border-status-border">
                                {request.status === "open" && request.type === "SHORT_LEAVE" ? t("Under Review") : t(request.status)}
                            </div>
                        </div>
                    ) : (
                        <ElementsSelect
                            title={t("Select New Status")}
                            defaultValue={options.find(opt => opt.id === status)}
                            onChange={(selection) => setStatus(selection[0]?.id)}
                            options={options}
                            placeholder={t("Choose status...")}
                        />
                    )}

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-cell-primary">{t("Reason for Request")}</span>
                        <div className="p-3 bg-status-bg rounded-lg text-sm text-cell-secondary border border-status-border">
                            {request.reason}
                        </div>
                    </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-cell-primary">{t("Subscriber Comment / Explanation")}</span>
                        <textarea
                            className="w-full p-3 bg-surface border border-status-border rounded-lg text-sm text-cell-primary focus:ring-2 focus:ring-primary-500 outline-none min-h-[80px] resize-none transition-all"
                            placeholder={t("Explain why this status was chosen...")}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={readOnly}
                        />
                        <span className="text-[10px] text-cell-secondary italic">{t("This comment will be visible to the employee.")}</span>
                        {status === "rejected" && (
                            <span className="text-xs text-red-500">{t("A rejection reason is required")}</span>
                        )}
                    </div>

                    {requestId && (
                        <AttachmentsList
                            attachments={attachments}
                            onUpload={readOnly ? null : handleUploadAttachment}
                            onDelete={readOnly ? null : handleDeleteAttachment}
                            isUploading={isUploading}
                            compact
                        />
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t border-status-border">
                        {readOnly ? (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-cell-secondary bg-status-bg rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                            >
                                {t("Close")}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-cell-secondary bg-status-bg rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                                >
                                    {t("Cancel")}
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isUpdating || !status || status === request.status}
                                    className="px-4 py-2 text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors text-sm font-medium"
                                >
                                    {isUpdating ? t("Updating...") : t("Update Status")}
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </Modal>

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse(prev => ({ ...prev, isOpen: false }))}
            />
        </>
    );
}

ViewRequestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    request: PropTypes.object,
    readOnly: PropTypes.bool,
    initialStatus: PropTypes.string,
};

export default ViewRequestModal;
