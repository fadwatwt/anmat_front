import i18n from "i18next";
import { ar } from "date-fns/locale";
import { format } from "date-fns";

export const getDateLocale = () => (i18n.language === "ar" ? ar : undefined);

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AR_MONTHS = EN_MONTHS.map((m, i) =>
  format(new Date(2024, i, 1), "MMM", { locale: ar })
);

export const localizeMonthLabel = (label) => {
  if (i18n.language !== "ar" || typeof label !== "string") return label;
  const idx = EN_MONTHS.indexOf(label);
  return idx === -1 ? label : AR_MONTHS[idx];
};
