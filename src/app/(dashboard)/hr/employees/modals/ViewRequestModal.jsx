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
    const { t, i18n } = useTranslation();
    const decisionCommentLabel = t("Manager Comment / Explanation");
    const [status, setStatus] = useState("");
    const [comment, setComment] = useState("");
    const [updateStatus, { isLoading: isUpdating }] = useUpdateEmployeeRequestStatusMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const requestId = request?.id || request?._id;
    const { data: attachments = [] } = useGetRequestAttachmentsQuery(requestId, { skip: !requestId });
    const [uploadAttachment, { isLoading: isUploading }] = useUploadRequestAttachmentMutation();
    const [deleteAttachment] = useDeleteRequestAttachmentMutation();
    const statusChanged = status !== request?.status;
    const replyChanged = Boolean(comment.trim()) && comment.trim() !== (request?.comment || "").trim();
    const canSave = Boolean(status) && (statusChanged || replyChanged) && !isUpdating;

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
                message: t(statusChanged ? "Request status updated successfully" : "Manager reply saved successfully")
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
    const statusLabels = {
        open: request.type === "SHORT_LEAVE" ? t("Under Review") : t("Open"),
        "in-progress": t("In Progress"),
        accepted: t("Accepted"),
        rejected: t("Rejected"),
        cancelled: t("Cancelled"),
    };
    const statusColors = {
        open: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
        "in-progress": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
        accepted: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
        rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
        cancelled: "bg-status-bg text-cell-secondary border-status-border",
    };
    const locale = i18n.language?.startsWith("ar") ? "ar" : "en";
    const formatDate = (value, includeTime = false) => {
        if (!value) return "—";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);
        return new Intl.DateTimeFormat(locale, includeTime
            ? { dateStyle: "medium", timeStyle: "short" }
            : { dateStyle: "medium", timeZone: "UTC" }).format(date);
    };

    const requestDetails = (() => {
        switch (request.type) {
            case "DAY_OFF":
                return [
                    [t("Start Date"), formatDate(request.vacation_date)],
                    [t("End Date"), formatDate(request.vacation_end_date || request.vacation_date)],
                ];
            case "SALARY_ADVANCE":
                return [
                    [t("Advance By"), request.advance_salary_by],
                    [t("Old Salary"), request.old_salary_amount],
                ];
            case "WORK_DELAY":
                return [[t("Work Due At"), formatDate(request.work_due_at, true)]];
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
            <ProcessingOverlay isOpen={isUpdating} message={t("Updating...")} />
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                className="max-w-2xl p-0"
                title={t("Request Details")}
                customBtns={<div className="flex justify-end gap-3 border-t border-status-border bg-surface px-5 py-4">
                    <button type="button" onClick={onClose}
                        className="rounded-lg border border-status-border bg-status-bg px-4 py-2 text-sm font-medium text-cell-primary hover:bg-badge-bg">
                        {readOnly ? t("Close") : t("Cancel")}
                    </button>
                    {!readOnly && <button type="button" onClick={handleSave}
                        disabled={!canSave}
                        className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50">
                        {isUpdating ? t("Updating...") : t("Update")}
                    </button>}
                </div>}
            >
                <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-status-border bg-status-bg p-4">
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-cell-secondary">{requestTypeLabels[request.type] || t("Request")}</p>
                            <p className="mt-1 break-words text-lg font-semibold text-cell-primary" dir="auto">{request.employee?.name || t("Employee")}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[request.status] || statusColors.cancelled}`}>
                            {statusLabels[request.status] || t(request.status)}
                        </span>
                    </div>

                    {requestDetails.length > 0 && (
                        <section className="rounded-xl border border-status-border p-4">
                            <h3 className="mb-3 text-sm font-semibold text-cell-primary">{t("Request Details")}</h3>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {requestDetails.map(([label, value]) => (
                                    <div key={label} className="rounded-lg bg-status-bg p-3">
                                        <p className="text-xs text-cell-secondary">{label}</p>
                                        <p className="mt-1 text-sm font-medium text-cell-primary" dir="auto">{String(value)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h3 className="mb-2 text-sm font-semibold text-cell-primary">{t("Reason for Request")}</h3>
                        <p className="min-h-14 whitespace-pre-wrap break-words rounded-xl border border-status-border bg-status-bg p-4 text-sm leading-6 text-cell-primary" dir="auto">
                            {request.reason || "—"}
                        </p>
                    </section>

                    <section className="rounded-xl border border-status-border p-4">
                        <h3 className="mb-3 text-sm font-semibold text-cell-primary">{readOnly ? decisionCommentLabel : t("Update Status")}</h3>
                        {!readOnly && <div className="mb-4">
                            <ElementsSelect title={t("Select New Status")}
                                defaultValue={options.find(opt => opt.id === status)}
                                onChange={(selection) => setStatus(selection[0]?.id)}
                                options={options} placeholder={t("Choose status...")} />
                        </div>}
                        {readOnly ? (
                            <p className="min-h-14 whitespace-pre-wrap break-words rounded-lg bg-status-bg p-3 text-sm text-cell-primary" dir="auto">{comment || "—"}</p>
                        ) : (
                            <><label className="mb-2 block text-sm font-medium text-cell-primary" htmlFor="request-decision-comment">{decisionCommentLabel}</label>
                            <textarea id="request-decision-comment"
                                className="min-h-24 w-full resize-y rounded-lg border border-status-border bg-surface p-3 text-sm text-cell-primary outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder={t("Explain why this status was chosen...")}
                                value={comment} onChange={(e) => setComment(e.target.value)} /></>
                        )}
                        {!readOnly && <p className="mt-2 text-xs text-cell-secondary">{t("This comment will be visible to the employee.")}</p>}
                        {!readOnly && status === "rejected" && <p className="mt-2 text-xs text-red-500">{t("A rejection reason is required")}</p>}
                    </section>

                    {requestId && (
                        <AttachmentsList
                            attachments={attachments}
                            onUpload={readOnly ? null : handleUploadAttachment}
                            onDelete={readOnly ? null : handleDeleteAttachment}
                            isUploading={isUploading}
                            compact
                        />
                    )}

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
