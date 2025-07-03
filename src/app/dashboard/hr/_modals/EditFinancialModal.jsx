"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { updateFinancialRecord } from "@/redux/financial/financialAPI";
import { fetchEmployees } from "@/redux/employees/employeeAPI";

const validationSchema = Yup.object().shape({
  salary: Yup.number()
    .required("Salary is required")
    .min(0, "Salary must be at least 0"),
  bonuses: Yup.number().min(0, "Bonuses must be at least 0"),
  deductions: Yup.number().min(0, "Deductions must be at least 0"),
  workType: Yup.string().required("Work type is required"),
});

function EditFinancialModal({ isOpen, onClose, financialId, employeeId }) {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employees);
  const { loading } = useSelector(
    (state) => state.financial || { loading: false }
  );
  const [submissionError, setSubmissionError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    salary: 0,
    bonuses: 0,
    deductions: 0,
    workType: "Full-time",
  });

  // First, set the initial values when modal opens or employee changes
  useEffect(() => {
    if (employeeId && isOpen) {
      const employee = employees.find((e) => e._id === employeeId);
      const financial = employee?.financial || {};

      // Set initial values state
      setInitialValues({
        salary: financial.salary || 0,
        bonuses: financial.bonuses || 0,
        deductions: financial.deductions || 0,
        workType: financial.workType || "Full-time",
      });
    }
  }, [employeeId, isOpen, employees]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true, // This is crucial for the form to update when initialValues change
    onSubmit: async (values) => {
      try {
        setSubmissionError(null);

        // Check that employeeId is defined before submitting
        if (!employeeId) {
          setSubmissionError("Employee ID is missing or invalid");
          return;
        }

        const result = await dispatch(
          updateFinancialRecord({
            id: financialId,
            employeeId: employeeId, // Pass the employeeId explicitly
            financialData: values,
          })
        );

        if (updateFinancialRecord.fulfilled.match(result)) {
          await dispatch(fetchEmployees());
          onClose();
        } else {
          setSubmissionError(
            result.error?.message || "Failed to update financial record"
          );
        }
      } catch (error) {
        setSubmissionError(error.message || "An unexpected error occurred");
      }
    },
  });

  // For debugging purposes - check if values are properly set
  useEffect(() => {
    if (isOpen) {
      console.log("Modal is open, form values:", formik.values);
    }
  }, [isOpen, formik.values]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle="Save Changes"
      onClick={() => formik.handleSubmit()}
      className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"
      title="Edit Financial Record"
      isLoading={loading}
    >
      <div className="px-1">
        <div className="flex flex-col gap-4">
          {submissionError && (
            <div className="text-red-500 text-sm mb-2">{submissionError}</div>
          )}

          <div className="flex flex-col">
            <label className="text-sm dark:text-white mb-1">Salary</label>
            <input
              type="number"
              name="salary"
              value={formik.values.salary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl p-2"
            />
            {formik.touched.salary && formik.errors.salary && (
              <div className="text-red-500 text-sm">{formik.errors.salary}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm dark:text-white mb-1">Bonuses</label>
            <input
              type="number"
              name="bonuses"
              value={formik.values.bonuses}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl p-2"
            />
            {formik.touched.bonuses && formik.errors.bonuses && (
              <div className="text-red-500 text-sm">
                {formik.errors.bonuses}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm dark:text-white mb-1">Deductions</label>
            <input
              type="number"
              name="deductions"
              value={formik.values.deductions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl p-2"
            />
            {formik.touched.deductions && formik.errors.deductions && (
              <div className="text-red-500 text-sm">
                {formik.errors.deductions}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm dark:text-white mb-1">Work Type</label>
            <select
              name="workType"
              value={formik.values.workType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl p-2"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
            {formik.touched.workType && formik.errors.workType && (
              <div className="text-red-500 text-sm">
                {formik.errors.workType}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

EditFinancialModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  financialId: PropTypes.string,
  employeeId: PropTypes.string,
};

export default EditFinancialModal;
