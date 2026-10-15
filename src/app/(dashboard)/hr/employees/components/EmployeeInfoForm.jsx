import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import DateInput from "@/components/Form/DateInput";
import { COUNTRIES } from "@/data/countriesCities";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";

function EmployeeInfoForm({ formData, updateFormData, errors = {}, isEdit = false }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language?.startsWith("ar");

    const selectedCountry = COUNTRIES.find((c) => c.en === formData.employee_detail.country);

    const countryOptions = COUNTRIES.map((c) => ({
        id: c.en,
        element: isArabic ? c.ar : c.en,
    }));

    const currentCountry = formData.employee_detail.country;
    if (currentCountry && !countryOptions.some((opt) => opt.id === currentCountry)) {
        countryOptions.unshift({ id: currentCountry, element: currentCountry });
    }

    const cityOptions = (selectedCountry?.cities || []).map((city) => ({
        id: city.en,
        element: isArabic ? city.ar : city.en,
    }));

    const currentCity = formData.employee_detail.city;
    if (currentCity && !cityOptions.some((opt) => opt.id === currentCity)) {
        cityOptions.unshift({ id: currentCity, element: currentCity });
    }

    return (
        <div className={"flex flex-col gap-6 max-h-full pb-3"}>
            <div className="bg-surface p-4 rounded-xl border border-status-border shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold text-cell-primary mb-1 border-l-4 border-primary-base pl-2">{t("Personal Information")}</h3>
                <InputAndLabel
                    type="text"
                    title={t("Full Name")}
                    isRequired={true}
                    placeholder={t("Enter full name")}
                    value={formData.name}
                    error={errors.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputAndLabel
                        type="email"
                        title={t("Email")}
                        isRequired={!isEdit}
                        disabled={isEdit}
                        placeholder={t("Enter email")}
                        value={formData.email}
                        error={errors.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                    />
                    <InputAndLabel
                        type="text"
                        title={t("Phone")}
                        isRequired={true}
                        placeholder={t("+123456789")}
                        value={formData.phone}
                        error={errors.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                    />
                </div>
                {!isEdit && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputAndLabel
                            type="password"
                            title={t("Password")}
                            isRequired={true}
                            placeholder={t("Enter password")}
                            value={formData.password}
                            error={errors.password}
                            onChange={(e) => updateFormData("password", e.target.value)}
                        />
                        <InputAndLabel
                            type="password"
                            title={t("Confirm Password")}
                            isRequired={true}
                            placeholder={t("Confirm password")}
                            value={formData.password_confirmation}
                            error={errors.password_confirmation}
                            onChange={(e) => updateFormData("password_confirmation", e.target.value)}
                        />
                    </div>
                )}
                <DateInput
                    title={t("Date of Birth")}
                    isRequired={true}
                    value={formData.employee_detail.date_of_birth}
                    error={errors.date_of_birth}
                    onChange={(e) => updateFormData("date_of_birth", e.target.value, true)}
                />
            </div>

            <div className="bg-surface p-4 rounded-xl border border-status-border shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold text-cell-primary mb-1 border-l-4 border-primary-base pl-2">{t("Location")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ElementsSelect
                        title={t("Country")}
                        options={countryOptions}
                        defaultValue={countryOptions.find(opt => opt.id === formData.employee_detail.country)}
                        onChange={(val) => {
                            const newCountry = val[0]?.id || "";
                            if (newCountry !== formData.employee_detail.country) {
                                updateFormData("city", "", true);
                            }
                            updateFormData("country", newCountry, true);
                        }}
                        name="country"
                        placeholder="Select country"
                        classNameContainer={"w-full"}
                    />
                    <ElementsSelect
                        title={t("City")}
                        options={cityOptions}
                        defaultValue={cityOptions.find(opt => opt.id === formData.employee_detail.city)}
                        onChange={(val) => updateFormData("city", val[0]?.id, true)}
                        name="city"
                        placeholder={selectedCountry ? "Select city" : "Select country first"}
                        classNameContainer={"w-full"}
                    />
                </div>
            </div>
        </div>
    );
}

EmployeeInfoForm.propTypes = {
    formData: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        password: PropTypes.string,
        password_confirmation: PropTypes.string,
        employee_detail: PropTypes.shape({
            country: PropTypes.string,
            city: PropTypes.string,
            date_of_birth: PropTypes.string,
        }),
    }).isRequired,
    updateFormData: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    errors: PropTypes.object,
};

export default EmployeeInfoForm;
