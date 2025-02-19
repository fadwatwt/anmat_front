import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "../../../components/Modal/Modal.jsx";
import InputAndLabel from "../../../components/Form/InputAndLabel.jsx";
import SelectWithoutLabel from "../../../components/Form/SelectWithoutLabel.jsx";
import {
  createEmployee,
  fetchEmployees,
} from "../../../redux/employees/employeeAPI.js";
import { fetchRoles } from "../../../redux/roles/rolesSlice.js";
import { fetchDepartments } from "../../../redux/departments/departmentAPI.js";

function AddingAnEmployeeModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.employees);

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchEmployees());
      dispatch(fetchRoles()).then((res) => setRoles(res.payload.data)); // Fetch roles
      dispatch(fetchDepartments()).then((res) => setDepartments(res.payload)); // Fetch departments
    }
  }, [isOpen, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "",
      department: "",
      age: "",
      workingHours: "",
      workingDays: "",
      holidays: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Required"),
      phone: Yup.string().required("Required"),
      role: Yup.string().required("Required"),
      department: Yup.string().required("Required"),
      age: Yup.number().min(18, "Must be at least 18").required("Required"),
      workingHours: Yup.number().required("Required"),
      holidays: Yup.number().required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log({ values });

      dispatch(createEmployee(values)); // Send data to API
      resetForm();
      onClose();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={"Add Employee"}
      onClick={formik.handleSubmit}
      className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
      title={"Adding an Employee"}
    >
      <div className="px-1">
        <div className="flex flex-col gap-4">
          <InputAndLabel
            title="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Name"
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ""
            }
          />
          <InputAndLabel
            title="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Email"
            error={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ""
            }
          />
          <InputAndLabel
            title="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Phone Number"
            error={
              formik.touched.phone && formik.errors.phone
                ? formik.errors.phone
                : ""
            }
          />
          <InputAndLabel
            title="Password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Password"
            error={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ""
            }
          />
          <SelectWithoutLabel
            title={"Role"}
            name="role"
            value={formik.values.role} // Ensure it’s controlled
            onChange={(val) => formik.setFieldValue("role", val)} // Send _id
            onBlur={formik.handleBlur}
            options={roles} // Ensure _id is used internally but name is displayed
            error={
              formik.touched.role && formik.errors.role
                ? formik.errors.role
                : ""
            }
          />

          <SelectWithoutLabel
            title="Department"
            name="department"
            value={formik.values.department} // Ensure it’s controlled
            onChange={(val) => formik.setFieldValue("department", val)} // Send _id
            onBlur={formik.handleBlur}
            options={departments} // Ensure _id is used internally but name is displayed
            error={
              formik.touched.department && formik.errors.department
                ? formik.errors.department
                : ""
            }
          />
          <InputAndLabel
            title="Age"
            name="age"
            type="number"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Age"
            error={
              formik.touched.age && formik.errors.age ? formik.errors.age : ""
            }
          />
          <InputAndLabel
            title="Working Hours"
            name="workingHours"
            type="number"
            value={formik.values.workingHours}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Working Hours"
            error={
              formik.touched.workingHours && formik.errors.workingHours
                ? formik.errors.workingHours
                : ""
            }
          />
          <InputAndLabel
            title="Holidays"
            name="holidays"
            type="number"
            value={formik.values.holidays}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Number of Holidays"
            error={
              formik.touched.holidays && formik.errors.holidays
                ? formik.errors.holidays
                : ""
            }
          />
        </div>
      </div>
    </Modal>
  );
}

AddingAnEmployeeModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddingAnEmployeeModal;
