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
import TagInput from "@/components/Form/TagInput";

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

  const categoriesSuggestions = [
    {id: 'projects', name: 'projects'},
    {id: 'tasks', name: 'tasks'}
  ]
  const permissionsSuggestions = [
    {id: 'add employee', name: 'add employee'},
    {id: 'edit project', name: 'edit project'}
  ]

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

          <TagInput title="Categories" isRequired={true} suggestions={categoriesSuggestions} placeholder="Select Categories..." />

          <TagInput title="Permissions" isRequired={true} suggestions={permissionsSuggestions} placeholder="Select Permissions..." />

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
