import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import i18n from "i18next";
import {useState} from "react";
import {useTranslation} from "react-i18next";

function RegionalPreferences() {
    const {t} = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [selectedTimezone, setSelectedTimezone] = useState("utc");
    const [selectedTimeFormat, setSelectedTimeFormat] = useState("12hr");
    const [selectedDateFormat, setSelectedDateFormat] = useState("mm-dd-yyyy");

    const langugeOptions = [
        {id: "en", element: "English"},
        {id: "ar", element: "Arabic"},
    ]
    const timeFormatOptions = [
        {id: "12hr", element: "12-hour format (AM/PM)"},
        {id: "24hr", element: "24-hour format"},
    ];
    const timezoneOptions = [
        {id: "utc", element: "UTC (Coordinated Universal Time)"},
        {id: "est", element: "EST (Eastern Standard Time)"},
        {id: "pst", element: "PST (Pacific Standard Time)"},
        {id: "cst", element: "CST (Central Standard Time)"},
        {id: "gmt", element: "GMT (Greenwich Mean Time)"},
    ];
    const dateFormatOptions = [
        {id: "mm-dd-yyyy", element: "MM/DD/YYYY"}, // مثال: 12/31/2024
        {id: "dd-mm-yyyy", element: "DD/MM/YYYY"}, // مثال: 31/12/2024
        {id: "yyyy-mm-dd", element: "YYYY-MM-DD"}, // مثال: 2024-12-31
        {id: "dd-month-yyyy", element: "DD Month YYYY"}, // مثال: 31 December 2024
        {id: "month-dd-yyyy", element: "Month DD, YYYY"}, // مثال: December 31, 2024
    ];
    const handelSetLanguage = (language) => {
        console.log("language", language);
        setSelectedLanguage(language)
    }

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        console.log("Language changed to:", language);
    };

    const handleApplyChanges = () => {
        changeLanguage(selectedLanguage);
    };
    return (
        <div className={"w-full md:py-2 flex flex-col gap-5"}>
            <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-col text-start gap-1"}>
                    <p className={"dark:text-gray-200"}>{t("Regional Preferences")}</p>
                    <p className={"text-sm dark:text-gray-200"}>{t("Select your preferences for your region")}</p>
                </div>
                <div className={"flex flex-col gap-2"}>
                    <ElementsSelect
                        title={"Language"}
                        defaultValue={langugeOptions.find(opt => opt.id === selectedLanguage)}
                        options={langugeOptions}
                        onChange={(vals) => handelSetLanguage(vals[0]?.id)}
                        isMultiple={false}
                    />
                    <ElementsSelect
                        title={"Timezone"}
                        defaultValue={timezoneOptions.find(opt => opt.id === selectedTimezone)}
                        options={timezoneOptions}
                        onChange={(vals)=> setSelectedTimezone(vals[0]?.id)}
                        isMultiple={false}
                    />
                    <ElementsSelect
                        title={"Time Format"}
                        defaultValue={timeFormatOptions.find(opt => opt.id === selectedTimeFormat)}
                        options={timeFormatOptions}
                        onChange={(vals)=> setSelectedTimeFormat(vals[0]?.id)}
                        isMultiple={false}
                    />
                    <ElementsSelect
                        title={"Date Format"}
                        defaultValue={dateFormatOptions.find(opt => opt.id === selectedDateFormat)}
                        options={dateFormatOptions}
                        onChange={(vals)=> setSelectedDateFormat(vals[0]?.id)}
                        isMultiple={false}
                    />
                </div>
            </div>
            <div className={"flex gap-2"}>
                <DefaultButton type={'button'} title={"Cancel"} className={"font-medium dark:text-gray-200"} />
                <DefaultButton type={'button'} onClick={handleApplyChanges} title={"Apply Changes"} className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"} />
            </div>
        </div>
    );
}

export default RegionalPreferences;