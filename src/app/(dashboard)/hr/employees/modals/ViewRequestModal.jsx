"use client";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes, { element } from "prop-types";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import DateInput from "@/components/Form/DateInput";
import TimeInput from "@/components/Form/TimeInput";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";

function ViewRequestModal({ isOpen, onClose, request }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (request) {
            setFormData(request);
        }
    }, [request]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving request:", formData);
        onClose();
    };

    if (!request) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="lg:w-[30%] md:w-8/12 sm:w-6/12 w-9/12 p-4"
            title={t(`${request.type} Request Details`)}
            size="lg"
        >
            <div className="flex flex-col gap-4">
                <InputAndLabel
                    title={t("Employee")}
                    value={formData.name || ""}
                    disabled
                />

                <InputAndLabel
                    title={t("Request Date")}
                    value={formData.date || ""}
                    disabled={true}
                    containerClassName="w-full"
                />


                <InputAndLabel
                    title={t("Department")}
                    value={formData.department || ""}
                    disabled
                    containerClassName="w-full"
                />

                {request.type === "Financial" && (
                    <>
                        <InputAndLabel
                            title={t("Salary Amount")}
                            name="amount"
                            value={formData.amount || ""}
                            onChange={handleChange}
                        />
                        <InputAndLabel
                            title={t("Salary Amount")}
                            name="amount"
                            value={formData.amount || ""}
                            onChange={handleChange}
                        />
                    </>

                )}

                {request.type === "Day Off" && (
                    <DateInput
                        title={t("Day Off Date")}
                        name="dayOffDate"
                        value={formData.dayOffDate || ""}
                        onChange={handleChange}
                    />
                )}
                {request.type === "Delay" && (
                    <TimeInput
                        title={t("Time")}
                        name="time"
                        value={formData.time || ""}
                        onChange={handleChange}
                    />
                )}

                <ElementsSelect
                    title={t("Status")}
                    name="status"
                    value={formData.status || "pending"}
                    onChange={handleChange}
                    options={[
                        { id: "pending", element: t("Pending") },
                        { id: "approved", element: t("Approved") },
                        { id: "rejected", element: t("Rejected") },
                    ]}
                />

                <InputAndLabel
                    title={t("Reason")}
                    name="reason"
                    value={formData.reason || ""}
                    onChange={handleChange}
                />

                <TextAreaWithLabel
                    title={t("Description")}
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={3}
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        {t("Save")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

ViewRequestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    request: PropTypes.object,
};

export default ViewRequestModal;
