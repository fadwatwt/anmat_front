import { useState } from "react";
import ThemeOptionItem from "./ThemeOptionItem.jsx";
import { IoOptionsOutline, IoSunnyOutline } from "react-icons/io5";
import { MdOutlineDarkMode } from "react-icons/md";
import useDarkMode from "@/Hooks/useDarkMode.js";
import { useTranslation } from "react-i18next";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert.jsx";

function ThemeOptions() {
    const { t } = useTranslation()
    const [theme, setTheme] = useDarkMode();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [pendingTheme, setPendingTheme] = useState(null);

    const themeOptions = [
        {
            title: "Light Mode",
            value: "light",
            icon: <IoSunnyOutline />,
            description: "Pick a clean and classic light theme",
        },
        {
            title: "Dark Mode",
            value: "dark",
            icon: <MdOutlineDarkMode />,
            description: "Pick a clean and classic dark theme",
        },
        {
            title: "System Mode",
            value: "system",
            icon: <IoOptionsOutline />,
            description: "Pick a clean and classic system theme",
        },
    ];

    const handleOptionSelect = (value) => {
        if (value === theme) return;
        setPendingTheme(value);
        setIsAlertOpen(true);
    };

    const handleConfirmTheme = () => {
        if (pendingTheme) {
            setTheme(pendingTheme);
        }
        setIsAlertOpen(false);
    };

    const handleCancelTheme = () => {
        setPendingTheme(null);
        setIsAlertOpen(false);
    };

    return (
        <div className={"flex flex-col gap-5 w-full py-2"}>
            <div className={"flex flex-col text-start gap-1"}>
                <p className={"dark:text-gray-200"}>{t("Theme Options")}</p>
                <p className={"text-sm dark:text-gray-200"}>{t("Select your preferences for your region")}</p>
            </div>
            <div className={"flex flex-col gap-3"}>
                <div className={"flex flex-col gap-3 py-2"}>
                    {themeOptions.map((option) => (
                        <ThemeOptionItem
                            key={option.value}
                            title={option.title}
                            icon={option.icon}
                            description={option.description}
                            isActive={pendingTheme ? pendingTheme === option.value : theme === option.value}
                            onClick={() => handleOptionSelect(option.value)}
                        />
                    ))}
                </div>
            </div>

            <ApprovalAlert
                isOpen={isAlertOpen}
                onClose={handleCancelTheme}
                onConfirm={handleConfirmTheme}
                title="Change Theme"
                message={t("Are you sure you want to change the theme to {{theme}}?", { theme: t(themeOptions.find(o => o.value === pendingTheme)?.title) })}
                confirmBtnText="Apply"
                cancelBtnText="Cancel"
                type="info"
            />
        </div>
    );
}

export default ThemeOptions;
