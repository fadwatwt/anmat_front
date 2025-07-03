import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel.jsx";
import {
  updateEmployee,
  fetchEmployees,
} from "@/redux/employees/employeeAPI.js";
import { fetchRoles } from "@/redux/roles/rolesSlice.js";
import { fetchDepartments } from "@/redux/departments/departmentAPI.js";
import SelectAndLabel from "@/components/Form/SelectAndLabel";

function EditAnEmployeeModal({ isOpen, onClose, employee }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.employees);
  const [apiError, setApiError] = useState("");
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  console.log(roles, "roles");
  console.log(loading, "loading");

  useEffect(() => {
    if (isOpen) {
      setApiError("");
      dispatch(fetchRoles())
        ?.then((res) => {
          setRoles(
            res.payload.data.map((role) => ({
              value: role._id,
              label: role.name,
            }))
          );
        })
        .catch(() => setApiError("Failed to fetch roles. Please try again."));

      dispatch(fetchDepartments())
        ?.then((res) => {
          setDepartments(
            res.payload.map((dept) => ({
              value: dept._id,
              label: dept.name,
            }))
          );
        })
        .catch(() =>
          setApiError("Failed to fetch departments. Please try again.")
        );
    }
  }, [isOpen, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: employee?.name || "",
      email: employee?.email || "",
      workingHours: employee?.workingHours || "",
      holidays: employee?.holidays || "",
      department: employee?.department?._id || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      workingHours: Yup.number().required("Working hours are required"),
      holidays: Yup.number().required("Holidays are required"),
      department: Yup.string().required("Department is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiError("");
        await dispatch(
          updateEmployee({ id: employee._id, employeeData: values })
        )?.unwrap();
        dispatch(fetchEmployees());
        onClose();
      } catch (error) {
        setApiError(
          error.message || "Failed to update employee. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isOpen) {
      setApiError("");

      dispatch(fetchDepartments())
        ?.then((res) => {
          setDepartments(
            res.payload.map((dept) => ({
              _id: dept._id, // Ensure the correct property names
              name: dept.name,
            }))
          );
        })
        .catch(() =>
          setApiError("Failed to fetch departments. Please try again.")
        );
    }
  }, [isOpen, dispatch]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={formik.isSubmitting ? "Saving..." : "Edit Employee"}
      onClick={formik.handleSubmit}
      className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
      title={"Editing an Employee"}
      disableSubmit={formik.isSubmitting || !formik.isValid}
    >
      <div className="px-1">
        {apiError && (
          <div className="mb-4 text-red-500 text-sm">{apiError}</div>
        )}

        <div className="flex flex-col gap-4">
          <InputAndLabel
            title="Email"
            name="email"
            {...formik.getFieldProps("email")}
            error={formik.errors.email}
          />

          <InputAndLabel
            title="Role"
            name="role"
            {...formik.getFieldProps("role")}
            error={formik.errors.role}
          />

          <InputAndLabel
            title="Job Type"
            name="jobType"
            {...formik.getFieldProps("jobType")}
            error={formik.errors.jobType}
          />

          <InputAndLabel
            title="Salary"
            name="salary"
            type="number"
            {...formik.getFieldProps("salary")}
            error={formik.errors.salary}
          />

          <InputAndLabel
            title="Salary"
            name="salary"
            type="number"
            {...formik.getFieldProps("salary")}
            error={formik.errors.salary}
          />

          <SelectAndLabel
            title="Department"
            name="department"
            value={formik.values.department}
            onChange={(val) => formik.setFieldValue("department", val)} // Sending _id
            options={departments} // Ensure the correct structure
            error={formik.errors.department}
            onBlur={() => { }} />

          <InputAndLabel
            title="Working Hours"
            name="workingHours"
            type="number"
            {...formik.getFieldProps("workingHours")}
            error={formik.errors.workingHours}
          />

          <InputAndLabel
            title="Working Days"
            name="workingDays"
            type="number"
            {...formik.getFieldProps("workingDays")}
            error={formik.errors.workingDays}
          />

          <InputAndLabel
            title="Annual Leave Days"
            name="annualLeaveDays"
            type="number"
            {...formik.getFieldProps("annualLeaveDays")}
            error={formik.errors.annualLeaveDays}
          />

        </div>
      </div>
    </Modal>
  );
}

EditAnEmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
};

export default EditAnEmployeeModal;
