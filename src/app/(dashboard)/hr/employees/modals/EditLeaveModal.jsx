"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Keeping this if needed
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import DateInput from "@/components/Form/DateInput";
import ElementsSelect from "@/components/Form/ElementsSelect";
import TimeInput from "@/components/Form/TimeInput";
import InputWithIcon from "@/components/Form/InputWithIcon";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import { format } from "date-fns";

const validationSchema = Yup.object().shape({
    employeeId: Yup.string().required("Employee is required"),
    date: Yup.date().required("Date is required"),
    leaveTime: Yup.string().required("Leave time is required"),
    lateMinutes: Yup.number(),
    comment: Yup.string(),
});

function EditLeaveModal({ isOpen, onClose, leave, onSubmit }) {
    const { t } = useTranslation();
    const { employees } = useSelector((state) => state.employees) || { employees: [] };
    const [submissionError, setSubmissionError] = useState(null);

    const formik = useFormik({
        initialValues: {
            employeeId: "",
            date: "",
            leaveTime: "",
            lateMinutes: 0,
            comment: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setSubmissionError(null);
                await onSubmit({ ...leave, ...values });
                onClose();
            } catch (error) {
                setSubmissionError(error.message || "An error occurred");
            }
        },
    });

    useEffect(() => {
        if (leave && isOpen) {
            formik.setValues({
                employeeId: leave.employee?._id || leave.employeeId || "",
                date: leave.date ? format(new Date(leave.date), "yyyy-MM-dd") : "",
                leaveTime: leave.checkIn ? format(new Date(leave.checkIn), "HH:mm") : "", // Assuming checkIn holds the time or we use a specific field
                lateMinutes: leave.lateMinutes || 0,
                comment: leave.comment || "",
            });
        }
    }, [leave, isOpen]);

    // Mock options if employees are empty
    const employeeOptions = employees.length > 0 ? employees.map(e => ({ id: e._id, element: e.name })) : [
        { id: "1", element: "Fatima Ahmed" },
        { id: "2", element: "Sophia Williams" },
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
            title={t("Edit an employee Leave")}
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
                        disabled={true}
                    />

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
                        title="Leave Time"
                        name="leaveTime"
                        value={formik.values.leaveTime}
                        onChange={formik.handleChange}
                        isRequired={true}
                        error={formik.touched.leaveTime && formik.errors.leaveTime}
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

EditLeaveModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    leave: PropTypes.object,
    onSubmit: PropTypes.func,
};

export default EditLeaveModal;
