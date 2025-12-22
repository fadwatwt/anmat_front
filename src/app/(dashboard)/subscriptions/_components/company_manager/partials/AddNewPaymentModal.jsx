"use client"

import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import DateInput from "@/components/Form/DateInput";

function AddNewPaymentModal({ isOpen, onClose }) {

  const formik = useFormik({
    initialValues: {
      nameOnCard: "",
      cardNumber: "",
      expirationDate: "",
      cvv: ""
    },
    validationSchema: Yup.object({
      nameOnCard: Yup.string().required("Required"),
      cardNumber: Yup.number().required("Required"),
      expirationDate: Yup.date("Invalid expirationDate").required("Required"),
      cvv: Yup.number().required("Required")
    }),
    onSubmit: (values, { resetForm }) => {
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
      title={"Add New Payment Method"}
    >
      <div className="px-1">
        <div className="flex flex-col gap-4">
          <InputAndLabel
            title="Name on Card"
            name="nameOnCard"
            value={formik.values.nameOnCard}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Name on Card..."
            error={
              formik.touched.nameOnCard && formik.errors.nameOnCard
                ? formik.errors.nameOnCard
                : ""
            }
            isRequired={true}
          />

          <InputAndLabel
            title="Card Number"
            name="cardNumber"
            value={formik.values.cardNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Card Number..."
            error={
              formik.touched.cardNumber && formik.errors.cardNumber
                ? formik.errors.cardNumber
                : ""
            }
            isRequired={true}
          />

          <div className="flex items-start gap-4 justify-between">
            <div className="w-1/2">
              <DateInput
                title="Expiration Date"
                name="expirationDate"
                value={formik.values.expirationDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Expiration Date..."
                error={
                  formik.touched.expirationDate && formik.errors.expirationDate
                    ? formik.errors.expirationDate
                    : ""
                }
                isRequired={true}
              />
            </div>

            <div className="w-1/2">
              <InputAndLabel
                title="CVV"
                name="cvv"
                value={formik.values.cvv}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter CVV..."
                error={
                  formik.touched.cvv && formik.errors.cvv
                    ? formik.errors.cvv
                    : ""
                }
                isRequired={true}
              />
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <div className="flex flex-col gap-0">
              <span className="text-sm text-gray-700">
                Save this method as default
              </span>
              <span className="text-sm text-gray-500">
                It will save your payment method as the default option.
              </span>
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
}

AddNewPaymentModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddNewPaymentModal;
