"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import { useUpdateAttendanceMutation } from "@/redux/attendance/attendancesApi";
import DateInput from "@/components/Form/DateInput";
import TimeInput from "@/components/Form/TimeInput";
import InputWithIcon from "@/components/Form/InputWithIcon";
import { useProcessing } from "@/app/providers";
import { useTranslation } from "react-i18next";

function EditAttendanceModal({ isOpen, onClose, attendance }) {
  const { t } = useTranslation();
  const { showProcessing, hideProcessing } = useProcessing();
  const [updateAttendance] = useUpdateAttendanceMutation();
  const [submissionError, setSubmissionError] = useState(null);

  const validationSchema = Yup.object().shape({
    date: Yup.string().required(t("Date is required")),
    start_time: Yup.string().required(t("Start time is required")),
    end_time: Yup.string().nullable(),
    late_in_minutes: Yup.number().min(0, t("Late minutes cannot be negative")),
  });

  const formik = useFormik({
    initialValues: {
      date: "",
      start_time: "",
      end_time: "",
      late_in_minutes: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      showProcessing(t("Updating Attendance..."));
      try {
        setSubmissionError(null);
        const payload = { ...values };
        if (!payload.end_time) {
          delete payload.end_time;
        }
        await updateAttendance({ id: attendance._id, ...payload }).unwrap();
        onClose();
      } catch (error) {
        setSubmissionError(
          error?.data?.message || error.message || t("Failed to update attendance")
        );
      } finally {
        hideProcessing();
      }
    },
  });

  useEffect(() => {
    if (attendance && isOpen) {
      formik.resetForm({
        values: {
          date: attendance.date || "",
          start_time: attendance.start_time || "",
          end_time: attendance.end_time || "",
          late_in_minutes: attendance.late_in_minutes || 0,
        },
      });
    }
  }, [attendance, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={t("Save")}
      btnCancelTitle={t("Cancel")}
      onClick={() => formik.handleSubmit()}
      className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"
      title={t("Edit Attendance")}
    >
      <div className="px-1 overflow-visible">
        <div className="flex flex-col gap-4">
          {submissionError && (
            <div className="text-red-500 text-sm mb-2">{submissionError}</div>
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
            error={formik.touched.end_time && formik.errors.end_time}
          />

          <InputWithIcon
            title={t("Late Minutes")}
            name="late_in_minutes"
            type="number"
            value={formik.values.late_in_minutes}
            onChange={formik.handleChange}
            error={formik.touched.late_in_minutes && formik.errors.late_in_minutes}
          />
        </div>
      </div>
    </Modal>
  );
}

EditAttendanceModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  attendance: PropTypes.object,
};

export default EditAttendanceModal;
