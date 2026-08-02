import InputAndLabel from "@/components/Form/InputAndLabel";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function IntegrationSettingsForm({ values, handleChange, setFieldValue }) {
    const { t } = useTranslation();
    const attributes = values.attributes || [];

    const addAttribute = () => {
        setFieldValue("attributes", [
            ...attributes,
            { key: "", value: "", is_secret: false },
        ]);
    };

    const removeAttribute = (index) => {
        setFieldValue(
            "attributes",
            attributes.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="flex flex-col gap-4 max-h-full pb-3">
            <p className="text-xs text-cell-secondary">
                {t(
                    "Integration settings are optional. Add the keys required by this provider. Secret keys are encrypted and never shown again."
                )}
            </p>

            {attributes.map((attr, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-2 p-3 border border-status-border rounded-xl bg-status-bg"
                >
                    <div className="flex gap-2 w-full">
                        <InputAndLabel
                            title={t("Key")}
                            type="text"
                            name={`attributes.${index}.key`}
                            value={attr.key}
                            onChange={handleChange}
                            placeholder={t("e.g. secret_key")}
                        />
                        <button
                            type="button"
                            onClick={() => removeAttribute(index)}
                            className="mt-6 text-red-500 hover:text-red-600 shrink-0"
                            title={t("Remove")}
                        >
                            <RiDeleteBin7Line size={18} />
                        </button>
                    </div>
                    <InputAndLabel
                        title={t("Value")}
                        type="text"
                        name={`attributes.${index}.value`}
                        value={attr.value}
                        onChange={handleChange}
                        placeholder={t("Value")}
                    />
                    <label className="flex items-center gap-2 text-sm text-cell-primary cursor-pointer w-fit">
                        <input
                            type="checkbox"
                            checked={attr.is_secret}
                            onChange={(e) =>
                                setFieldValue(
                                    `attributes.${index}.is_secret`,
                                    e.target.checked
                                )
                            }
                            className="checkbox-custom"
                        />
                        {t("This is a secret key")}
                    </label>
                    {attr.is_masked && (
                        <span className="text-[11px] text-cell-secondary">
                            {t("Keep this value to preserve the stored secret")}
                        </span>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={addAttribute}
                className="border border-dashed border-primary-400 text-primary-500 rounded-xl py-2 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
                + {t("Add attribute")}
            </button>
        </div>
    );
}

IntegrationSettingsForm.propTypes = {
    values: PropTypes.object,
    handleChange: PropTypes.func,
    setFieldValue: PropTypes.func,
};

export default IntegrationSettingsForm;
