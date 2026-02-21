"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import DefaultButton from "@/components/Form/DefaultButton";
import { useCreateEmployeeRequestMutation } from "@/redux/employees/employeeAuthRequestsApi";
import { useTranslation } from "react-i18next";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/auth/authSlice";

function CreateRequestModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const userId = useSelector(selectUserId);
    const [createRequest, { isLoading }] = useCreateEmployeeRequestMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null
    });

    const requestTypes = [
        { id: "DAY_OFF", element: t("Day Off") },
        { id: "SALARY_ADVANCE", element: t("Salary Advance") },
        { id: "WORK_DELAY", element: t("Work Delay") },
    ];

    const formik = useFormik({
        initialValues: {
            type: "",
            reason: "",
            comment: "",
            work_due_at: "",
            advance_salary_by: "",
            old_salary_amount: "",
            vacation_date: "",
        },
        validationSchema: Yup.object({
            type: Yup.string().required(t("Request type is required")),
            reason: Yup.string().required(t("Reason is required")),
            comment: Yup.string(),
            work_due_at: Yup.date().when("type", {
                is: "WORK_DELAY",
                then: (schema) => schema.min(
                    new Date(),
                    t("Work due at must be in the future")
                ).required(t("Work due at is required")),
                otherwise: (schema) => schema.nullable().strip(),
            }),
            advance_salary_by: Yup.number().when("type", {
                is: "SALARY_ADVANCE",
                then: (schema) => schema.positive(t("Must be a positive number")).required(t("Advance salary by value is required")),
                otherwise: (schema) => schema.nullable().strip(),
            }),
            old_salary_amount: Yup.number().when("type", {
                is: "SALARY_ADVANCE",
                then: (schema) => schema.positive(t("Must be a positive number")).required(t("Old salary amount is required")),
                otherwise: (schema) => schema.nullable().strip(),
            }),
            vacation_date: Yup.date().when("type", {
                is: "DAY_OFF",
                then: (schema) => schema.min(
                    new Date(new Date().setHours(23, 59, 59, 999)),
                    t("Vacation date must be after today")
                ).required(t("Vacation date is required")),
                otherwise: (schema) => schema.nullable().strip(),
            }),
        }),
        onSubmit: async (values) => {
            setAlertConfig({
                isOpen: true,
                title: t("Submit Request"),
                message: t("Are you sure you want to submit this request?"),
                onConfirm: async () => {
                    try {
                        // Filter out irrelevant fields based on type
                        const payload = {
                            employee_id: userId,
                            type: values.type,
                            reason: values.reason,
                            comment: values.comment || "",
                        };

                        if (values.type === "WORK_DELAY") {
                            payload.work_due_at = values.work_due_at;
                        } else if (values.type === "SALARY_ADVANCE") {
                            payload.advance_salary_by = values.advance_salary_by;
                            payload.old_salary_amount = values.old_salary_amount;
                        } else if (values.type === "DAY_OFF") {
                            payload.vacation_date = values.vacation_date;
                        }

                        await createRequest(payload).unwrap();
                        setApiResponse({
                            isOpen: true,
                            status: "success",
                            message: t("Request submitted successfully"),
                        });
                        formik.resetForm();
                        setTimeout(() => {
                            onClose();
                        }, 1500);
                    } catch (error) {
                        setApiResponse({
                            isOpen: true,
                            status: "error",
                            message: error?.data?.message || t("Failed to submit request"),
                        });
                    } finally {
                        setAlertConfig(prev => ({ ...prev, isOpen: false }));
                    }
                }
            });
        },
    });

    const handleTypeChange = (selection) => {
        formik.setFieldValue("type", selection[0]?.id || "");
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={t("Create New Request")}
                className="lg:w-[40%] md:w-[60%] w-[90%]"
                isBtns={false}
                customBtns={
                    <div className="flex gap-2 justify-end w-full px-4 pb-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {t("Cancel")}
                        </button>
                        <DefaultButton
                            title={isLoading ? t("Submitting...") : t("Submit Request")}
                            onClick={formik.handleSubmit}
                            disabled={isLoading || !formik.isValid}
                            className="bg-primary-500 text-white dark:bg-primary-200 dark:text-black font-medium"
                        />
                    </div>
                }
            >
                <div className="flex flex-col gap-4 p-4 max-h-[70vh] overflow-y-auto">
                    <ElementsSelect
                        title={t("Request Type")}
                        options={requestTypes}
                        onChange={handleTypeChange}
                        placeholder={t("Select type")}
                        error={formik.touched.type && formik.errors.type}
                    />

                    {formik.values.type === "WORK_DELAY" && (
                        <InputAndLabel
                            title={t("Work Due At")}
                            name="work_due_at"
                            type="datetime-local"
                            value={formik.values.work_due_at}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.work_due_at && formik.errors.work_due_at}
                            isRequired
                        />
                    )}

                    {formik.values.type === "SALARY_ADVANCE" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputAndLabel
                                title={t("Advance Salary By")}
                                name="advance_salary_by"
                                type="number"
                                value={formik.values.advance_salary_by}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.advance_salary_by && formik.errors.advance_salary_by}
                                isRequired
                            />
                            <InputAndLabel
                                title={t("Old Salary Amount")}
                                name="old_salary_amount"
                                type="number"
                                value={formik.values.old_salary_amount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.old_salary_amount && formik.errors.old_salary_amount}
                                isRequired
                            />
                        </div>
                    )}

                    {formik.values.type === "DAY_OFF" && (
                        <InputAndLabel
                            title={t("Vacation Date")}
                            name="vacation_date"
                            type="date"
                            value={formik.values.vacation_date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.vacation_date && formik.errors.vacation_date}
                            isRequired
                        />
                    )}

                    <TextAreaWithLabel
                        title={t("Reason")}
                        name="reason"
                        placeholder={t("Explain the reason for your request")}
                        value={formik.values.reason}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.reason && formik.errors.reason}
                        isRequired
                    />

                    <TextAreaWithLabel
                        title={t("Comment")}
                        name="comment"
                        placeholder={t("Any additional comments (optional)")}
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            </Modal>

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse(prev => ({ ...prev, isOpen: false }))}
            />

            <ApprovalAlert
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={alertConfig.onConfirm}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmBtnText={t("Confirm")}
                cancelBtnText={t("Cancel")}
            />
        </>
    );
}

CreateRequestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CreateRequestModal;
