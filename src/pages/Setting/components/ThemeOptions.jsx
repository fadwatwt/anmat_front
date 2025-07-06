import { useState } from "react";
import ThemeOptionItem from "./ThemeOptionItem.jsx";
import { IoOptionsOutline, IoSunnyOutline } from "react-icons/io5";
import { MdOutlineDarkMode } from "react-icons/md";
import DefaultButton from "../../../components/Form/DefaultButton.jsx";
import useDarkMode from "../../../Hooks/useDarkMode.js";
import {useTranslation} from "react-i18next";

function ThemeOptions() {
    const {t} = useTranslation()
    const [theme, setTheme] = useDarkMode();
    const [tempTheme, setTempTheme] = useState(theme);

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

    const handleTempThemeChange = (value) => {
        setTempTheme(value);
        const root = window.document.documentElement;

        if (value === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
        } else if (value === "light") {
            root.classList.add("light");
            root.classList.remove("dark");
        } else {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            if (systemTheme === "dark") {
                root.classList.add("dark");
                root.classList.remove("light");
            } else {
                root.classList.add("light");
                root.classList.remove("dark");
            }
        }
    };

    const handleApplyChanges = () => {
        setTheme(tempTheme);
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
                            isActive={tempTheme === option.value}
                            onClick={() => handleTempThemeChange(option.value)}
                        />
                    ))}
                </div>
                <div className={"flex gap-3"}>
                    <DefaultButton type={'button'}  onClick={() => setTempTheme(theme)} title={"Cancel"} className={"font-medium dark:text-gray-200"} />
                    <DefaultButton type={'button'} onClick={handleApplyChanges} title={"Apply Changes"} className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"} />
                </div>
            </div>
        </div>
    );
}

export default ThemeOptions;
