"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import { updateAttendance } from "@/redux/attendance/attendanceAPI";
import { fetchAllAttendance } from "@/redux/attendance/attendanceAPI";
import DateInput from "@/components/Form/DateInput";
import ElementsSelect from "@/components/Form/ElementsSelect";
import TimeInput from "@/components/Form/TimeInput";
import InputWithIcon from "@/components/Form/InputWithIcon";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import {
  format,
  parseISO,
  isToday,
  parse,
  setHours,
  setMinutes,
  formatISO,
} from "date-fns";

function EditAttendanceModal({ isOpen, onClose, attendance }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.attendance);
  const [submissionError, setSubmissionError] = useState(null);
  const { employees } = useSelector((state) => state.employees);

  // Improved timezone handling
  const adjustForTimezone = (dateString, timeString) => {
    if (!dateString || !timeString) return null;

    try {
      // Parse the date and time
      const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
      const [hours, minutes] = timeString.split(":").map(Number);

      // Set the specific hours and minutes to the parsed date
      const adjustedDate = setMinutes(setHours(parsedDate, hours), minutes);

      // Convert to ISO string
      return formatISO(adjustedDate);
    } catch (error) {
      console.error("Error adjusting timezone:", error);
      return null;
    }
  };

  const employeeOptions = [
    { id: "1", element: "Palestine" },
    { id: "2", element: "َQater" },
    { id: "3", element: "Oman" },
    { id: "4", element: "Egpt" },
  ];

  const validationSchema = Yup.object().shape({
    checkinDate: Yup.string().required("Check-in date is required"),
    checkinTime: Yup.string().required("Check-in time is required"),
    checkoutDate: Yup.string()
      .nullable()
      .test(
        "checkout-date-validation",
        "Check-out date cannot be before check-in date",
        function (checkoutDate) {
          const { checkinDate } = this.parent;
          if (!checkoutDate || !checkinDate) return true;

          const checkinParsed = parse(checkinDate, "yyyy-MM-dd", new Date());
          const checkoutParsed = parse(checkoutDate, "yyyy-MM-dd", new Date());

          return checkoutParsed >= checkinParsed;
        }
      ),
    checkoutTime: Yup.string().test(
      "checkout-time-required",
      "Check-out time is required when date is provided",
      function (value) {
        return !this.parent.checkoutDate || (value && value.length > 0);
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      checkinDate: "",
      checkinTime: "08:00",
      checkoutDate: "",
      checkoutTime: "17:00",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmissionError(null);

        const checkin = adjustForTimezone(
          values.checkinDate,
          values.checkinTime
        );
        const checkout = values.checkoutDate
          ? adjustForTimezone(values.checkoutDate, values.checkoutTime)
          : null;

        const result = await dispatch(
          updateAttendance({
            id: attendance._id,
            data: { checkin, checkout },
          })
        );

        if (updateAttendance.fulfilled.match(result)) {
          await dispatch(fetchAllAttendance());
          onClose();
        } else {
          setSubmissionError(
            result.error?.message || "Failed to update attendance"
          );
        }
      } catch (error) {
        setSubmissionError(error.message || "An unexpected error occurred");
      }
    },
  });

  useEffect(() => {
    if (attendance && isOpen) {
      const parseAndFormat = (dateString, dateFormat, timeFormat) => {
        if (!dateString) return "";
        try {
          const date = parseISO(dateString);
          return {
            date: format(date, dateFormat),
            time: format(date, timeFormat),
          };
        } catch (error) {
          console.error("Error parsing date:", error);
          return { date: "", time: "" };
        }
      };

      const checkin = parseAndFormat(attendance.checkin, "yyyy-MM-dd", "HH:mm");
      const checkout = parseAndFormat(
        attendance.checkout,
        "yyyy-MM-dd",
        "HH:mm"
      );

      formik.resetForm({
        values: {
          checkinDate: checkin.date || "",
          checkinTime: checkin.time || "08:00",
          checkoutDate: checkout.date || "",
          checkoutTime: checkout.time || "17:00",
        },
      });
    }
  }, [attendance, isOpen]);

  // Disable checkout for the check-in date
  const getMaxCheckoutDate = () => {
    const checkinDate = formik.values.checkinDate;
    if (!checkinDate) return undefined;

    const parsedCheckinDate = parse(checkinDate, "yyyy-MM-dd", new Date());

    // If check-in is today, disable checkout on the same day
    if (isToday(parsedCheckinDate)) {
      return format(new Date(), "yyyy-MM-dd");
    }

    return undefined;
  };

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

EditAttendanceModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  attendance: PropTypes.object,
};

export default EditAttendanceModal;
