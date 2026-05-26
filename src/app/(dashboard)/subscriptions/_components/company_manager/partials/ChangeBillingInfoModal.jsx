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
import { useTranslation } from "react-i18next";

function ChangeBillingInfoModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const { loading } = useSelector((state) => state.employees);

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [countries] = useState([]);
  const [states] = useState([]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchEmployees());
      dispatch(fetchRoles()).then((res) => setRoles(res.payload.data)); // Fetch roles
      dispatch(fetchDepartments()).then((res) => setDepartments(res.payload)); // Fetch departments
    }
  }, [isOpen, dispatch]);
  console.log(roles, "roles");
  console.log(departments, "departments");

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
      firstname: Yup.string().required(t("Required")),
      lastname: Yup.string().required(t("Required")),
      email: Yup.string().email(t("Invalid email")).required(t("Required")),
      address: Yup.string().required(t("Required")),
      country: Yup.string().required(t("Required")),
      state: Yup.string().required(t("Required")),
      city: Yup.string().required(t("Required"))
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
      btnApplyTitle={t("Save")}
      onClick={formik.handleSubmit}
      className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 p-4"}
      title={t("Change Billing Information")}
    >
      <div className="px-1">
        <div className="flex flex-col gap-4">
          <InputAndLabel
            title={t("First Name")}
            name="firstname"
            value={formik.values.firstname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter First Name...")}
            error={
              formik.touched.firstname && formik.errors.firstname
                ? formik.errors.firstname
                : ""
            }
            isRequired={true}
          />

          <InputAndLabel
            title={t("Last Name")}
            name="lastname"
            value={formik.values.lastname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter Last Name...")}
            error={
              formik.touched.lastname && formik.errors.lastname
                ? formik.errors.lastname
                : ""
            }
            isRequired={true}
          />

          <InputAndLabel
            title={t("Email")}
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter Email")}
            error={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ""
            }
            isRequired={true}
          />

          <InputAndLabel
            title={t("Adress")}
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter Adress...")}
            error={
              formik.touched.address && formik.errors.address
                ? formik.errors.address
                : ""
            }
            isRequired={true}
          />

          <SelectAndLabel
            title={t("Country")}
            name="country"
            value={formik.values.country}
            onChange={(val) => formik.setFieldValue("country", val)}
            onBlur={formik.handleBlur}
            options={countries}
            error={
              formik.touched.country && formik.errors.country
                ? formik.errors.country
                : ""
            }
            placeholder={t("Select Country...")}
            isRequired={true}
          />

          <SelectAndLabel
            title={t("State/Region")}
            name="state"
            value={formik.values.state}
            onChange={(val) => formik.setFieldValue("state", val)}
            onBlur={formik.handleBlur}
            options={states}
            error={
              formik.touched.state && formik.errors.state
                ? formik.errors.state
                : ""
            }
            placeholder={t("Select State...")}
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
            title={t("City")}
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter City...")}
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
