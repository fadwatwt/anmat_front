import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import { updateAttendance } from "@/redux/attendance/attendanceAPI";
import { fetchAllAttendance } from "@/redux/attendance/attendanceAPI";
import DateInput from "@/components/Form/DateInput";
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
      btnApplyTitle={"Update Attendance"}
      onClick={() => formik.handleSubmit()}
      className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
      title={"Edit Attendance Record"}
      isLoading={loading}
    >
      <div className="px-1">
        <div className="flex flex-col gap-4">
          {submissionError && (
            <div className="text-red-500 text-sm mb-2">{submissionError}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <DateInput
              title="Check-in Date"
              name="checkinDate"
              value={formik.values.checkinDate}
              onChange={(e) =>
                formik.setFieldValue("checkinDate", e.target.value)
              }
              onBlur={formik.handleBlur}
              max={format(new Date(), "yyyy-MM-dd")} // Prevent future dates for check-in
            />
            <div className="flex flex-col">
              <label className="text-sm dark:text-white mb-1">
                Check-in Time
              </label>
              <input
                type="time"
                name="checkinTime"
                value={formik.values.checkinTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl p-2"
              />
              {formik.touched.checkinTime && formik.errors.checkinTime && (
                <div className="text-red-500 text-sm">
                  {formik.errors.checkinTime}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DateInput
              title="Check-out Date"
              name="checkoutDate"
              value={formik.values.checkoutDate}
              onChange={(e) =>
                formik.setFieldValue("checkoutDate", e.target.value || null)
              }
              onBlur={formik.handleBlur}
              min={formik.values.checkinDate}
              max={getMaxCheckoutDate()}
              disabled={!formik.values.checkinDate}
            />
            <div className="flex flex-col">
              <label className="text-sm dark:text-white mb-1">
                Check-out Time
              </label>
              <input
                type="time"
                name="checkoutTime"
                value={formik.values.checkoutTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl p-2"
                disabled={!formik.values.checkoutDate}
              />
              {formik.touched.checkoutTime && formik.errors.checkoutTime && (
                <div className="text-red-500 text-sm">
                  {formik.errors.checkoutTime}
                </div>
              )}
            </div>
          </div>
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
