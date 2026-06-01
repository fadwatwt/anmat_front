"use client";

import PropTypes from "prop-types";
import Alert from "./Alert";
import { useTranslation } from "react-i18next";

/**
 * Reusable modal to display API response status and message.
 * - Maps backend status (`success`, `failed`, `error`, etc.) to visual types.
 * - Stays visible until user clicks OK, close, or outside (via Alert's onClose).
 */
function ApiResponseAlert({
  isOpen,
  status,
  message,
  onClose,
  successTitle,
  errorTitle,
  warningTitle,
}) {
  const { t } = useTranslation();
  let type = "success";
  let title = successTitle || t("Success");
  errorTitle = errorTitle || t("Error");
  warningTitle = warningTitle || t("Notification");

  const normalizedStatus = (status || "").toLowerCase();

  if (normalizedStatus === "success") {
    type = "success";
    title = successTitle;
  } else if (normalizedStatus === "failed" || normalizedStatus === "error") {
    type = "error";
    title = errorTitle;
  } else {
    type = "warning";
    title = warningTitle;
  }

  return (
    <Alert
      isOpen={isOpen}
      onClose={onClose}
      type={type}
      title={title}
      message={typeof message === "string" ? t(message) : message}
      isBtns={true}
      hideCancelBtn={true}
      titleSubmitBtn={t("OK")}
    />
  );
}

ApiResponseAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  status: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onClose: PropTypes.func.isRequired,
  successTitle: PropTypes.string,
  errorTitle: PropTypes.string,
  warningTitle: PropTypes.string,
};

export default ApiResponseAlert;

