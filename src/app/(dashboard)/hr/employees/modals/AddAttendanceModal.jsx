"use client";
import React, { useState } from "react";
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
import { useCreateAttendanceMutation } from "@/redux/attendance/attendancesApi";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { isBefore, isAfter, startOfToday, format as formatDate } from "date-fns";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

const validationSchema = Yup.object().shape({
    employee_id: Yup.string().required("Employee is required"),
    date: Yup.date()
        .required("Date is required")
        .max(new Date(), "Date cannot be in the future"),
    start_time: Yup.string()
        .required("Start time is required")
        .test("not-future", "Start time cannot be in the future", function (value) {
            const { date } = this.parent;
            if (!date || !value) return true;
            const selectedDate = new Date(date);
            const today = startOfToday();
            if (isAfter(selectedDate, today)) return false;
            if (isBefore(selectedDate, today)) return true;

            // If it's today, check time
            const now = new Date();
            const currentTime = formatDate(now, "HH:mm");
            return value <= currentTime;
        }),
    end_time: Yup.string()
        .required("End time is required")
        .test("after-start", "End time must be after start time", function (value) {
            const { start_time } = this.parent;
            if (!start_time || !value) return true;
            return value > start_time;
        })
        .test("not-future", "End time cannot be in the future", function (value) {
            const { date } = this.parent;
            if (!date || !value) return true;
            const selectedDate = new Date(date);
            const today = startOfToday();
            if (isAfter(selectedDate, today)) return false;
            if (isBefore(selectedDate, today)) return true;

            const now = new Date();
            const currentTime = formatDate(now, "HH:mm");
            return value <= currentTime;
        }),
    late_in_minutes: Yup.number()
        .min(0, "Late minutes must be at least 0")
        .integer("Late minutes must be a whole number")
        .required("Late minutes is required"),
    comment: Yup.string(),
});

function AddAttendanceModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const { data: employeesData } = useGetEmployeesQuery();
    const [createAttendance, { isLoading }] = useCreateAttendanceMutation();

    // Alerts State
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const formik = useFormik({
        initialValues: {
            employee_id: "",
            date: "",
            start_time: "",
            end_time: "",
            late_in_minutes: 0,
            comment: "",
        },
        validationSchema,
        onSubmit: () => {
            // Open approval alert instead of submitting directly
            setIsApprovalOpen(true);
        },
    });

    const onConfirmSave = async () => {
        try {
            await createAttendance(formik.values).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Attendance created successfully")
            });
            formik.resetForm();
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || error.message || t("Failed to create attendance")
            });
        }
    };

    const handleCloseApiResponse = () => {
        setApiResponse(prev => ({ ...prev, isOpen: false }));
        if (apiResponse.status === "success") {
            onClose();
        }
    };

    const employeeOptions = employeesData?.map(emp => ({
        id: emp.user_id,
        element: emp.user?.name || emp.name || "Unknown"
    })) || [];

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                btnApplyTitle={isLoading ? t("Saving...") : t("Save")}
                btnCancelTitle={t("Cancel")}
                onClick={() => formik.handleSubmit()}
                className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"
                title={t("Add an employee attendance")}
                isDisabled={isLoading}
            >
                <div className="px-1 overflow-visible">
                    <div className="flex flex-col gap-4">
                        <ElementsSelect
                            title={t("Employee")}
                            options={employeeOptions}
                            onChange={(selected) => formik.setFieldValue("employee_id", selected[0]?.id || "")}
                            placeholder={t("Select Employee")}
                            defaultValue={employeeOptions.filter(opt => opt.id === formik.values.employee_id)}
                            isMultiple={false}
                        />
                        {formik.touched.employee_id && formik.errors.employee_id && (
                            <p className="text-red-500 text-xs mt-[-10px]">{formik.errors.employee_id}</p>
                        )}

                        <DateInput
                            title={t("Date")}
                            placeholder={t("Select Date")}
                            name="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.date && formik.errors.date && (
                            <p className="text-red-500 text-xs mt-[-10px]">{formik.errors.date}</p>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <TimeInput
                                title={t("Start Time")}
                                name="start_time"
                                value={formik.values.start_time}
                                onChange={formik.handleChange}
                                isRequired={true}
                                error={formik.touched.start_time && formik.errors.start_time}
                            />

                            <TimeInput
                                title={t("End Time")}
                                name="end_time"
                                value={formik.values.end_time}
                                onChange={formik.handleChange}
                                isRequired={true}
                                error={formik.touched.end_time && formik.errors.end_time}
                            />
                        </div>

                        <InputWithIcon
                            title={t("Late Minutes")}
                            name="late_in_minutes"
                            type="number"
                            value={formik.values.late_in_minutes}
                            onChange={formik.handleChange}
                            error={formik.touched.late_in_minutes && formik.errors.late_in_minutes}
                        />

                        {/* <TextAreaWithLabel
                            title={t("Comment")}
                            name="comment"
                            value={formik.values.comment}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Comment")}
                            rows={4}
                            isOptional={true}
                            error={formik.touched.comment && formik.errors.comment}
                        /> */}
                    </div>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={onConfirmSave}
                title={t("Create Attendance")}
                message={t("Are you sure you want to create this attendance record?")}
                confirmBtnText={t("Confirm")}
                cancelBtnText={t("Cancel")}
                type="info"
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleCloseApiResponse}
                successTitle={t("Success")}
                errorTitle={t("Error")}
            />
        </>
    );
}

AddAttendanceModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
};

export default AddAttendanceModal;
