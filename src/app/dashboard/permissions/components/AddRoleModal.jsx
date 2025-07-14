"use client"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";

import {
  createEmployee,
  fetchEmployees,
} from "@/redux/employees/employeeAPI.js";
import { fetchRoles } from "@/redux/roles/rolesSlice.js";
import { fetchDepartments } from "@/redux/departments/departmentAPI.js";
import SelectAndLabel from "@/components/Form/SelectAndLabel.jsx";

function AddRoleModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  // const { loading } = useSelector((state) => state.employees);

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [permissions] = useState(['Add Project', 'Edit Project']);
  const [categories] = useState(['Projects']);
  console.log(roles, "roles");
  console.log(departments)

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
      categories: "",
      permissions: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      categories: Yup.array().required("Required"),
      permissions: Yup.array(),
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
      btnApplyTitle={"Save"}
      onClick={formik.handleSubmit}
      className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
      title={"Add Role"}
    >
      <div className="px-1">
        <div className="flex flex-col gap-4">
          <InputAndLabel
            title="Role Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Role Name..."
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ""
            }
            isRequired={true}
          />

          <SelectAndLabel
            title={"Categories"}
            name="categories"
            value={formik.values.categories} // Ensure it’s controlled
            onChange={(val) => formik.setFieldValue("categories", val)} // Send _id
            onBlur={formik.handleBlur}
            options={categories} // Ensure _id is used internally but name is displayed
            error={
              formik.touched.categories && formik.errors.categories
                ? formik.errors.categories
                : ""
            }
            placeholder={"Select Categories..."}
            isRequired={true}
          />

          <SelectAndLabel
            title={"Permissions"}
            name="permissions"
            value={formik.values.permissions} // Ensure it’s controlled
            onChange={(val) => formik.setFieldValue("permissions", val)} // Send _id
            onBlur={formik.handleBlur}
            options={permissions} // Ensure _id is used internally but name is displayed
            error={
              formik.touched.permissions && formik.errors.permissions
                ? formik.errors.permissions
                : ""
            }
            placeholder={"Select Permissions..."}
            isRequired={true}
          />

        </div>
      </div>
    </Modal>
  );
}

AddRoleModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddRoleModal;
