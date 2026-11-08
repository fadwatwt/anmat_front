import i18n from "i18next";

export const getApiErrorMessage = (error, fallback) => {
  const message = error?.data?.message ?? error?.message;
  const isArabic = i18n.language?.startsWith("ar");
  const requestId = error?.data?.request_id;
  const base = Array.isArray(message) ? message.join("، ")
    : typeof message === "string" && message.trim() ? message : fallback;
  const localized = base === "Internal server error" && isArabic ? "حدث خطأ في الخادم" : base;
  return typeof requestId === "string" && /^[a-f0-9-]{8,64}$/i.test(requestId)
    ? `${localized} (${isArabic ? "رقم الطلب" : "Request ID"}: ${requestId})`
    : localized;
};
