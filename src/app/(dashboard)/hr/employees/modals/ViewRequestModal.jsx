"use client";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import { useUpdateEmployeeRequestStatusMutation } from "@/redux/employees/employeeRequestsApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function ViewRequestModal({ isOpen, onClose, request }) {
    const { t } = useTranslation();
    const [status, setStatus] = useState("");
    const [updateStatus, { isLoading: isUpdating }] = useUpdateEmployeeRequestStatusMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    useEffect(() => {
        if (request) {
            setStatus(request.status);
        }
    }, [request]);

    const handleSave = async () => {
        if (!status || status === request.status) return;

        try {
            await updateStatus({ id: request.id, status }).unwrap();
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

    if (!request) return null;

    const getAvailableStatusOptions = () => {
        if (request.status === "open") {
            return [
                { id: "in-progress", element: t("In Progress") },
                { id: "accepted", element: t("Accepted") },
                { id: "rejected", element: t("Rejected") },
            ];
        } else if (request.status === "in-progress") {
            return [
                { id: "accepted", element: t("Accepted") },
                { id: "rejected", element: t("Rejected") },
            ];
        }
        return [];
    };

    const options = getAvailableStatusOptions();
    const isLocked = request.status === "accepted" || request.status === "rejected";

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                className="lg:w-[25%] md:w-5/12 sm:w-6/12 w-9/12 p-4"
                title={t("Update Status")}
                size="md"
            >
                <div className="flex flex-col gap-6 py-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-500">{t("Update status for")}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{request.employee?.name}</span>
                        <span className="text-xs text-gray-400 capitalize">{request.type.replace(/_/g, ' ')} Request</span>
                    </div>

                    {isLocked ? (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                            {t("This request status is already")} <span className="font-semibold capitalize">{request.status}</span> {t("and cannot be changed.")}
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

                    <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                            {t("Cancel")}
                        </button>
                        {!isLocked && (
                            <button
                                onClick={handleSave}
                                disabled={isUpdating || !status || status === request.status}
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
                            >
                                {isUpdating ? t("Updating...") : t("Update Status")}
                            </button>
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
};

export default ViewRequestModal;
