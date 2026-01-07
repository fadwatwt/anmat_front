"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ElementsSelect from "@/components/Form/ElementsSelect";
import InputWithIcon from "@/components/Form/InputWithIcon";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";

const validationSchema = Yup.object().shape({
    employeeId: Yup.string().required("Employee is required"),
    workType: Yup.string().required("Work type is required"),
    salary: Yup.number()
        .required("Salary is required")
        .min(0, "Salary must be at least 0"),
    bonuses: Yup.number().min(0, "Bonus must be at least 0"),
    deductions: Yup.number().min(0, "Discount must be at least 0"),
    comment: Yup.string(),
});

function AddSalaryModal({ isOpen, onClose, onSubmit }) {
    const { t } = useTranslation();
    const { employees } = useSelector((state) => state.employees);
    const [submissionError, setSubmissionError] = useState(null);

    const formik = useFormik({
        initialValues: {
            employeeId: "",
            workType: "Full-time",
            salary: 0,
            bonuses: 0,
            deductions: 0,
            comment: "",
        },
        validationSchema,
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

    const employeeOptions = [
        { id: "1", element: "Palestine" },
        { id: "2", element: "َQater" },
        { id: "3", element: "Oman" },
        { id: "4", element: "Egpt" },
    ];

    const workTypeOptions = [
        { id: "Full-time", element: t("Full-time") },
        { id: "Part-time", element: t("Part-time") },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle="Save"
            btnCancelTitle="Cancel"
            onClick={() => formik.handleSubmit()}
            className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"
            title="Add an employee salary"
        >
            <div className="px-1 overflow-visible">
                <div className="flex flex-col gap-4">
                    {submissionError && (
                        <div className="text-red-500 text-sm mb-2">{submissionError}</div>
                    )}

                    <ElementsSelect
                        title="Employee"
                        options={employeeOptions}
                        onChange={(selected) => formik.setFieldValue("employeeId", selected[0]?.id || "")}
                        placeholder="Select Employee"
                        defaultValue={employeeOptions.filter(opt => opt.id === formik.values.employeeId)}
                        isMultiple={false}
                    />
                    {formik.touched.employeeId && formik.errors.employeeId && (
                        <p className="text-red-500 text-xs mt-[-10px]">{formik.errors.employeeId}</p>
                    )}

                    <ElementsSelect
                        title="Work Type"
                        options={workTypeOptions}
                        onChange={(selected) => formik.setFieldValue("workType", selected[0]?.id || "")}
                        placeholder="Select Work Type"
                        defaultValue={workTypeOptions.filter(opt => opt.id === formik.values.workType)}
                        isMultiple={false}
                    />
                    {formik.touched.workType && formik.errors.workType && (
                        <p className="text-red-500 text-xs mt-[-10px]">{formik.errors.workType}</p>
                    )}

                    <InputWithIcon
                        title="Salary Amount"
                        name="salary"
                        type="number"
                        value={formik.values.salary}
                        onChange={formik.handleChange}
                        icon={<span className="text-gray-500">$</span>}
                        placeholder="0"
                        isRequired={true}
                        error={formik.touched.salary && formik.errors.salary}
                    />

                    <InputWithIcon
                        title="Bonus Amount"
                        name="bonuses"
                        type="number"
                        value={formik.values.bonuses}
                        onChange={formik.handleChange}
                        icon={<span className="text-gray-500 w-3">$</span>}
                        placeholder="0"
                        error={formik.touched.bonuses && formik.errors.bonuses}
                    />

                    <InputWithIcon
                        title="Discount Amount"
                        name="deductions"
                        type="number"
                        value={formik.values.deductions}
                        onChange={formik.handleChange}
                        icon={<span className="text-gray-500">$</span>}
                        placeholder="0"
                        error={formik.touched.deductions && formik.errors.deductions}
                    />

                    <TextAreaWithLabel
                        title="Comment"
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Comment"
                        rows={4}
                        isOptional={true}
                        error={formik.touched.comment && formik.errors.comment}
                    />
                </div>
            </div>
        </Modal>
    );
}

AddSalaryModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default AddSalaryModal;
