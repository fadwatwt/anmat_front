import InputAndLabel from "@/components/Form/InputAndLabel";
import { useTranslation } from "react-i18next";

function IntegrationSettingsForm() {
    const { t } = useTranslation();
    return (
        <div className={"flex flex-col gap-4 max-h-full pb-3"}>
            <InputAndLabel
                type="text"
                title={t("Account Email / ID")}
                isRequired={true}
                placeholder={t("Account Email")}
            />
            <InputAndLabel
                type="text"
                title={t("Client ID")}
                isRequired={true}
                placeholder={t("Client ID")}
            />

            <InputAndLabel
                type="text"
                title={t("Client Secret")}
                isRequired={true}
                placeholder={t("Client Secret")}
            />
            <InputAndLabel
                type="text"
                title={t("Mode")}
                isRequired={true}
                placeholder={t("Mode")}
            />
            <InputAndLabel
                type="text"
                title={t("Webhook URL")}
                isRequired={true}
                placeholder={t("Webhook URL")}
            />
            <InputAndLabel
                type="text"
                title={t("Callback URL")}
                isRequired={true}
                placeholder={t("Callback URL")}
            />

        </div>
    );
}

export default IntegrationSettingsForm;