import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status";
import TagInput from "@/components/Form/TagInput";
import DefaultSelect from "@/components/Form/DefaultSelect";
import { useTranslation } from "react-i18next";

function CreateMoneyRecevivingForm() {
    const { t } = useTranslation();
    const optionsStatus = [
        { id: "1", element: <Status type={"Scheduled"} title={t("Scheduled")} /> },
        { id: "2", element: <Status type={"Delayed"} title={t("Delayed")} /> },
        { id: "3", element: <Status type={"Inactive"} title={t("Inactive")} /> },
        { id: "4", element: <Status type={"Active"} title={t("Active")} /> },
    ];
    const handleSelectChange = (name, value) => {
        console.log(name, value);
    };
    const suggestionsCurrancy = [
        { id: "1", name: "USD" },
        { id: "2", name: "SAR" },
    ]
    return (
        <div className={"flex flex-col gap-4 max-h-full pb-3"}>
            <InputAndLabel
                type="text"
                title={t("Money Receiving Method Name")}
                isRequired={true}
                placeholder={t("Online Payment")}
            />
            <InputAndLabel
                type="text"
                title={t("Type")}
                isRequired={true}
                placeholder={t("Credit Card")}
            />
            <ElementsSelect
                title={t("Provider")}
                options={optionsStatus}
                defaultValue={[optionsStatus[0]]}
                name="status"
                classNameContainer={"w-full"}
            />

            <InputAndLabel
                type="text"
                title={t("Fees")}
                disabled={true}
                isRequired={true}
                placeholder={t("22%")}
            />
            <TagInput suggestions={suggestionsCurrancy}
                title={t("Currency")}
                isRequired={true} placeholder={""} />
            <DefaultSelect title={t("Country")} options={[
                { _id: "1", value: t("Palestine") },
                { _id: "2", value: t("Palestine") },
                { _id: "3", value: t("Palestine") },
                { _id: "4", value: t("Palestine") }
            ]} onChange={() => { }} />
            <DefaultSelect title={t("Address")} options={[
                { _id: "1", value: t("Palestine") },
                { _id: "2", value: t("Palestine") },
                { _id: "3", value: t("Palestine") },
                { _id: "4", value: t("Palestine") }
            ]} onChange={() => { }} />

            <div className={"flex items-start gap-2"}>
                <div className={"pt-1 border-box"}>
                    <input type={"checkbox"} onChange={() => { }} checked={true} className={" checkbox-custom"} />
                </div>
                <div className={"text-cell-primary flex flex-col text-sm"}>
                    {t("Set this receiving method as default")}
                    <span className={"text-cell-secondary text-xs"}>{t("It will save your payment method as the default option.")}</span>
                </div>
            </div>

        </div>
    );
}

export default CreateMoneyRecevivingForm;