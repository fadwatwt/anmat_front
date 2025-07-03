"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

function ChangeBillingInfoModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.employees);

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchEmployees());
      dispatch(fetchRoles()).then((res) => setRoles(res.payload.data)); // Fetch roles
      dispatch(fetchDepartments()).then((res) => setDepartments(res.payload)); // Fetch departments
    }
  }, [isOpen, dispatch]);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      address: "",
      country: "",
      state: "",
      city: ""
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Required"),
      lastname: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      address: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      city: Yup.string().required("Required")
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
      title={"Change Billing Information"}
    >
      <div className="px-1">
        <div className="flex flex-col gap-4">
          <InputAndLabel
            title="First Name"
            name="firstname"
            value={formik.values.firstname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter First Name..."
            error={
              formik.touched.firstname && formik.errors.firstname
                ? formik.errors.firstname
                : ""
            }
            isRequired={true}
          />

          <InputAndLabel
            title="Last Name"
            name="lastname"
            value={formik.values.lastname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Last Name..."
            error={
              formik.touched.lastname && formik.errors.lastname
                ? formik.errors.lastname
                : ""
            }
            isRequired={true}
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
            isRequired={true}
          />

          <SelectAndLabel
            title={"Country"}
            name="country"
            value={formik.values.country} // Ensure it’s controlled
            onChange={(val) => formik.setFieldValue("country", val)} // Send _id
            onBlur={formik.handleBlur}
            options={countries} // Ensure _id is used internally but name is displayed
            error={
              formik.touched.country && formik.errors.country
                ? formik.errors.country
                : ""
            }
            placeholder={"Select Country..."}
            isRequired={true}
          />

          <SelectAndLabel
            title={"State/Region"}
            name="state"
            value={formik.values.state} // Ensure it’s controlled
            onChange={(val) => formik.setFieldValue("state", val)} // Send _id
            onBlur={formik.handleBlur}
            options={states} // Ensure _id is used internally but name is displayed
            error={
              formik.touched.state && formik.errors.state
                ? formik.errors.state
                : ""
            }
            placeholder={"Select State..."}
            isRequired={true}
          />

          <InputAndLabel
            title="City"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter City..."
            error={
              formik.touched.city && formik.errors.city
                ? formik.errors.city
                : ""
            }
            isRequired={true}
          />

        </div>
      </div>
    </Modal>
  );
}

ChangeBillingInfoModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ChangeBillingInfoModal;
