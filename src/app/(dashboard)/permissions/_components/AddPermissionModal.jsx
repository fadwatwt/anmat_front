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

function setRoles(data) {
  console.log(data)
}

function setDepartments(payload) {
  console.log(payload)
}

function AddPermissionModal({ isOpen, onClose }) {
  const dispatch = useDispatch();

  const [permissions ] = useState(['Add', 'Edit', 'View', 'Delete']);
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
      permissions: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      permissions: Yup.array(),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log({ values });

      dispatch(createEmployee(values)); // Send data to API
      resetForm();
      onClose();
    },
  });

  const suggestions = [
    {id: 'add', name: 'add'},
    {id: 'edit', name: 'edit'},
    {id: 'view', name: 'view'},
    {id: 'delete', name: 'delete'},
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={"Save"}
      onClick={formik.handleSubmit}
      className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
      title={"Add Permission"}
    >
      <div className="px-1">
        <div className="flex flex-col gap-4">
          <InputAndLabel
            title="Permission Category"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Permission Category..."
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ""
            }
            isRequired={true}
          />

          <TagInput title="Permissions" isRequired={true} suggestions={suggestions} placeholder="Select Permissions..." />

        </div>
      </div>
    </Modal>
  );
}

AddPermissionModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddPermissionModal;
