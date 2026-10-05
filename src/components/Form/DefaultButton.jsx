import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";


function DefaultButton({ title, onClick, className, type, disabled, variant }) {
    const { t } = useTranslation()
    // variant: primary = filled brand color, secondary = outline (default for Cancel)
    // className is still respected for backward compatibility.
    const isPrimary = variant === "primary" || (className || "").includes("bg-primary");
    const base = "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2 active:scale-[0.98]";
    const variantCls = isPrimary
        ? "bg-primary-base text-white border-primary-base hover:bg-primary-600 shadow-sm"
        : "bg-surface text-cell-primary border-status-border hover:bg-status-bg hover:text-cell-primary";
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}
            className={`${base} ${variantCls} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className || ""}`}
        >
            {t(title)}
        </button>
    );
}

DefaultButton.propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    variant: PropTypes.oneOf(["primary", "secondary"]),
}

export default DefaultButton;
