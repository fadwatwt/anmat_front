"use client";
import { useState, useEffect } from "react";
import ElementsSelect from "@/components/Form/ElementsSelect";
import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import { useTranslation } from "react-i18next";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import {
    useGetSubscriberNotificationTypesQuery,
    useSendSubscriberNotificationMutation,
} from "@/redux/subscriber-notifications/subscriberNotificationsApi";
import { toast } from "react-toastify";
import {
    RiErrorWarningLine,
    RiBellLine,
    RiInformationLine,
} from "@remixicon/react";

// Map icon name strings from backend to actual icon components
const ICON_MAP = {
    RiErrorWarningLine: <RiErrorWarningLine size={16} />,
    RiBellLine: <RiBellLine size={16} />,
    RiInformationLine: <RiInformationLine size={16} />,
};

const COLOR_MAP = {
    red: "text-red-500",
    yellow: "text-yellow-500",
    blue: "text-blue-500",
};

function SendNotificationModal({ isOpen, onClose, employeeData, departmentData }) {
    const { t } = useTranslation();

    const { data: employeesData } = useGetEmployeesQuery();
    const { data: typesData } = useGetSubscriberNotificationTypesQuery();
    const [sendNotification, { isLoading }] = useSendSubscriberNotificationMutation();

    const employees = employeesData || [];
    const types = typesData?.data || [];

    // Form state
    const [selectedTypeId, setSelectedTypeId] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

    // Sync state when modal opens
    useEffect(() => {
        if (isOpen) {
            if (employeeData) {
                setSelectedEmployeeIds([{ id: employeeData.user_id, element: employeeData.user?.name }]);
            } else {
                setSelectedEmployeeIds([]);
            }
            setSelectedTypeId("");
            setTitle("");
            setMessage("");
        }
    }, [isOpen, employeeData]);

    // Build employee options for ElementsSelect
    const selectOptions = [
        { id: "all", element: t("All Employees"), isSelectAll: true },
        ...employees.map((emp) => ({
            id: emp.user_id || emp._id,
            element: emp.user?.name || t("Unknown"),
            email: emp.user?.email,
            image: `https://ui-avatars.com/api/?name=${emp.user?.name || "E"}&background=random`,
        })),
    ];

    // Build notification type options for ElementsSelect
    const typeOptions = types.map((type) => ({
        id: type._id,
        element: type.name,
        icon: ICON_MAP[type.icon],
        colorClass: COLOR_MAP[type.color] || "text-gray-500",
        description: type.description,
    }));

    const handleSend = async () => {
        if (!selectedTypeId) {
            toast.error(t("Please select a notification type"));
            return;
        }
        if (!title.trim()) {
            toast.error(t("Please enter a title"));
            return;
        }
        if (!message.trim()) {
            toast.error(t("Please enter a message"));
            return;
        }

        // Determine target
        let target = "all_employees";
        let employee_ids = undefined;
        let department_id = undefined;

        if (departmentData && selectedEmployeeIds.length === 0) {
            // Sent from department row — send to all dept employees
            target = "department";
            department_id = departmentData._id;
        } else if (selectedEmployeeIds.length > 0) {
            const hasAll = selectedEmployeeIds.some((e) => e.id === "all");
            if (!hasAll) {
                target = "specific_employees";
                employee_ids = selectedEmployeeIds.map((e) => e.id);
            }
        }

        try {
            await sendNotification({
                notification_type_id: selectedTypeId,
                title: title.trim(),
                message: message.trim(),
                target,
                department_id,
                employee_ids,
            }).unwrap();

            toast.success(t("Notification sent successfully"));
            handleClose();
        } catch (error) {
            toast.error(error?.data?.message || t("Failed to send notification"));
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            title={t("Send Notification")}
            isOpen={isOpen}
            onClose={handleClose}
            isBtns={true}
            isHideCancel={true}
            btnApplyTitle={t("Send")}
            onClick={handleSend}
            isLoading={isLoading}
        >
            <div className="flex flex-col gap-4 px-1">

                {/* Notification Type */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("Notification Type")} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {typeOptions.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setSelectedTypeId(type.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all
                                    ${selectedTypeId === type.id
                                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300"
                                    }`}
                            >
                                <span className={type.colorClass}>{type.icon}</span>
                                <span className="dark:text-gray-200">{type.element}</span>
                            </button>
                        ))}
                    </div>
                    {selectedTypeId && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {typeOptions.find((t) => t.id === selectedTypeId)?.description}
                        </p>
                    )}
                </div>

                {/* Recipients — only show if not opened from a department context */}
                {!departmentData && (
                    <ElementsSelect
                        title={t("Employees")}
                        isMultiple={true}
                        options={selectOptions}
                        value={selectedEmployeeIds}
                        onChange={setSelectedEmployeeIds}
                        renderOption={(option) => (
                            <div className="flex items-center gap-3">
                                {option.image && (
                                    <img
                                        src={option.image}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-100"
                                        alt=""
                                    />
                                )}
                                <div className="flex flex-col">
                                    <span className="text-gray-900 dark:text-white text-sm">
                                        {option.element}
                                    </span>
                                    {option.email && (
                                        <span className="text-xs text-gray-500">{option.email}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                )}

                {departmentData && (
                    <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {t("Sending to all employees in department")}: <b>{departmentData.name}</b>
                    </div>
                )}

                {/* Title */}
                <InputAndLabel
                    title={t("Title")}
                    type="text"
                    placeholder={t("Enter notification title...")}
                    isRequired={true}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Message */}
                <TextAreaWithLabel
                    title={t("Message")}
                    placeholder={t("Enter message...")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                />
            </div>
        </Modal>
    );
}

export default SendNotificationModal;