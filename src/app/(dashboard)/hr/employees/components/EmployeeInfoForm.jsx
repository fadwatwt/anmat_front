import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import DateInput from "@/components/Form/DateInput";

import { useTranslation } from "react-i18next";

function EmployeeInfoForm({ formData, updateFormData }) {
    const { t } = useTranslation();

    const countryOptions = [
        { id: "Egypt", element: t("Egypt") },
        { id: "Palestine", element: t("Palestine") },
        { id: "Jordan", element: t("Jordan") },
        { id: "Saudi Arabia", element: t("Saudi Arabia") },
    ];

    const cityOptions = [
        { id: "Cairo", element: t("Cairo") },
        { id: "Gaza", element: t("Gaza") },
        { id: "Amman", element: t("Amman") },
        { id: "Riyadh", element: t("Riyadh") },
    ];

    return (
        <div className={"flex flex-col gap-6 max-h-full pb-3"}>
            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-700/50 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1 border-l-4 border-primary-base pl-2">{t("Personal Information")}</h3>
                <InputAndLabel
                    type="text"
                    title={t("Full Name")}
                    isRequired={true}
                    placeholder={t("Enter full name")}
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputAndLabel
                        type="email"
                        title={t("Email")}
                        isRequired={true}
                        placeholder={t("Enter email")}
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                    />
                    <InputAndLabel
                        type="text"
                        title={t("Phone")}
                        isRequired={true}
                        placeholder={t("+123456789")}
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                    />
                </div>
                <DateInput
                    title={t("Date of Birth")}
                    isRequired={true}
                    value={formData.employee_detail.date_of_birth}
                    onChange={(e) => updateFormData("date_of_birth", e.target.value, true)}
                />
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-700/50 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1 border-l-4 border-primary-base pl-2">{t("Location")}</h3>
                <div className="grid grid-cols-2 gap-4">
                    <ElementsSelect
                        title={t("Country")}
                        options={countryOptions}
                        defaultValue={countryOptions.find(opt => opt.id === formData.employee_detail.country)}
                        onChange={(val) => updateFormData("country", val[0]?.id, true)}
                        name="country"
                        classNameContainer={"w-full"}
                    />
                    <ElementsSelect
                        title={t("City")}
                        options={cityOptions}
                        defaultValue={cityOptions.find(opt => opt.id === formData.employee_detail.city)}
                        onChange={(val) => updateFormData("city", val[0]?.id, true)}
                        name="city"
                        classNameContainer={"w-full"}
                    />
                </div>
            </div>
        </div>
    );
}

export default EmployeeInfoForm;