import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// Clock values are displayed as entered, without timezone conversion.
export default function ClockTime({ value }) {
  const { i18n } = useTranslation();
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(value || "");
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return <span>{value || "—"}</span>;
  const hour = Number(match[1]);
  const ar = i18n.language?.startsWith("ar");
  const period = hour < 12 ? (ar ? "ص" : "AM") : (ar ? "م" : "PM");
  return <span dir="ltr" className="inline-flex items-center gap-1.5 whitespace-nowrap tabular-nums font-medium"><span>{String(hour % 12 || 12).padStart(2, "0")}:{match[2]}</span><span className="text-xs">{period}</span></span>;
}
ClockTime.propTypes = { value: PropTypes.string };
