"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal.jsx";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { selectAuth } from "@/redux/auth/authSlice";
import { useCreateStripePaymentMethodMutation } from "@/redux/payment-methods/paymentMethodsApi";
import { RootRoute } from "@/Root.Route";
import getStripe from "@/lib/stripe-client";

function SecureCardForm({ onClose, onResult }) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [createStripePaymentMethod] = useCreateStripePaymentMethodMutation();
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [elementReady, setElementReady] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || isSaving) return;
    setIsSaving(true);

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
        confirmParams: { return_url: window.location.href },
      });
      if (error) throw new Error(error.message || t("Failed to add payment method"));
      if (setupIntent?.status !== "succeeded" || !setupIntent.payment_method) {
        throw new Error(t("Payment method verification was not completed."));
      }

      await createStripePaymentMethod({
        stripe_payment_method_id: setupIntent.payment_method,
        is_default: isDefault,
      }).unwrap();

      onClose();
      onResult("success", t("Payment method added successfully"));
    } catch (error) {
      onResult("error", error?.data?.message || error?.message || t("Failed to add payment method"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {!elementReady && <div className="h-24 animate-pulse rounded-xl bg-status-bg" />}
      <div className={elementReady ? "block" : "h-0 overflow-hidden"}>
        <PaymentElement onReady={() => setElementReady(true)} options={{ layout: "tabs" }} />
      </div>

      <label className="flex items-start gap-2 text-sm text-cell-primary">
        <input
          type="checkbox"
          className="mt-1"
          checked={isDefault}
          onChange={(event) => setIsDefault(event.target.checked)}
        />
        <span>
          <span className="block">{t("Save this method as default")}</span>
          <span className="block text-cell-secondary">
            {t("It will save your payment method as the default option.")}
          </span>
        </span>
      </label>

      <div className="flex gap-3 border-t border-status-border pt-4">
        <DefaultButton type="button" title={t("Cancel")} onClick={onClose} variant="secondary" className="flex-1" />
        <DefaultButton
          type="submit"
          title={isSaving ? t("Saving...") : t("Save")}
          disabled={!stripe || !elements || !elementReady || isSaving}
          variant="primary"
          className="flex-1"
        />
      </div>
    </form>
  );
}

SecureCardForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onResult: PropTypes.func.isRequired,
};

function AddNewPaymentModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { token } = useSelector(selectAuth);
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  useEffect(() => {
    if (!isOpen || !token) return;
    const controller = new AbortController();
    setClientSecret("");
    setIsInitializing(true);

    fetch(`${RootRoute}/api/subscriptions/subscriber/create-setup-intent`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result?.data?.clientSecret) {
          throw new Error(result?.message || t("Failed to initialize secure checkout."));
        }
        setClientSecret(result.data.clientSecret);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setApiResponse({ isOpen: true, status: "error", message: error.message || t("Failed to initialize secure checkout.") });
        }
      })
      .finally(() => setIsInitializing(false));

    return () => controller.abort();
  }, [isOpen, token, t]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isBtns={false}
        className="lg:w-5/12 md:w-8/12 w-11/12 p-0"
        title={t("Add New Payment Method")}
      >
        {isInitializing && <div className="h-32 animate-pulse rounded-xl bg-status-bg" />}
        {!isInitializing && clientSecret && (
          <Elements
            stripe={getStripe()}
            options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#0066FF" } } }}
          >
            <SecureCardForm
              onClose={onClose}
              onResult={(status, message) => setApiResponse({ isOpen: true, status, message })}
            />
          </Elements>
        )}
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
