"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DateInput from "@/components/Form/DateInput";
import TimeInput from "@/components/Form/TimeInput";
import InputWithIcon from "@/components/Form/InputWithIcon";
import Modal from "@/components/Modal/Modal.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import PropTypes from "prop-types";

const validationSchema = Yup.object().shape({
    employeeId: Yup.string().required("Employee is required"),
    date: Yup.date().required("Date is required"),
    attendanceTime: Yup.string().required("Attendance time is required"),
    lateMinutes: Yup.number().min(0, "Late minutes must be at least 0"),
    comment: Yup.string(),
});

function AddAttendanceModal({ isOpen, onClose, onSubmit }) {
    const { t } = useTranslation();
    const { employees } = useSelector((state) => state.employees);
    const [submissionError, setSubmissionError] = useState(null);

    const formik = useFormik({
        initialValues: {
            employeeId: "",
            date: "",
            attendanceTime: "",
            lateMinutes: 0,
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle="Save"
            btnCancelTitle="Cancel"
            onClick={() => formik.handleSubmit()}
            className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"
            title="Add an employee attendance"
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

                    <DateInput
                        title="Date"
                        placeholder="Select Date"
                        name="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.date && formik.errors.date && (
                        <p className="text-red-500 text-xs mt-[-10px]">{formik.errors.date}</p>
                    )}

                    <TimeInput
                        title="Attendance Time"
                        name="attendanceTime"
                        value={formik.values.attendanceTime}
                        onChange={formik.handleChange}
                        isRequired={true}
                        error={formik.touched.attendanceTime && formik.errors.attendanceTime}
                    />

                    <InputWithIcon
                        title="Late Minutes"
                        name="lateMinutes"
                        type="number"
                        value={formik.values.lateMinutes}
                        onChange={formik.handleChange}
                        error={formik.touched.lateMinutes && formik.errors.lateMinutes}
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

AddAttendanceModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default AddAttendanceModal;
