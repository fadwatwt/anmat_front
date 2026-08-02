import InputAndLabel from "@/components/Form/InputAndLabel";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { MONEY_RECEIVING_TYPES } from "../moneyReceivingConstants";

function CreateMoneyRecevivingForm({ values, handleChange, setFieldValue }) {
    const { t } = useTranslation();
    const typeOptions = MONEY_RECEIVING_TYPES.map(({ value, label }) => ({
        _id: value,
        name: t(label),
    }));

    return (
        <div className="flex flex-col gap-4 max-h-full pb-3">
            <InputAndLabel
                type="text"
                title={t("Money Receiving Method Name")}
                isRequired={true}
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder={t("Online Payment")}
            />
            <SelectAndLabel
                title={t("Type")}
                isRequired={true}
                name="type"
                value={values.type}
                options={typeOptions}
                onChange={(value) => setFieldValue("type", value)}
                onBlur={() => {}}
                placeholder={t("Select method type")}
            />

            <div className="flex items-start gap-2">
                <div className="pt-1 border-box">
                    <input
                        type="checkbox"
                        name="is_default"
                        checked={values.is_default}
                        onChange={(e) => setFieldValue("is_default", e.target.checked)}
                        className="checkbox-custom"
                    />
                </div>
                <div className="text-cell-primary flex flex-col text-sm">
                    {t("Set this receiving method as default")}
                    <span className="text-cell-secondary text-xs">
                        {t("It will save your payment method as the default option.")}
                    </span>
                </div>
            </div>
        </div>
    );
}

CreateMoneyRecevivingForm.propTypes = {
    values: PropTypes.object,
    handleChange: PropTypes.func,
    setFieldValue: PropTypes.func,
};

export default CreateMoneyRecevivingForm;
