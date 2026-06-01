"use client"

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import DateInput from "@/components/Form/DateInput";
import { useTranslation } from "react-i18next";
import { useCreatePaymentMethodMutation } from "@/redux/payment-methods/paymentMethodsApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

const detectCardBrand = (number) => {
  const num = number?.replace(/\s/g, "") || "";
  if (/^4/.test(num)) return "Visa";
  if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return "Mastercard";
  if (/^3[47]/.test(num)) return "Amex";
  if (/^6(?:011|5)/.test(num)) return "Discover";
  return "Card";
};

function AddNewPaymentModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [createPaymentMethod, { isLoading }] = useCreatePaymentMethodMutation();
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const formik = useFormik({
    initialValues: {
      nameOnCard: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      isDefault: false,
    },
    validationSchema: Yup.object({
      nameOnCard: Yup.string().required(t("Required")),
      cardNumber: Yup.string()
        .required(t("Required"))
        .matches(/^\d{13,19}$/, t("Invalid card number")),
      expirationDate: Yup.date(t("Invalid expiration date")).required(t("Required")),
      cvv: Yup.string()
        .required(t("Required"))
        .matches(/^\d{3,4}$/, t("Invalid CVV")),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const expDate = new Date(values.expirationDate);
        const expMonth = expDate.getMonth() + 1;
        const expYear = expDate.getFullYear();
        const last4 = values.cardNumber.slice(-4);
        const brand = detectCardBrand(values.cardNumber);

        const body = {
          type: "CARD",
          is_default: values.isDefault,
          attributes: [
            { key: "name", value: values.nameOnCard },
            { key: "last4", value: last4 },
            { key: "brand", value: brand },
            { key: "exp_month", value: String(expMonth) },
            { key: "exp_year", value: String(expYear) },
          ],
        };

        await createPaymentMethod(body).unwrap();
        resetForm();
        setApiResponse({ isOpen: true, status: "success", message: t("Payment method added successfully") });
        onClose();
      } catch (error) {
        setApiResponse({
          isOpen: true,
          status: "error",
          message: error?.data?.message || t("Failed to add payment method"),
        });
      }
    },
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isBtns={true}
        btnApplyTitle={isLoading ? t("Saving...") : t("Save")}
        onClick={formik.handleSubmit}
        className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 p-4"}
        title={t("Add New Payment Method")}
      >
        <div className="px-1">
          <div className="flex flex-col gap-4">
            <InputAndLabel
              title={t("Name on Card")}
              name="nameOnCard"
              value={formik.values.nameOnCard}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("Enter Name on Card...")}
              error={
                formik.touched.nameOnCard && formik.errors.nameOnCard
                  ? formik.errors.nameOnCard
                  : ""
              }
              isRequired={true}
            />

            <InputAndLabel
              title={t("Card Number")}
              name="cardNumber"
              value={formik.values.cardNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("Enter Card Number...")}
              error={
                formik.touched.cardNumber && formik.errors.cardNumber
                  ? formik.errors.cardNumber
                  : ""
              }
              isRequired={true}
            />

            <div className="flex items-start gap-4 justify-between">
              <div className="w-full md:w-1/2">
                <DateInput
                  title={t("Expiration Date")}
                  name="expirationDate"
                  value={formik.values.expirationDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("Enter Expiration Date...")}
                  error={
                    formik.touched.expirationDate && formik.errors.expirationDate
                      ? formik.errors.expirationDate
                      : ""
                  }
                  isRequired={true}
                />
              </div>

              <div className="w-full md:w-1/2">
                <InputAndLabel
                  title={t("CVV")}
                  name="cvv"
                  value={formik.values.cvv}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("Enter CVV...")}
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
              <input
                type="checkbox"
                className="mt-1"
                checked={formik.values.isDefault}
                onChange={(e) => formik.setFieldValue("isDefault", e.target.checked)}
              />
              <div className="flex flex-col gap-0">
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {t("Save this method as default")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t("It will save your payment method as the default option.")}
                </span>
              </div>
            </div>

          </div>
        </div>
      </Modal>

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ isOpen: false, status: "", message: "" })}
      />
    </>
  );
}

AddNewPaymentModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddNewPaymentModal;
