import {useEffect, useState} from "react";

export default function useDarkMode() {
    const [theme, setTheme] = useState("system");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem("theme") || "system";
            setTheme(storedTheme);
            applyTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            applyTheme(theme);
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    const applyTheme = (theme) => {
        if (typeof window === "undefined") return; // تجنب الأخطاء في الخادم

        const root = document.documentElement;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

        root.classList.remove("dark", "light");

        if (theme === "system") {
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    };

    return [theme, setTheme];
}
