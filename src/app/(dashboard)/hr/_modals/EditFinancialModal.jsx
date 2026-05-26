"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { updateFinancialRecord } from "@/redux/financial/financialAPI";
import { fetchEmployees } from "@/redux/employees/employeeAPI";
import { useTranslation } from "react-i18next";
import ElementsSelect from "@/components/Form/ElementsSelect";
import InputWithIcon from "@/components/Form/InputWithIcon";



function EditFinancialModal({ isOpen, onClose, financialId, employeeId }) {
  const { t } = useTranslation();
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

  const validationSchema = Yup.object().shape({
    salary: Yup.number()
      .required(t("Salary is required"))
      .min(0, t("Salary must be at least 0")),
    bonuses: Yup.number().min(0, t("Bonuses must be at least 0")),
    deductions: Yup.number().min(0, t("Deductions must be at least 0")),
    workType: Yup.string().required(t("Work type is required")),
  });

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

  const workTypeOptions = [
    { id: "Full-time", element: t("Full-time") },
    { id: "Part-time", element: t("Part-time") },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={t("Save Changes")}
      onClick={() => formik.handleSubmit()}
      className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"
      title={t("Edit Financial Record")}
      isLoading={loading}
    >
      <div className="px-1 overflow-visible">
        <div className="flex flex-col gap-4">
          {submissionError && (
            <div className="text-red-500 text-sm mb-2">{submissionError}</div>
          )}

          <InputWithIcon
            title={t("Salary")}
            name="salary"
            type="number"
            value={formik.values.salary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            icon={<span className="text-gray-500 dark:text-gray-400">$</span>}
            placeholder="0"
            isRequired={true}
            error={formik.touched.salary && formik.errors.salary}
          />

          <InputWithIcon
            title={t("Bonuses")}
            name="bonuses"
            type="number"
            value={formik.values.bonuses}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            icon={<span className="text-gray-500 dark:text-gray-400">$</span>}
            placeholder="0"
            error={formik.touched.bonuses && formik.errors.bonuses}
          />

          <InputWithIcon
            title={t("Deductions")}
            name="deductions"
            type="number"
            value={formik.values.deductions}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            icon={<span className="text-gray-500 dark:text-gray-400">$</span>}
            placeholder="0"
            error={formik.touched.deductions && formik.errors.deductions}
          />

          <ElementsSelect
            title={t("Work Type")}
            options={workTypeOptions}
            onChange={(selected) => formik.setFieldValue("workType", selected[0]?.id || "")}
            placeholder={t("Select Work Type")}
            defaultValue={workTypeOptions.filter(opt => opt.id === formik.values.workType)}
            isMultiple={false}
          />
          {formik.touched.workType && formik.errors.workType && (
            <p className="text-red-500 text-xs mt-[-10px]">{formik.errors.workType}</p>
          )}
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
