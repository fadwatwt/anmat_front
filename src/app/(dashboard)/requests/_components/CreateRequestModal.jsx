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
import { useProcessing } from "@/app/providers";
import FileUpload from "@/components/Form/FileUpload";
import { useUploadRequestAttachmentMutation } from "@/redux/employees/employeeRequestsApi";
import { useGetMyLeaveBalancesQuery } from "@/redux/leaves/leavesApi";

function CreateRequestModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();
    const userId = useSelector(selectUserId);
    const [createRequest, { isLoading }] = useCreateEmployeeRequestMutation();
    const [uploadRequestAttachment] = useUploadRequestAttachmentMutation();
    const { data: leaveBalances = [], isLoading: isLoadingBalances } = useGetMyLeaveBalancesQuery(undefined, { skip: !isOpen });
    const [attachment, setAttachment] = useState(null);
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
        { id: "SHORT_LEAVE", element: t("Short Leave") },
    ];

    const formik = useFormik({
        validateOnMount: true,
        initialValues: {
            type: "",
            reason: "",
            comment: "",
            work_due_at: "",
            advance_salary_by: "",
            old_salary_amount: "",
            vacation_date: "",
            vacation_end_date: "",
            leave_policy_id: "",
            leave_date: "",
            leave_start_time: "",
            leave_end_time: "",
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
                ).required(t("Vacation start date is required")),
                otherwise: (schema) => schema.nullable().strip(),
            }),
            leave_policy_id: Yup.string().when("type", {
                is: "DAY_OFF",
                then: (schema) => schema.required(t("Leave policy is required")),
                otherwise: (schema) => schema.strip(),
            }),
            vacation_end_date: Yup.date().when("type", {
                is: "DAY_OFF",
                then: (schema) => schema.min(
                    Yup.ref('vacation_date'),
                    t("Vacation end date must be after or equal to start date")
                ).nullable(),
                otherwise: (schema) => schema.nullable().strip(),
            }),
            leave_date: Yup.string().when("type", {
                is: "SHORT_LEAVE",
                then: (schema) => schema.required(t("Leave date is required")),
                otherwise: (schema) => schema.nullable().strip(),
            }),
            leave_start_time: Yup.string().when("type", {
                is: "SHORT_LEAVE",
                then: (schema) => schema.required(t("Start time is required")),
                otherwise: (schema) => schema.nullable().strip(),
            }),
            leave_end_time: Yup.string().when("type", {
                is: "SHORT_LEAVE",
                then: (schema) => schema.required(t("End time is required"))
                    .test("after-start", t("End time must be after start time"), function (value) {
                        const { leave_start_time } = this.parent;
                        if (!leave_start_time || !value) return true;
                        return value > leave_start_time;
                    }),
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
                        if (!userId) {
                            setApiResponse({ isOpen: true, status: "error", message: t("Your account information is not ready. Please try again.") });
                            return;
                        }
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
                            payload.vacation_end_date = values.vacation_end_date;
                            payload.leave_policy_id = values.leave_policy_id;
                        } else if (values.type === "SHORT_LEAVE") {
                            payload.leave_date = values.leave_date;
                            payload.leave_start_time = values.leave_start_time;
                            payload.leave_end_time = values.leave_end_time;
                        }

                        showProcessing(t("Submitting request..."));
                        const createdResponse = await createRequest(payload).unwrap();
                        const createdRequest = createdResponse?.data || createdResponse;
                        const requestId = createdRequest?._id || createdRequest?.id;
                        if (attachment && requestId) {
                            const formData = new FormData();
                            formData.append("file", attachment);
                            await uploadRequestAttachment({ id: requestId, formData }).unwrap();
                        }
                        hideProcessing();
                        setApiResponse({
                            isOpen: true,
                            status: "success",
                            message: t("Request submitted successfully"),
                        });
                        formik.resetForm();
                        setAttachment(null);
                        setTimeout(() => {
                            onClose();
                        }, 1500);
                    } catch (error) {
                        hideProcessing();
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

    const handleCloseModal = () => {
        if (isLoading) return;
        formik.resetForm();
        setAttachment(null);
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
        onClose();
    };

    const handleTypeChange = (selection) => {
        formik.setFieldValue("type", selection[0]?.id || "");
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleCloseModal}
                title={t("Create New Request")}
                className="lg:w-[40%] md:w-[60%] w-[90%]"
                isBtns={false}
                customBtns={
                    <div className="flex gap-4 justify-end w-full px-6 pb-6">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            disabled={isLoading}
                            className="px-8 py-2.5 rounded-xl border-2 border-status-border text-cell-secondary hover:bg-status-bg hover:text-cell-primary transition-all font-semibold"
                        >
                            {t("Cancel")}
                        </button>
                        <DefaultButton
                            title={isLoading ? t("Submitting...") : t("Submit Request")}
                            onClick={formik.handleSubmit}
                            disabled={isLoading || !formik.isValid}
                            variant="primary"
                            className="font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-primary-500/20"
                        />
                    </div>
                }
            >
                <div className="flex flex-col gap-6">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <ElementsSelect
                                    title={t("Leave Policy")}
                                    options={leaveBalances
                                        .filter(item => item.policy?.is_active)
                                        .map(item => ({
                                            id: item.policy._id,
                                            element: `${item.policy.name} — ${item.balance} ${t("days available")}`,
                                        }))}
                                    onChange={(selection) => formik.setFieldValue("leave_policy_id", selection[0]?.id || "")}
                                    placeholder={isLoadingBalances ? t("Loading...") : t("Select leave policy")}
                                    error={formik.touched.leave_policy_id && formik.errors.leave_policy_id}
                                />
                                {!isLoadingBalances && leaveBalances.length === 0 && (
                                    <p className="mt-2 text-xs text-red-500">{t("No leave policy or opening balance is available. Contact HR.")}</p>
                                )}
                            </div>
                            <InputAndLabel
                                title={t("Vacation Start Date")}
                                name="vacation_date"
                                type="date"
                                value={formik.values.vacation_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.vacation_date && formik.errors.vacation_date}
                                isRequired
                            />
                            <InputAndLabel
                                title={t("Vacation End Date")}
                                name="vacation_end_date"
                                type="date"
                                value={formik.values.vacation_end_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.vacation_end_date && formik.errors.vacation_end_date}
                            />
                        </div>
                    )}

                    {formik.values.type === "SHORT_LEAVE" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputAndLabel
                                title={t("Leave Date")}
                                name="leave_date"
                                type="date"
                                value={formik.values.leave_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.leave_date && formik.errors.leave_date}
                                isRequired
                            />
                            <InputAndLabel
                                title={t("Start Time")}
                                name="leave_start_time"
                                type="time"
                                value={formik.values.leave_start_time}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.leave_start_time && formik.errors.leave_start_time}
                                isRequired
                            />
                            <InputAndLabel
                                title={t("End Time")}
                                name="leave_end_time"
                                type="time"
                                value={formik.values.leave_end_time}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.leave_end_time && formik.errors.leave_end_time}
                                isRequired
                            />
                        </div>
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

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-cell-primary">{t("Attachments")} ({t("Optional")})</span>
                        <FileUpload onFileChange={setAttachment} />
                    </div>

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
                isSubmitting={isLoading}
            />
        </>
    );
}

CreateRequestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CreateRequestModal;
