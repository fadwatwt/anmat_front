"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import DateInput from "@/components/Form/DateInput";
import TimeInput from "@/components/Form/TimeInput";

function EditLeaveModal({ isOpen, onClose, leave, onSubmit }) {
    const { t } = useTranslation();
    const [submissionError, setSubmissionError] = useState(null);

    const validationSchema = Yup.object().shape({
        date: Yup.string().required(t("Date is required")),
        start_time: Yup.string().required(t("Start time is required")),
        end_time: Yup.string().required(t("End time is required")),
    });

    const formik = useFormik({
        initialValues: {
            date: "",
            start_time: "",
            end_time: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setSubmissionError(null);
                await onSubmit(values);
                onClose();
            } catch (error) {
                setSubmissionError(error.message || "An error occurred");
            }
        },
    });

    useEffect(() => {
        if (leave && isOpen) {
            formik.resetForm({
                values: {
                    date: leave.date || "",
                    start_time: leave.start_time || "",
                    end_time: leave.end_time || "",
                },
            });
        }
    }, [leave, isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle={t("Save")}
            btnCancelTitle={t("Cancel")}
            onClick={() => formik.handleSubmit()}
            className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"
            title={t("Edit Short Leave")}
        >
            <div className="px-1 overflow-visible">
                <div className="flex flex-col gap-4">
                    {submissionError && (
                        <div className="text-red-error text-[11px] font-medium mb-1 p-2 bg-red-error/10 rounded-lg">{submissionError}</div>
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
                        <p className="text-red-error text-[11px] font-medium mt-[-12px] ml-1">{formik.errors.date}</p>
                    )}

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
