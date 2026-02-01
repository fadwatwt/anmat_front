"use client";
import { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import { useTranslation } from "react-i18next";
import ElementsSelect from "@/components/Form/ElementsSelect";
import InputWithIcon from "@/components/Form/InputWithIcon";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";

const validationSchema = Yup.object().shape({
    employee_id: Yup.string().required("Employee is required"),
    amount: Yup.number()
        .required("Amount is required")
        .min(0, "Amount must be at least 0"),
    bonus: Yup.number().min(0, "Bonus must be at least 0"),
    discount: Yup.number().min(0, "Discount must be at least 0"),
    comment: Yup.string(),
});

function AddSalaryModal({ isOpen, onClose, onSubmit }) {
    const { t } = useTranslation();
    const { data: employees = [], isLoading: isLoadingEmployees } = useGetEmployeesQuery();
    const [submissionError, setSubmissionError] = useState(null);
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            employee_id: "",
            amount: 0,
            bonus: 0,
            discount: 0,
            comment: "",
        },
        validationSchema,
        onSubmit: (values) => {
            setIsApprovalOpen(true);
        },
    });

    const handleConfirmSubmission = async () => {
        setIsApprovalOpen(false);
        try {
            setSubmissionError(null);
            await onSubmit(formik.values);
            formik.resetForm();
            onClose();
        } catch (error) {
            setSubmissionError(error?.data?.message || error.message || "An error occurred");
        }
    };

    const employeeOptions = useMemo(() => {
        return employees.map((emp) => ({
            id: emp._id,
            user_id: emp.user_id,
            element: emp.user?.name || emp.name || t("Unknown"),
        }));
    }, [employees, t]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                btnApplyTitle={t("Save")}
                btnCancelTitle={t("Cancel")}
                onClick={() => formik.handleSubmit()}
                className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"
                title={t("Add an employee salary transaction")}
            >
                <div className="px-1 overflow-visible">
                    <div className="flex flex-col gap-4">
                        {submissionError && (
                            <div className="text-red-500 text-sm mb-2">{submissionError}</div>
                        )}

                        <ElementsSelect
                            title={t("Employee")}
                            options={employeeOptions}
                            onChange={(selected) => formik.setFieldValue("employee_id", selected[0]?.user_id || "")}
                            placeholder={t("Select Employee")}
                            defaultValue={employeeOptions.filter(opt => opt.id === formik.values.employee_id)}
                            isMultiple={false}
                            isLoading={isLoadingEmployees}
                        />
                        {formik.touched.employee_id && formik.errors.employee_id && (
                            <p className="text-red-500 text-xs mt-[-10px]">{formik.errors.employee_id}</p>
                        )}

                        <InputWithIcon
                            title={t("Salary Amount")}
                            name="amount"
                            type="number"
                            value={formik.values.amount}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (val >= 0 || e.target.value === "") {
                                    formik.handleChange(e);
                                }
                            }}
                            icon={<span className="text-gray-500">$</span>}
                            placeholder="0"
                            isRequired={true}
                            error={formik.touched.amount && formik.errors.amount}
                        />

                        <InputWithIcon
                            title={t("Bonus Amount")}
                            name="bonus"
                            type="number"
                            value={formik.values.bonus}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (val >= 0 || e.target.value === "") {
                                    formik.handleChange(e);
                                }
                            }}
                            icon={<span className="text-gray-500 w-3">$</span>}
                            placeholder="0"
                            error={formik.touched.bonus && formik.errors.bonus}
                        />

                        <InputWithIcon
                            title={t("Discount Amount")}
                            name="discount"
                            type="number"
                            value={formik.values.discount}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (val >= 0 || e.target.value === "") {
                                    formik.handleChange(e);
                                }
                            }}
                            icon={<span className="text-gray-500">$</span>}
                            placeholder="0"
                            error={formik.touched.discount && formik.errors.discount}
                        />

                        <TextAreaWithLabel
                            title={t("Comment")}
                            name="comment"
                            value={formik.values.comment}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Comment")}
                            rows={4}
                            isOptional={true}
                            error={formik.touched.comment && formik.errors.comment}
                        />
                    </div>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={handleConfirmSubmission}
                title={t("Add Salary Transaction")}
                message={t("Are you sure you want to add this salary transaction?")}
            />
        </>
    );
}

AddSalaryModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default AddSalaryModal;
