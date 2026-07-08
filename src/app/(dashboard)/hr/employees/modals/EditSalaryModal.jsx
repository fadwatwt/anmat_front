"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import { useTranslation } from "react-i18next";
import InputWithIcon from "@/components/Form/InputWithIcon";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";

function EditSalaryModal({ isOpen, onClose, onSubmit, data }) {
    const { t } = useTranslation();
    const [submissionError, setSubmissionError] = useState(null);

    const validationSchema = Yup.object().shape({
        salary: Yup.number()
            .required(t("Salary is required"))
            .min(0, t("Salary must be at least 0")),
        bonuses: Yup.number().min(0, t("Bonus must be at least 0")),
        deductions: Yup.number().min(0, t("Discount must be at least 0")),
        comment: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            salary: data?.salary || 0,
            bonuses: data?.bonus || 0,
            deductions: data?.deduction || 0,
            comment: data?.comment || "",
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                setSubmissionError(null);
                await onSubmit(values);
                formik.resetForm();
                onClose();
            } catch (error) {
                setSubmissionError(error.message || "An error occurred");
            }
        },
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle={t("Save")}
            btnCancelTitle={t("Cancel")}
            onClick={() => formik.handleSubmit()}
            className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"
            title={t("Edit Salary Transaction")}
        >
            <div className="px-1 overflow-visible">
                <div className="flex flex-col gap-4">
                    {submissionError && (
                        <div className="text-red-500 text-sm mb-2">{submissionError}</div>
                    )}

                    <InputWithIcon
                        title={t("Salary Amount")}
                        name="salary"
                        type="number"
                        value={formik.values.salary}
                        onChange={formik.handleChange}
                        icon={<span className="text-gray-500 dark:text-gray-400">$</span>}
                        placeholder="0"
                        isRequired={true}
                        error={formik.touched.salary && formik.errors.salary}
                    />

                    <InputWithIcon
                        title={t("Bonus Amount")}
                        name="bonuses"
                        type="number"
                        value={formik.values.bonuses}
                        onChange={formik.handleChange}
                        icon={<span className="text-gray-500 dark:text-gray-400 w-3">$</span>}
                        placeholder="0"
                        error={formik.touched.bonuses && formik.errors.bonuses}
                    />

                    <InputWithIcon
                        title={t("Discount Amount")}
                        name="deductions"
                        type="number"
                        value={formik.values.deductions}
                        onChange={formik.handleChange}
                        icon={<span className="text-gray-500 dark:text-gray-400">$</span>}
                        placeholder="0"
                        error={formik.touched.deductions && formik.errors.deductions}
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
    );
}

EditSalaryModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    data: PropTypes.object,
};

export default EditSalaryModal;
