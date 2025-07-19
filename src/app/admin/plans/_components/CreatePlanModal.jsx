"use client"


import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import {
  createEmployee,
} from "@/redux/employees/employeeAPI.js";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import TagInput from "@/components/Form/TagInput";

function CreatePlanModal({ isOpen, onClose }) {

  const formik = useFormik({
    initialValues: {
      plan_name: "",
      price: "",
      features: ""
    },
    validationSchema: Yup.object({
      plan_name: Yup.string().required("Required"),
      price: Yup.string().required("Required"),
      features: Yup.string().required("Required")
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
      title={"Add Plan"}
    >
      <div className="px-1">
        <div className="flex flex-col gap-4">
          <InputAndLabel
            title="Plan"
            name="plan_name"
            value={formik.values.plan_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
            error={
              formik.touched.plan_name && formik.errors.plan_name
                ? formik.errors.plan_name
                : ""
            }
            isRequired={true}
          />

          <InputAndLabel
            title="Price"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
            error={
              formik.touched.price && formik.errors.price
                ? formik.errors.price
                : ""
            }
            isRequired={true}
          />

          <TagInput title="Features" isRequired={true}
            suggestions={[{ name: 'feature-1', id: 'feature-1' }, { name: 'feature-2', id: 'feature-2' }]}
            placeholder="Select Features..." />

        </div>
      </div>
    </Modal>
  );
}

CreatePlanModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default CreatePlanModal;
